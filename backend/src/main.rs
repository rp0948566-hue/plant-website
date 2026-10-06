use axum::{
    extract::Query,
    http::{header, HeaderValue},
    response::{IntoResponse, Json},
    routing::get,
    Router,
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, path::PathBuf};
use tower::ServiceBuilder;
use tower_http::{
    compression::CompressionLayer,
    cors::{Any, CorsLayer},
    services::ServeDir,
    set_header::SetResponseHeaderLayer,
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// -----------------------------------------------------------------------------
// Botanical Data Models (Serde Serialized for Microsecond JSON Payloads)
// -----------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BotanicalSpecimen {
    pub id: u32,
    pub name: String,
    pub scientific_name: String,
    pub family: String,
    pub category: String,
    pub sheet_number: String,
    pub description: String,
    pub image: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorksWheelItem {
    pub title: String,
    pub scientific_name: String,
    pub image: String,
    pub href: String,
    pub category: String,
}

#[derive(Debug, Serialize)]
pub struct ArchiveStats {
    pub service: &'static str,
    pub engine: &'static str,
    pub version: &'static str,
    pub total_specimens: usize,
    pub total_works: usize,
    pub compression: &'static str,
    pub cache_policy: &'static str,
    pub uptime_seconds: u64,
}

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub count: usize,
    pub data: T,
}

// -----------------------------------------------------------------------------
// In-Memory Botanical Datasets (Zero Disk I/O Latency for API queries)
// -----------------------------------------------------------------------------

fn get_all_specimens() -> Vec<BotanicalSpecimen> {
    vec![
        BotanicalSpecimen {
            id: 1,
            name: "Gardenia (Gandharaj)".to_string(),
            scientific_name: "Gardenia jasminoides".to_string(),
            family: "Rubiaceae".to_string(),
            category: "Fragrant Ornamental Shrub".to_string(),
            sheet_number: "HERB-01".to_string(),
            description: "Distinguished by intensely fragrant porcelain-white blooms and lustrous, dark-green coriaceous leaves. Celebrated across classical botany and ceremonial perfumery for its calming, meditative essence.".to_string(),
            image: "/images/IMAGE/0e755a6a-649e-4c15-a5cf-011359c928fb.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 2,
            name: "Neem Tree".to_string(),
            scientific_name: "Azadirachta indica".to_string(),
            family: "Meliaceae".to_string(),
            category: "Sacred Medicinal Flora".to_string(),
            sheet_number: "HERB-02".to_string(),
            description: "Revered across ancient botanical pharmacopeias featuring serrated pinnate leaflets. Highly prized for natural antibacterial, purifying, and cellular regenerative botanical compounds.".to_string(),
            image: "/images/IMAGE/1528e485-40dd-4482-a081-cc24ca87f081.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 3,
            name: "Crown of Thorns".to_string(),
            scientific_name: "Euphorbia milii".to_string(),
            family: "Euphorbiaceae".to_string(),
            category: "Succulent Flowering Shrub".to_string(),
            sheet_number: "HERB-03".to_string(),
            description: "A resilient spinescent succulent displaying stout ribbed stems with protective thorns, crowned by bright emerald foliage and vivid scarlet petaloid cyathia.".to_string(),
            image: "/images/IMAGE/2446ea63-3b36-4f8b-b00c-fa218e1fec3d.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 4,
            name: "Madagascar Periwinkle".to_string(),
            scientific_name: "Catharanthus roseus".to_string(),
            family: "Apocynaceae".to_string(),
            category: "Enduring Medicinal Perennial".to_string(),
            sheet_number: "HERB-04".to_string(),
            description: "Evergreen herbaceous subshrub with glossy oval leaves and symmetrical salverform petals. Renowned in modern medicine as the primary source of life-saving vinca alkaloids.".to_string(),
            image: "/images/IMAGE/27cdd2d7-6403-4ff7-999e-8e32466d461a.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 5,
            name: "Hibiscus (China Rose)".to_string(),
            scientific_name: "Hibiscus rosa-sinensis".to_string(),
            family: "Malvaceae".to_string(),
            category: "Tropical Flowering Shrub".to_string(),
            sheet_number: "HERB-05".to_string(),
            description: "A magnificent tropical botanical specimen boasting flared crimson corollas and an iconic elongated staminal column. Cherished as a sacred offering of devotion and vitality.".to_string(),
            image: "/images/IMAGE/280d8781-19fb-4dbd-a1e4-a3598018638a.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 6,
            name: "Chinese Banyan".to_string(),
            scientific_name: "Ficus microcarpa".to_string(),
            family: "Moraceae".to_string(),
            category: "Canopy Fig / Living Bonsai".to_string(),
            sheet_number: "HERB-06".to_string(),
            description: "An enduring specimen featuring thick coriaceous leaves and sculptural aerial prop roots that anchor ancient canopies. An eternal symbol of rootedness and perseverance.".to_string(),
            image: "/images/IMAGE/432f6c47-bcd3-404e-905e-3f87d97aa987.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 7,
            name: "Bougainvillea (Paper Flower)".to_string(),
            scientific_name: "Bougainvillea spectabilis".to_string(),
            family: "Nyctaginaceae".to_string(),
            category: "Architectural Woody Climber".to_string(),
            sheet_number: "HERB-07".to_string(),
            description: "Thorny vigorous climber adorned with vivid paper-thin chartaceous bracts surrounding tiny cream tubular florets. A sun-drenched architectural drapery of timeless beauty.".to_string(),
            image: "/images/IMAGE/94713c19-0267-4f93-bb37-e96a1d1f3335.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 8,
            name: "Marigold (Genda)".to_string(),
            scientific_name: "Tagetes erecta".to_string(),
            family: "Asteraceae".to_string(),
            category: "Aromatic Solar Bloom".to_string(),
            sheet_number: "HERB-08".to_string(),
            description: "Intensely aromatic composite bloom featuring ruffled golden-orange floral globes. Ancient ritual flora rich in natural carotenoid pigments, radiating warmth and celebration.".to_string(),
            image: "/images/IMAGE/ea3b6b18-374b-400c-9762-58214325b0bc.jpg".to_string(),
        },
        BotanicalSpecimen {
            id: 9,
            name: "Classic Rose".to_string(),
            scientific_name: "Rosa damascena".to_string(),
            family: "Rosaceae".to_string(),
            category: "Aromatic Perennial Flora".to_string(),
            sheet_number: "HERB-09".to_string(),
            description: "The quintessential archival rose specimen with serrate leaflets and delicate multi-layered petals harvested for essential attar oils, celebrated in botanical poetry for centuries.".to_string(),
            image: "/images/IMAGE/f5dae4b8-cb5c-424a-bb7f-f334581df158.jpg".to_string(),
        },
    ]
}

