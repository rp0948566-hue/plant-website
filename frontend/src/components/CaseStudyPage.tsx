import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, BookOpen, Leaf } from "lucide-react";
import { botanicalSpecimens } from "./ui/orbiting-carousel-with-animated-icons";
import { DEFAULT_WORKS } from "./ui/works-wheel";

const PRESERVATION_STEPS = [
  {
    step: "01",
    title: "Collection",
    text: "Healthy, undamaged leaves were picked during the midday walk and slipped between newspaper sheets the same hour, so wilting never set in.",
  },
  {
    step: "02",
    title: "Pressing",
    text: "Each leaf was spread flat — no folded edges or overlapping lobes — stacked between blotting papers with steady weight on top.",
  },
  {
    step: "03",
    title: "Drying",
    text: "Papers were changed over 7–10 days until every leaf turned crisp and papery. Rushing this step causes blackening and mould.",
  },
  {
    step: "04",
    title: "Mounting",
    text: "Dried specimens were fixed on archival sheets with paper strips, labelled with the botanical name, family and collection notes.",
  },
];

const SHEET_OBSERVATIONS = [
  "Leaf arrangement on the stem — opposite, alternate or whorled — the fastest field clue to a plant's family.",
  "Margin and tip shape — entire, serrated or lobed edges survive pressing clearly and separate look-alike species.",
  "Venation pressed flat — the midrib and side veins turn into a readable map once the leaf is fully dry.",
];

export default function CaseStudyPage() {
  const { type, id } = useParams<{ type: string; id: string }>();
  useSearchParams();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [lenis, type, id]);

  if (!type || !id) return <p className="p-8 text-center">Loading…</p>;
  const numericId = parseInt(id, 10);

  const isOrbit = type === "orbit";
  const total = isOrbit ? botanicalSpecimens.length : DEFAULT_WORKS.length;
  const valid = Number.isInteger(numericId) && numericId >= 1 && numericId <= total;

  const orbitItem = isOrbit && valid ? botanicalSpecimens[numericId - 1] : null;
  const wheelItem = !isOrbit && valid ? DEFAULT_WORKS[numericId - 1] : null;

  if (!valid || (!orbitItem && !wheelItem)) {
    return (
      <section className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-mono tracking-[0.25em] text-neutral-400 uppercase">Case study not found</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          <ArrowLeft size={14} /> Return to Archive
        </Link>
      </section>
    );
  }

  // Normalised fields for both sources
  const title = orbitItem ? orbitItem.name : wheelItem!.title;
  const image = orbitItem ? orbitItem.image : wheelItem!.image;
  const scientific = orbitItem
    ? orbitItem.scientificName
    : wheelItem!.detail?.split("•")[0]?.trim() ?? "";
  const family = orbitItem
    ? orbitItem.family
    : wheelItem!.detail?.split("•")[1]?.trim() ?? "";
  const category = orbitItem ? orbitItem.category : "Pressed Herbarium Sheet";
  const sheetNo = orbitItem ? orbitItem.sheetNumber : `HERB-${String(numericId).padStart(2, "0")}`;
  const fieldNote = orbitItem
    ? orbitItem.description
    : "Pressed specimen collected during the hostel-garden survey walk, chosen for a clean, representative leaf and mounted following standard herbarium protocol.";

  const prevId = numericId === 1 ? total : numericId - 1;
  const nextId = numericId === total ? 1 : numericId + 1;

  return (
    <section className="min-h-screen bg-white text-black px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> All specimens
        </Link>

        {/* Header */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-3">
            <BookOpen size={12} className="text-emerald-700" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-emerald-800">
              Case Study • {sheetNo}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight">{title}</h1>
          {scientific && (
            <p className="mt-1.5 font-serif italic text-neutral-500 text-base sm:text-lg flex items-center justify-center gap-1.5">
              <Leaf size={14} className="text-emerald-600 shrink-0" /> {scientific}
            </p>
          )}
        </div>

        {/* Image + taxonomy */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 items-start">
          <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] border border-black/5">
            <img src={image} alt={title} className="w-full h-auto object-cover" />
          </div>
          <dl className="rounded-2xl border border-black/10 bg-neutral-50/70 px-5 py-4 text-sm divide-y divide-black/5">
            {[
              ["Scientific name", scientific],
              ["Family", family],
              ["Category", category],
              ["Sheet number", sheetNo],
              ["Collection", "Hostel garden survey, midday walk"],
            ].map(([k, v]) => (
              <div key={k} className="py-2.5 flex flex-col gap-0.5">
                <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Field notes */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-serif font-medium">Field notes</h2>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-neutral-600">{fieldNote}</p>
        </div>

        {/* Preservation method */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-serif font-medium">How it was preserved</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PRESERVATION_STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-black/10 p-4 sm:p-5 bg-white shadow-sm">
                <div className="font-mono text-[11px] tracking-[0.2em] text-emerald-700">{s.step}</div>
                <div className="mt-1 font-semibold">{s.title}</div>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What to notice */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-serif font-medium">What to notice on the sheet</h2>
          <ul className="mt-3 space-y-2.5">
            {SHEET_OBSERVATIONS.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-sm sm:text-base text-neutral-600 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* Prev / Next */}
        <div className="mt-12 flex items-center justify-between gap-3 border-t border-black/10 pt-6">
          <Link
            to={`/case-study/${type}/${prevId}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft size={14} /> Prev
          </Link>
          <span className="font-mono text-[11px] sm:text-xs text-neutral-400">
            {String(numericId).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <Link
            to={`/case-study/${type}/${nextId}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-black transition-colors"
          >
            Next <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
