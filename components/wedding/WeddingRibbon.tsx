"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type WeddingRibbonProps = {
  onReleased?: () => void;
};

const KNOT_FRAMES = [
  "/ribbon/knot/01-tied.png",
  "/ribbon/knot/02-tight.png",
  "/ribbon/knot/03-loosening.png",
  "/ribbon/knot/04-left-slip.png",
  "/ribbon/knot/05-open.png",
  "/ribbon/knot/06-released.png",
  "/ribbon/knot/07-falling.png",
];

export default function WeddingRibbon({
  onReleased,
}: WeddingRibbonProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const releasedRef = useRef(false);

  const [activeFrame, setActiveFrame] = useState(0);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const releaseRibbon = () => {
    if (releasedRef.current) return;

    releasedRef.current = true;

    const tl = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        onReleased?.();
      },
    });

    timelineRef.current = tl;

    /*
     * ==========================================================
     * 1. THE RIBBON TIGHTENS
     * ==========================================================
     */

    tl.to(
      ".ribbon-left",
      {
        x: -5,
        duration: 0.18,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      ".ribbon-right",
      {
        x: 5,
        duration: 0.18,
        ease: "power2.out",
      },
      0
    );

    /*
     * Knot slightly compresses.
     */

    tl.to(
      ".knot-container",
      {
        scaleX: 1.06,
        scaleY: 0.94,
        duration: 0.18,
        ease: "power2.out",
      },
      0
    );

    /*
     * ==========================================================
     * 2. TIGHT KNOT
     * ==========================================================
     */

    tl.call(
      () => {
        setActiveFrame(1);
      },
      [],
      "+=0.05"
    );

    tl.to(".knot-container", {
      scaleX: 0.98,
      scaleY: 1.02,
      duration: 0.12,
      ease: "power2.inOut",
    });

    /*
     * ==========================================================
     * 3. KNOT STARTS LOOSENING
     * ==========================================================
     */

    tl.call(() => {
      setActiveFrame(2);
    });

    tl.to(".knot-container", {
      x: -3,
      rotation: -2,
      duration: 0.16,
      ease: "power2.inOut",
    });

    /*
     * ==========================================================
     * 4. LEFT LOOP PULLS THROUGH
     * ==========================================================
     */

    tl.to(
      ".tail-left",
      {
        x: 10,
        y: -7,
        rotation: 4,
        duration: 0.22,
        ease: "power2.inOut",
      },
      "-=0.04"
    );

    tl.call(() => {
      setActiveFrame(3);
    });

    /*
     * Small recoil of the left tail.
     */

    tl.to(".tail-left", {
      x: -4,
      y: 6,
      rotation: -4,
      duration: 0.18,
      ease: "power2.out",
    });

    /*
     * ==========================================================
     * 5. KNOT OPENS
     * ==========================================================
     */

    tl.call(() => {
      setActiveFrame(4);
    });

    tl.to(".knot-container", {
      x: 2,
      rotation: 4,
      scaleX: 0.94,
      duration: 0.18,
      ease: "power2.inOut",
    });

    /*
     * ==========================================================
     * 6. OPEN KNOT
     * ==========================================================
     */

    tl.call(() => {
      setActiveFrame(5);
    });

    /*
     * Both tails begin to fall.
     */

    tl.to(
      ".tail-left",
      {
        x: -17,
        y: 28,
        rotation: -9,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.04"
    );

    tl.to(
      ".tail-right",
      {
        x: 15,
        y: 25,
        rotation: 8,
        duration: 0.35,
        ease: "power2.out",
      },
      "<"
    );

    /*
     * ==========================================================
     * 7. FULLY RELEASED
     * ==========================================================
     */

    tl.call(() => {
      setActiveFrame(6);
    });

    tl.to(".knot-container", {
      y: 12,
      rotation: 8,
      scale: 0.9,
      duration: 0.2,
      ease: "power2.in",
    });

    /*
     * ==========================================================
     * 8. KNOT FALLS
     * ==========================================================
     */

    tl.call(() => {
      setActiveFrame(7);
    });

    tl.to(".knot-container", {
      y: 55,
      rotation: 16,
      scale: 0.7,
      opacity: 0,
      duration: 0.42,
      ease: "power2.in",
    });

    /*
     * ==========================================================
     * 9. TAILS FALL
     * ==========================================================
     */

    tl.to(
      ".tail-left",
      {
        x: -42,
        y: 85,
        rotation: -16,
        opacity: 0,
        duration: 0.65,
        ease: "power2.in",
      },
      "-=0.25"
    );

    tl.to(
      ".tail-right",
      {
        x: 42,
        y: 82,
        rotation: 16,
        opacity: 0,
        duration: 0.65,
        ease: "power2.in",
      },
      "<"
    );

    /*
     * ==========================================================
     * 10. NOW THE RIBBON IS ACTUALLY FREE
     * ==========================================================
     */

    tl.to(
      ".ribbon-left",
      {
        xPercent: -110,
        duration: 0.75,
        ease: "power3.in",
      },
      "-=0.25"
    );

    tl.to(
      ".ribbon-right",
      {
        xPercent: 110,
        duration: 0.75,
        ease: "power3.in",
      },
      "<"
    );
  };

  return (
    <div
      ref={rootRef}
      className="wedding-ribbon-system"
    >
      {/* LEFT SIDE OF SINGLE RIBBON */}

      <img
        src="/ribbon/ribbon-left.png"
        alt=""
        className="ribbon-piece ribbon-left"
        draggable={false}
      />

      {/* RIGHT SIDE OF SINGLE RIBBON */}

      <img
        src="/ribbon/ribbon-right.png"
        alt=""
        className="ribbon-piece ribbon-right"
        draggable={false}
      />

      {/* LEFT HANGING LOOP */}

      <img
        src="/ribbon/tail-left.png"
        alt=""
        className="ribbon-piece tail-left"
        draggable={false}
      />

      {/* RIGHT HANGING LOOP */}

      <img
        src="/ribbon/tail-right.png"
        alt=""
        className="ribbon-piece tail-right"
        draggable={false}
      />

      {/* REAL KNOT STATES */}

      <div className="knot-container">
        {KNOT_FRAMES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            draggable={false}
            className={`knot-frame ${
              activeFrame === index ? "is-active" : ""
            }`}
          />
        ))}
      </div>

      {/* CLICK AREA */}

      <button
        type="button"
        aria-label="Untie ribbon"
        className="ribbon-knot-hit"
        onClick={releaseRibbon}
      />
    </div>
  );
}