import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StrokeTextProps {
  text: string;
  className?: string;
  fontSize?: string;
  delay?: number;
  triggerStart?: string;
}

const StrokeText = ({ text, className = "", fontSize = "10rem", delay = 0, triggerStart = "top 80%" }: StrokeTextProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const textEl = svgRef.current.querySelector("text");
    if (!textEl) return;

    const length = textEl.getComputedTextLength?.() || 2000;

    gsap.set(textEl, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: "transparent",
      stroke: "hsl(43, 59%, 52%)",
      strokeWidth: 1,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: triggerStart,
        toggleActions: "play none none none",
      },
    });

    tl.to(textEl, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
      delay,
    });

    tl.to(textEl, {
      fill: "hsl(43, 59%, 52%)",
      strokeWidth: 0,
      duration: 1.2,
      ease: "power2.out",
    }, "-=0.5");

    const replay = () => {
      const reTl = gsap.timeline();
      reTl.to(textEl, {
        fill: "transparent",
        strokeWidth: 1,
        strokeDashoffset: length,
        duration: 0.4,
        ease: "power2.in",
      });
      reTl.to(textEl, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.inOut",
      });
      reTl.to(textEl, {
        fill: "hsl(43, 59%, 52%)",
        strokeWidth: 0,
        duration: 1,
        ease: "power2.out",
      }, "-=0.4");
    };

    const intervalId = setInterval(replay, 10000);

    return () => {
      tl.kill();
      clearInterval(intervalId);
    };
  }, [text, delay, triggerStart]);

  return (
    <div ref={containerRef} className={`relative overflow-visible ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 1200 220"
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ overflow: "visible" }}
      >
        <text
          x="600"
          y="170"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', serif"
          fontSize={fontSize}
          fontWeight="300"
          fill="transparent"
          stroke="hsl(43, 59%, 52%)"
          strokeWidth="1"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default StrokeText;
