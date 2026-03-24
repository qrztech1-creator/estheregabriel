import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedBorderCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedBorderCard = ({ children, className = "", delay = 0 }: AnimatedBorderCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!cardRef.current || !borderRef.current) return;

    const rect = borderRef.current;
    const perimeter = rect.getTotalLength();

    gsap.set(rect, {
      strokeDasharray: perimeter,
      strokeDashoffset: perimeter,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    tl.to(rect, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.inOut",
      delay,
    });

    // Fade in content
    tl.fromTo(
      cardRef.current.querySelector(".card-content"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.8"
    );

    return () => { tl.kill(); };
  }, [delay]);

  return (
    <div ref={cardRef} className={`relative ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <rect
          ref={borderRef}
          x="0.5"
          y="0.5"
          width="calc(100% - 1px)"
          height="calc(100% - 1px)"
          rx="2"
          fill="none"
          stroke="hsl(43, 59%, 52%)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
        />
      </svg>
      <div className="card-content relative z-10 bg-card/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderCard;
