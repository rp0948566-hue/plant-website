interface Props {
  onScrollToTop?: () => void;
}

export default function HerbariumFooter({ onScrollToTop }: Props) {
  return (
    <footer id="about-section" className="relative w-full bg-[#18231E] text-[#EFE8DC] pt-16 sm:pt-24 pb-12 px-4 sm:px-10 lg:px-16 border-t border-[#26372F]">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header of Footer */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-[#2C3E36]">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#3F4E49] text-white flex items-center justify-center text-lg">
              🌿
            </span>
            <div>
              <h3 className="text-2xl font-serif tracking-tight font-medium text-white">
                Leaf Herbarium
              </h3>
              <p className="text-xs text-[#95A59D] uppercase tracking-wider font-semibold">
                Department of Botany • Fieldwork & Preservation Archive
              </p>
            </div>
          </div>

          {/* Quick Back to Top button */}
          <button
            onClick={onScrollToTop}
            className="px-5 py-2.5 rounded-full bg-[#273730] hover:bg-[#34473F] text-xs font-semibold text-[#D6DFDA] border border-[#3C5046] hover:text-white transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Back to Top</span>
            <span>↑</span>
          </button>
        </div>

        {/* ── Academic Project Submission Dossier ─────────────────────── */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-[#2C3E36]">
          
          {/* Left Column: Project Abstract & Scope */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2B5AB] block">
              Project Abstract & Scope
            </span>
            <h4 className="text-2xl font-serif text-white leading-snug">
              Morphological Analysis & Herbarium Preservation of Common Angiosperm Leaves
            </h4>
            <p className="text-sm text-[#AAB8B1] leading-relaxed">
              This academic submission demonstrates the foundational techniques of specimen collection, press-drying, herbarium sheet preparation, and binominal taxonomical classification. Field survey conducted at Scheme No 114, Indore with complete camera GPS and atmospheric logging.
            </p>

            <blockquote className="pt-3 border-l-2 border-[#4E675B] pl-4 text-xs italic text-[#BAC8C1]">
              “In every walk with nature, one receives far more than he seeks.”
              <span className="block not-italic text-[#8C9C94] mt-1">— John Muir</span>
            </blockquote>
          </div>

          {/* Right Column: Student & Institutional Dossier */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-[#1E2B25] border border-[#2F443B] shadow-inner">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2C3E36]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D5DFC6]">
                Academic Submission Credentials
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#2D3E35] text-[11px] font-mono text-emerald-300">
                Verified Session 2026–27
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#86978F] block">
                  Student Name / Researcher
                </span>
                <span className="font-semibold text-white text-sm">
                  Botany Student Researcher
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#86978F] block">
                  Roll / Enrollment Number
                </span>
                <span className="font-mono text-white text-sm">
                  BOT-2026-IND-08
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#86978F] block">
                  Course & Subject
                </span>
                <span className="text-[#DEE6E2]">
                  B.Sc. Botany • Plant Taxonomy & Morphology
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#86978F] block">
                  College / Institute
                </span>
                <span className="text-[#DEE6E2]">
                  Indore College of Science & Technology
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-[#2B3D34]">
                <span className="text-[10px] uppercase font-bold text-[#86978F] block">
                  Field Collection Station
                </span>
                <span className="text-[#DEE6E2]">
                  Velocity Girls Hostel, Scheme No 114, Indore, Madhya Pradesh
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-lg bg-[#16211C] border border-[#26372E] text-[11px] text-[#93A59C]">
              💡 <strong className="text-[#D3DFC6]">Note for Teacher / Examiner:</strong> Complete original handwritten herbarium sheets and 9 geotagged field photos have been preserved and archived within this digital portal.
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7F9189]">
          <p>© 2026 Leaf Herbarium Project • Handcrafted for Academic Botanical Excellence</p>
          <div className="flex items-center gap-6">
            <span>8 Specimens Preserved</span>
            <span>Indore, M.P.</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
