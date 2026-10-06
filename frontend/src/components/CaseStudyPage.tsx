import { useParams, useSearchParams } from "react-router-dom";
import { botanicalSpecimens } from "./ui/orbiting-carousel-with-animated-icons";
import { DEFAULT_WORKS } from "./ui/works-wheel";

export default function CaseStudyPage() {
  let { type, id } = useParams<{ type: string; id: string }>();
  useSearchParams();
  // Guard against missing params (should not happen in route)
  if (!type || !id) {
    return <p>Loading...</p>;
  }
  const numericId = parseInt(id, 10);
  let item: any = null;
  let title = "Case Study";

  if (type === "orbit") {
    item = botanicalSpecimens.find((s) => s.id === numericId);
    title = item ? `${item.name} Case Study` : "Orbit Case Study";
  } else if (type === "wheel") {
    item = DEFAULT_WORKS.find((_, idx) => idx + 1 === numericId);
    item = item ?? null;
    title = item ? `${item.title} Case Study` : "Wheel Case Study";
  }

  return (
    <section className="min-h-[80vh] sm:min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 sm:px-12 py-12">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-500 max-w-xl">
          Detailed botanical fieldwork notes and preservation methodology.
        </p>
      </div>

      {item ? (
        <div className="w-full max-w-2xl space-y-6">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={item.image}
              alt={type === "orbit" ? item.name : item.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold">{type === "orbit" ? item.name : item.title}</h2>
            {type === "orbit" && (
              <>
                <p className="text-sm font-mono tracking-[0.2em]">
                  Scientific Name: <span className="font-normal">{item.scientificName}</span>
                </p>
                <p className="text-sm font-mono tracking-[0.2em]">
                  Family: <span className="font-normal">{item.family}</span>
                </p>
                <p className="text-sm font-mono tracking-[0.2em]">
                  Category: <span className="font-normal">{item.category}</span>
                </p>
                <p className="text-sm font-mono tracking-[0.2em]">
                  Sheet Number: <span className="font-normal">{item.sheetNumber}</span>
                </p>
              </>
            )}
            {type === "wheel" && item.detail && (
              <p className="text-sm font-mono tracking-[0.2em]">{item.detail}</p>
            )}
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 max-w-xl">
              {type === "orbit" ? item.description : "Pressed specimen collected during fieldwork. Mounted following standard herbarium protocols."}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-neutral-500">Case study not found.</p>
      )}

      {/* Back to Home link */}
      <div className="mt-8">
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-sm font-medium rounded-full transition-colors"
        >
          ← Return to Archive
        </a>
      </div>
    </section>
  );
}