fn get_all_works() -> Vec<WorksWheelItem> {
    vec![
        WorksWheelItem {
            title: "Sadabahar (Periwinkle)".to_string(),
            scientific_name: "Catharanthus roseus".to_string(),
            image: "/images/END/569dbf58-cbb8-4ecd-b27c-c980345f9d55.jpg".to_string(),
            href: "#periwinkle".to_string(),
            category: "Medicinal".to_string(),
        },
        WorksWheelItem {
            title: "Crown of Thorns".to_string(),
            scientific_name: "Euphorbia milii".to_string(),
            image: "/images/END/5c64518f-6b46-4ee8-9cd3-3dde2be6c904.jpg".to_string(),
            href: "#crown-of-thorns".to_string(),
            category: "Succulent".to_string(),
        },
        WorksWheelItem {
            title: "China Rose (Hibiscus)".to_string(),
            scientific_name: "Hibiscus rosa-sinensis".to_string(),
            image: "/images/END/665811c0-3bca-4d39-9ec6-c27bfb8ca0d9.jpg".to_string(),
            href: "#hibiscus".to_string(),
            category: "Ornamental".to_string(),
        },
        WorksWheelItem {
            title: "Marigold (Genda)".to_string(),
            scientific_name: "Tagetes erecta".to_string(),
            image: "/images/END/6975852e-1209-49ff-a0c1-71c4a0184106.jpg".to_string(),
            href: "#marigold".to_string(),
            category: "Solar Floral".to_string(),
        },
        WorksWheelItem {
            title: "Bougainvillea".to_string(),
            scientific_name: "Bougainvillea spectabilis".to_string(),
            image: "/images/END/7e10ff4b-c94f-45c8-aa84-9724c221a934.jpg".to_string(),
            href: "#bougainvillea".to_string(),
            category: "Climber".to_string(),
        },
        WorksWheelItem {
            title: "Gandharaj (Gardenia)".to_string(),
            scientific_name: "Gardenia jasminoides".to_string(),
            image: "/images/END/825e0a0e-15e2-485a-90f9-30202500c621.jpg".to_string(),
            href: "#gardenia".to_string(),
            category: "Perfumery".to_string(),
        },
        WorksWheelItem {
            title: "Yellow Elder (Tecoma)".to_string(),
            scientific_name: "Tecoma stans".to_string(),
            image: "/images/END/c039281d-b13a-40fb-8861-0762db9d0fc9.jpg".to_string(),
            href: "#tecoma".to_string(),
            category: "Arboreal".to_string(),
        },
        WorksWheelItem {
            title: "Chinese Banyan (Ficus)".to_string(),
            scientific_name: "Ficus microcarpa".to_string(),
            image: "/images/END/d16f7345-6979-4eff-ba85-3f6c14223fa7.jpg".to_string(),
            href: "#ficus".to_string(),
            category: "Living Bonsai".to_string(),
        },
        WorksWheelItem {
            title: "Classic Rose (Gulab)".to_string(),
            scientific_name: "Rosa damascena".to_string(),
            image: "/images/END/dec0e244-7d8e-4480-9350-a4ea73b63886.jpg".to_string(),
            href: "#rose".to_string(),
            category: "Archival Attar".to_string(),
        },
    ]
}

// -----------------------------------------------------------------------------
// Handlers
// -----------------------------------------------------------------------------

