import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "@/assets/logo-homemusic.png";
import { useProposal } from "@/contexts/ProposalContext";

gsap.registerPlugin(ScrollTrigger);

const FooterSection = () => {
  const proposal = useProposal();
  const brideName = proposal?.bride_name ?? "Esther";
  const groomName = proposal?.groom_name ?? "Gabriel";
  const slug = proposal?.slug ?? "esther-gabriel-2027";
  const whatsappNumber = proposal?.whatsapp_number ?? "5527999936682";
  const brideInitial = brideName[0] ?? "E";
  const groomInitial = groomName[0] ?? "G";

  const logoRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    const paths = logoRef.current.querySelectorAll(".footer-letter");
    paths.forEach((path) => {
      const el = path as SVGTextElement;
      const length = el.getComputedTextLength?.() || 300;
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, fill: "transparent", stroke: "hsl(43, 59%, 52%)", strokeWidth: 1 });
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: logoRef.current, start: "top 85%" } });
    tl.to(paths, { strokeDashoffset: 0, duration: 2, stagger: 0.2, ease: "power2.inOut" });
    tl.to(paths, { fill: "hsl(43, 59%, 52%)", strokeWidth: 0, duration: 1, stagger: 0.1, ease: "power2.out" }, "-=0.5");
    const replay = () => {
      const reTl = gsap.timeline();
      reTl.to(paths, { fill: "transparent", strokeWidth: 1, strokeDashoffset: (i: number, el: SVGTextElement) => el.getComputedTextLength?.() || 300, duration: 0.4, ease: "power2.in" });
      reTl.to(paths, { strokeDashoffset: 0, duration: 1.8, stagger: 0.15, ease: "power2.inOut" });
      reTl.to(paths, { fill: "hsl(43, 59%, 52%)", strokeWidth: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.3");
    };
    const intervalId = setInterval(replay, 10000);
    return () => { clearInterval(intervalId); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const whatsappBase = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(0 0% 3.1%), hsl(0 0% 2%))" }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(43 59% 52%) 0, transparent 1px, transparent 60px)" }} />
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="flex justify-center mb-6"><img src={logo} alt="Home Music" className="h-16 md:h-20 w-auto opacity-80" /></div>

        <div className="flex justify-center mb-6">
          <svg ref={logoRef} viewBox="0 0 260 100" className="w-28 md:w-36" style={{ overflow: "visible" }}>
            <text className="footer-letter" x="65" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="90" fontWeight="300" fill="transparent" stroke="hsl(43, 59%, 52%)" strokeWidth="1" opacity="0.4">{brideInitial}</text>
            <text x="130" y="70" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="32" fontWeight="300" fontStyle="italic" fill="hsl(43, 59%, 52%)" opacity="0.25">&amp;</text>
            <text className="footer-letter" x="195" y="80" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="90" fontWeight="300" fill="transparent" stroke="hsl(43, 59%, 52%)" strokeWidth="1" opacity="0.4">{groomInitial}</text>
          </svg>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="text-center">
          <p className="font-display text-3xl md:text-4xl text-primary font-light mb-1">{brideName} & {groomName}</p>
          <p className="font-body text-sm text-muted-foreground mb-8">Curadoria musical para momentos que merecem ser inesquecíveis</p>

          <a href={`${whatsappBase}?text=${encodeURIComponent("Olá! Vi a proposta no site e gostaria de conversar.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-ui text-xs tracking-[0.2em] uppercase text-primary hover:text-foreground transition-colors duration-150 mb-10 hover:scale-105">
            <Phone className="w-4 h-4" />{whatsappNumber.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}
          </a>

          <div className="w-16 h-px bg-border mx-auto mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <a href={`/playlist/${slug}`} className="font-ui text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-150">Personalizar Repertório</a>
            <a href={`${whatsappBase}?text=${encodeURIComponent("Olá! Gostaria de aceitar a proposta musical. Podemos conversar?")}`} target="_blank" rel="noopener noreferrer" className="font-ui text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-150">Aceitar Proposta</a>
            <a href={`${whatsappBase}?text=${encodeURIComponent("Olá! Tenho algumas dúvidas sobre a proposta.")}`} target="_blank" rel="noopener noreferrer" className="font-ui text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-150">Tirar Dúvidas</a>
          </div>

          <button onClick={scrollToTop} className="group inline-flex items-center gap-2 font-ui text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 hover:text-primary transition-colors duration-150 mb-8">
            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform duration-150" />Voltar ao topo
          </button>

          <p className="font-body text-[10px] text-muted-foreground/30">© {new Date().getFullYear()} Home Music · Proposta exclusiva {brideName} & {groomName}</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
