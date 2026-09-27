"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

type InvitationOpeningProps = {
  onOpened?: () => void;
};

export default function InvitationOpening({
  onOpened,
}: InvitationOpeningProps) {
  const openedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const petalContainerRef = useRef<HTMLDivElement | null>(null);

  const leftCoverRef = useRef<HTMLDivElement>(null);
  const rightCoverRef = useRef<HTMLDivElement>(null);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const [showTapHint, setShowTapHint] = useState(true);

  const playWeddingSong = () => {
    try {
      if (!audioRef.current) {
        const audio = new Audio("/audio/wedding-song.mp3");

        audio.preload = "auto";
        audio.loop = true;
        audio.volume = 0.72;

        audioRef.current = audio;

        audio.addEventListener("error", () => {});
      }

      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch {}
  };

  const createRosePetals = () => {
    const container = petalContainerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const PETAL_COUNT = 140;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement("span");
      petal.className = "rose-petal";

      const startX = gsap.utils.random(-10, 110);
      const startY = gsap.utils.random(-20, 5);

      const horizontalDrift = gsap.utils.random(-25, 25);

      const endX = startX + horizontalDrift;
      const endY = gsap.utils.random(105, 125);

      const size = gsap.utils.random(7, 16);
      const heightMultiplier = gsap.utils.random(1.15, 1.55);

      const startRotation = gsap.utils.random(0, 360);
      const rotationAmount = gsap.utils.random(540, 1200);

      const scale = gsap.utils.random(0.75, 1.15);
      const opacity = gsap.utils.random(0.55, 0.95);

      const duration = gsap.utils.random(7, 10);
      const delay = gsap.utils.random(0, 2.5);

      gsap.set(petal, {
        left: `${startX}%`,
        top: `${startY}%`,
        width: size,
        height: size * heightMultiplier,
        opacity,
        rotation: startRotation,
        scale,
      });

      container.appendChild(petal);

      gsap.to(petal, {
        left: `${endX}%`,
        top: `${endY}%`,
        rotation: startRotation + rotationAmount,
        duration,
        delay,
        ease: "none",
      });

      gsap.to(petal, {
        opacity: 0,
        duration: 1.4,
        delay: delay + duration - 1.4,
        ease: "power1.out",
      });
    }
  };

  const openInvitation = () => {
    if (openedRef.current) return;

    /*
     * Hide the "Tap to open" hint immediately.
     * CSS handles the smooth fade-out.
     */
    setShowTapHint(false);

    openedRef.current = true;

    const leftCover = leftCoverRef.current;
    const rightCover = rightCoverRef.current;
    const leftPanel = leftPanelRef.current;
    const centerPanel = centerPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (
      !leftCover ||
      !rightCover ||
      !leftPanel ||
      !centerPanel ||
      !rightPanel
    ) {
      return;
    }

    playWeddingSong();
    createRosePetals();

    gsap.set(leftCover, {
      rotationY: 0,
    });

    gsap.set(rightCover, {
      rotationY: 0,
    });

    gsap.set(leftPanel, {
      rotationY: 92,
    });

    gsap.set(centerPanel, {
      rotationY: 0,
    });

    gsap.set(rightPanel, {
      rotationY: -92,
    });

    const tl = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        onOpened?.();
      },
    });

    /*
     * 4-second pause after the user taps.
     */
    tl.to({}, {
      duration: 4,
    });

    /*
     * Open the left cover and reveal the left inside panel.
     */
    tl.to(
      leftCover,
      {
        rotationY: -175,
        duration: 3,
        ease: "power3.inOut",
      },
      4
    );

    tl.to(
      leftPanel,
      {
        rotationY: 0,
        duration: 3,
        ease: "power3.inOut",
      },
      4
    );

    /*
     * Open the right cover and reveal the right inside panel.
     */
    tl.to(
      rightCover,
      {
        rotationY: 175,
        duration: 3,
        ease: "power3.inOut",
      },
      6.7
    );

    tl.to(
      rightPanel,
      {
        rotationY: 0,
        duration: 3,
        ease: "power3.inOut",
      },
      6.7
    );

    /*
     * Center artwork remains flat throughout.
     */
    tl.set(
      centerPanel,
      {
        rotationY: 0,
      },
      4
    );

    /*
     * Very subtle settling movement after the book is fully open.
     */
    tl.to(
      [leftPanel, centerPanel, rightPanel],
      {
        y: -2,
        duration: 0.16,
        ease: "power2.out",
      },
      9.45
    );

    tl.to(
      [leftPanel, centerPanel, rightPanel],
      {
        y: 0,
        duration: 0.32,
        ease: "power2.out",
      },
      9.61
    );
  };

  return (
    <>
      <div
        ref={petalContainerRef}
        className="petal-shower"
        aria-hidden="true"
      />

      <div
        className="invitation-stage"
        role="button"
        tabIndex={0}
        aria-label="Open wedding invitation"
        onClick={openInvitation}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openInvitation();
          }
        }}
      >
        <div
          ref={leftPanelRef}
          className="inside-panel inside-panel-left"
        >
          <div className="panel-surface">
            <img
              src="/invitation/artwork-01.png"
              alt=""
              draggable={false}
            />
          </div>
        </div>

        <div
          ref={centerPanelRef}
          className="inside-panel inside-panel-center"
        >
          <div className="panel-surface">
            <img
              src="/invitation/inside.png"
              alt=""
              className="inside-background"
              draggable={false}
            />
          </div>
        </div>

        <div
          ref={rightPanelRef}
          className="inside-panel inside-panel-right"
        >
          <div className="panel-surface">
            <img
              src="/invitation/artwork-02.png"
              alt=""
              draggable={false}
            />
          </div>
        </div>

        <div className="closed-cover">
          <div
            ref={leftCoverRef}
            className="cover-half cover-half-left"
          >
            <img
              src="/invitation/cover.png"
              alt=""
              draggable={false}
            />
          </div>

          <div
            ref={rightCoverRef}
            className="cover-half cover-half-right"
          >
            <img
              src="/invitation/cover.png"
              alt="Rima and Avishek wedding invitation"
              draggable={false}
            />
          </div>
        </div>

        <button
          type="button"
          className={`tap-to-open ${
            showTapHint ? "" : "is-hidden"
          }`}
          aria-label="Tap to open invitation"
          onClick={(event) => {
            event.stopPropagation();
            openInvitation();
          }}
        >
          <span className="tap-to-open-line" />

          <span className="tap-to-open-text">
            Tap to open
          </span>

          <span className="tap-to-open-line" />
        </button>
      </div>
    </>
  );
}