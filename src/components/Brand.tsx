export default function Brand({ light = false }: { light?: boolean }) {
  return <a href="#home" aria-label="Rihla Travel and Tours home" className={`brand ${light ? 'text-white' : 'text-navy-900'}`}>
    <svg viewBox="0 0 44 52" fill="none" aria-hidden="true"><path d="M5 47V25C5 16 13 10 22 4C31 10 39 16 39 25V47M13 47V28C13 22 17 18 22 15C27 18 31 22 31 28V47M1 48H43" stroke="currentColor" strokeWidth="1.8"/><path d="M22 29V47M17 36H27" stroke="currentColor" strokeWidth="1.8"/></svg>
    <span><span className="brand-name">rihla<span className="text-gold-500">.</span></span><span className="brand-caption">TRAVEL & TOURS</span></span>
  </a>;
}
