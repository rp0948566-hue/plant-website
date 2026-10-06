import type { VercelRequest, VercelResponse } from "@vercel/node";

export const botanicalSpecimens = [
  {
    id: 1,
    name: "Gardenia (Gandharaj)",
    scientificName: "Gardenia jasminoides",
    family: "Rubiaceae",
    category: "Fragrant Ornamental Shrub",
    sheetNumber: "HERB-01",
    description:
      "Distinguished by intensely fragrant porcelain-white blooms and lustrous, dark-green coriaceous leaves. Celebrated across classical botany and ceremonial perfumery for its calming, meditative essence.",
    image: "/images/IMAGE/0e755a6a-649e-4c15-a5cf-011359c928fb.jpg",
  },
  {
    id: 2,
    name: "Neem Tree",
    scientificName: "Azadirachta indica",
    family: "Meliaceae",
    category: "Sacred Medicinal Flora",
    sheetNumber: "HERB-02",
    description:
      "Revered across ancient botanical pharmacopeias featuring serrated pinnate leaflets. Highly prized for natural antibacterial, purifying, and cellular regenerative botanical compounds.",
    image: "/images/IMAGE/1528e485-40dd-4482-a081-cc24ca87f081.jpg",
  },
  {
    id: 3,
    name: "Crown of Thorns",
    scientificName: "Euphorbia milii",
    family: "Euphorbiaceae",
    category: "Succulent Flowering Shrub",
    sheetNumber: "HERB-03",
    description:
      "A resilient spinescent succulent displaying stout ribbed stems with protective thorns, crowned by bright emerald foliage and vivid scarlet petaloid cyathia.",
    image: "/images/IMAGE/2446ea63-3b36-4f8b-b00c-fa218e1fec3d.jpg",
  },
  {
    id: 4,
    name: "Madagascar Periwinkle",
    scientificName: "Catharanthus roseus",
    family: "Apocynaceae",
    category: "Enduring Medicinal Perennial",
    sheetNumber: "HERB-04",
    description:
      "Evergreen herbaceous subshrub with glossy oval leaves and symmetrical salverform petals. Renowned in modern medicine as the primary source of life-saving vinca alkaloids.",
    image: "/images/IMAGE/27cdd2d7-6403-4ff7-999e-8e32466d461a.jpg",
  },
  {
    id: 5,
    name: "Hibiscus (China Rose)",
    scientificName: "Hibiscus rosa-sinensis",
    family: "Malvaceae",
    category: "Tropical Flowering Shrub",
    sheetNumber: "HERB-05",
    description:
      "A magnificent tropical botanical specimen boasting flared crimson corollas and an iconic elongated staminal column. Cherished as a sacred offering of devotion and vitality.",
    image: "/images/IMAGE/280d8781-19fb-4dbd-a1e4-a3598018638a.jpg",
  },
  {
    id: 6,
    name: "Chinese Banyan",
    scientificName: "Ficus microcarpa",
    family: "Moraceae",
    category: "Canopy Fig / Living Bonsai",
    sheetNumber: "HERB-06",
    description:
      "An enduring specimen featuring thick coriaceous leaves and sculptural aerial prop roots that anchor ancient canopies. An eternal symbol of rootedness and perseverance.",
    image: "/images/IMAGE/432f6c47-bcd3-404e-905e-3f87d97aa987.jpg",
  },
  {
    id: 7,
    name: "Bougainvillea (Paper Flower)",
    scientificName: "Bougainvillea spectabilis",
    family: "Nyctaginaceae",
    category: "Architectural Woody Climber",
    sheetNumber: "HERB-07",
    description:
      "Thorny vigorous climber adorned with vivid paper-thin chartaceous bracts surrounding tiny cream tubular florets. A sun-drenched architectural drapery of timeless beauty.",
    image: "/images/IMAGE/94713c19-0267-4f93-bb37-e96a1d1f3335.jpg",
  },
  {
    id: 8,
    name: "Marigold (Genda)",
    scientificName: "Tagetes erecta",
    family: "Asteraceae",
    category: "Aromatic Solar Bloom",
    sheetNumber: "HERB-08",
    description:
      "Intensely aromatic composite bloom featuring ruffled golden-orange floral globes. Ancient ritual flora rich in natural carotenoid pigments, radiating warmth and celebration.",
    image: "/images/IMAGE/ea3b6b18-374b-400c-9762-58214325b0bc.jpg",
  },
  {
    id: 9,
    name: "Classic Rose",
    scientificName: "Rosa damascena",
    family: "Rosaceae",
    category: "Aromatic Perennial Flora",
    sheetNumber: "HERB-09",
    description:
      "The quintessential archival rose specimen with serrate leaflets and delicate multi-layered petals harvested for essential attar oils, celebrated in botanical poetry for centuries.",
    image: "/images/IMAGE/f5dae4b8-cb5c-424a-bb7f-f334581df158.jpg",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const query = typeof req.query.q === "string" ? req.query.q.toLowerCase() : null;

  let results = botanicalSpecimens;
  if (query) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.scientificName.toLowerCase().includes(query) ||
        s.family.toLowerCase().includes(query)
    );
  }

  res.status(200).json({
    success: true,
    count: results.len ?? results.length,
    data: results,
  });
}