async fn root_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "online",
        "service": "Aethera Botanical Core (Rust Axum Engine)",
        "version": "0.1.0",
        "features": [
            "Brotli + Gzip Stream Compression",
            "31536000s Immutable Cache Headers",
            "Microsecond Serde Serialization",
            "Zero Disk I/O Specimen Serving"
        ],
        "endpoints": {
            "health": "/api/health",
            "specimens": "/api/specimens",
            "works": "/api/works",
            "stats": "/api/stats",
            "static_images": "/images/*"
        }
    }))
}

async fn health_handler() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "aethera-backend",
        "language": "Rust 2021",
        "runtime": "Tokio Async Engine",
        "framework": "Axum 0.8"
    }))
}

#[derive(Debug, Deserialize)]
struct SearchQuery {
    q: Option<String>,
}

async fn specimens_handler(Query(params): Query<SearchQuery>) -> impl IntoResponse {
    let all = get_all_specimens();
    let filtered: Vec<BotanicalSpecimen> = if let Some(query) = params.q {
        let q_lower = query.to_lowercase();
        all.into_iter()
            .filter(|s| {
                s.name.to_lowercase().contains(&q_lower)
                    || s.scientific_name.to_lowercase().contains(&q_lower)
                    || s.family.to_lowercase().contains(&q_lower)
            })
            .collect()
    } else {
        all
    };

    let count = filtered.len();
    Json(ApiResponse {
        success: true,
        count,
        data: filtered,
    })
}

async fn works_handler(Query(params): Query<SearchQuery>) -> impl IntoResponse {
    let all = get_all_works();
    let filtered: Vec<WorksWheelItem> = if let Some(query) = params.q {
        let q_lower = query.to_lowercase();
        all.into_iter()
            .filter(|w| {
                w.title.to_lowercase().contains(&q_lower)
                    || w.scientific_name.to_lowercase().contains(&q_lower)
                    || w.category.to_lowercase().contains(&q_lower)
            })
            .collect()
    } else {
        all
    };

    let count = filtered.len();
    Json(ApiResponse {
        success: true,
        count,
        data: filtered,
    })
}

static START_TIME: std::sync::OnceLock<std::time::Instant> = std::sync::OnceLock::new();

async fn stats_handler() -> impl IntoResponse {
    let start = START_TIME.get_or_init(std::time::Instant::now);
    let uptime = start.elapsed().as_secs();

    Json(ArchiveStats {
        service: "Aethera Botanical Core",
        engine: "Rust Axum + Tokio Multi-Threaded",
        version: "0.1.0",
        total_specimens: get_all_specimens().len(),
        total_works: get_all_works().len(),
        compression: "Brotli + Gzip (Transparent)",
        cache_policy: "public, max-age=31536000, immutable",
        uptime_seconds: uptime,
    })
}

// -----------------------------------------------------------------------------
// Image Path Resolution
// -----------------------------------------------------------------------------

fn resolve_images_directory() -> PathBuf {
    // Try current directory / public / images
    let candidates = [
        PathBuf::from("../frontend/public/images"),
        PathBuf::from("frontend/public/images"),
        PathBuf::from("public/images"),
        PathBuf::from("../public/images"),
    ];

    for candidate in &candidates {
        if candidate.exists() && candidate.is_dir() {
            tracing::info!("Found static botanical images directory at: {:?}", candidate);
            return candidate.clone();
        }
    }

    // Default fallback
    PathBuf::from("../frontend/public/images")
}

// -----------------------------------------------------------------------------
// Server Bootstrap
// -----------------------------------------------------------------------------

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    START_TIME.get_or_init(std::time::Instant::now);

    // Initialize structured logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "aethera_backend=debug,tower_http=debug,axum=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("⚡ Bootstrapping Aethera Botanical Core (Rust Engine)...");

    // Static images directory with immutable caching
    let images_dir = resolve_images_directory();

    // Immutable Cache-Control layer for high-speed delivery
    let cache_layer = SetResponseHeaderLayer::overriding(
        header::CACHE_CONTROL,
        HeaderValue::from_static("public, max-age=31536000, immutable"),
    );

    let serve_images = ServiceBuilder::new()
        .layer(cache_layer)
        .service(ServeDir::new(&images_dir));

    // Permissive CORS layer for seamless cross-origin Vite & deployment access
    let cors_layer = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Transparent Compression Layer (Brotli + Gzip)
    let compression_layer = CompressionLayer::new();

    // Assemble router
    let app = Router::new()
        .route("/", get(root_handler))
        .route("/api/health", get(health_handler))
        .route("/api/specimens", get(specimens_handler))
        .route("/api/works", get(works_handler))
        .route("/api/stats", get(stats_handler))
        .nest_service("/images", serve_images)
        .layer(cors_layer)
        .layer(compression_layer)
        .layer(TraceLayer::new_for_http());

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(8080);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("🚀 Aethera Rust Backend is live and listening on http://{}", addr);
    tracing::info!("   - Images CDN route: http://{}/images/", addr);
    tracing::info!("   - Botanical Specimens API: http://{}/api/specimens", addr);
    tracing::info!("   - Botanical Works API: http://{}/api/works", addr);
    tracing::info!("   - Health Check: http://{}/api/health", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
