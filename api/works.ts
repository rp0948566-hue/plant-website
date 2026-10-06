import type { VercelRequest, VercelResponse } from "@vercel/node";

export const defaultWorks = [
  {
    title: "Sadabahar (Periwinkle)",
    scientificName: "Catharanthus roseus",
    image: "/images/END/569dbf58-cbb8-4ecd-b27c-c980345f9d55.jpg",
    href: "#periwinkle",
    category: "Medicinal",
  },
  {
    title: "Crown of Thorns",
    scientificName: "Euphorbia milii",
    image: "/images/END/5c64518f-6b46-4ee8-9cd3-3dde2be6c904.jpg",
    href: "#crown-of-thorns",
    category: "Succulent",
  },
  {
    title: "China Rose (Hibiscus)",
    scientificName: "Hibiscus rosa-sinensis",
    image: "/images/END/665811c0-3bca-4d39-9ec6-c27bfb8ca0d9.jpg",
    href: "#hibiscus",
    category: "Ornamental",
  },
  {
    title: "Marigold (Genda)",
    scientificName: "Tagetes erecta",
    image: "/images/END/6975852e-1209-49ff-a0c1-71c4a0184106.jpg",
    href: "#marigold",
    category: "Solar Floral",
  },
  {
    title: "Bougainvillea",
    scientificName: "Bougainvillea spectabilis",
    image: "/images/END/7e10ff4b-c94f-45c8-aa84-9724c221a934.jpg",
    href: "#bougainvillea",
    category: "Climber",
  },
  {
    title: "Gandharaj (Gardenia)",
    scientificName: "Gardenia jasminoides",
    image: "/images/END/825e0a0e-15e2-485a-90f9-30202500c621.jpg",
    href: "#gardenia",
    category: "Perfumery",
  },
  {
    title: "Yellow Elder (Tecoma)",
    scientificName: "Tecoma stans",
    image: "/images/END/c039281d-b13a-40fb-8861-0762db9d0fc9.jpg",
    href: "#tecoma",
    category: "Arboreal",
  },
  {
    title: "Chinese Banyan (Ficus)",
    scientificName: "Ficus microcarpa",
    image: "/images/END/d16f7345-6979-4eff-ba85-3f6c14223fa7.jpg",
    href: "#ficus",
    category: "Living Bonsai",
  },
  {
    title: "Classic Rose (Gulab)",
    scientificName: "Rosa damascena",
    image: "/images/END/dec0e244-7d8e-4480-9350-a4ea73b63886.jpg",
    href: "#rose",
    category: "Archival Attar",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const query = typeof req.query.q === "string" ? req.query.q.toLowerCase() : null;

  let results = defaultWorks;
  if (query) {
    results = results.filter(
      (w) =>
        w.title.toLowerCase().includes(query) ||
        w.scientificName.toLowerCase().includes(query) ||
        w.category.toLowerCase().includes(query)
    );
  }

  res.status(200).json({
    success: true,
    count: results.length,
    data: results,
  });
}
