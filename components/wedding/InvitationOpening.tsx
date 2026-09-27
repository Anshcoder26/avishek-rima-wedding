"use client";

import { useRef } from "react";
import gsap from "gsap";

type InvitationOpeningProps = {
  onOpened?: () => void;
};

export default function InvitationOpening({
  onOpened,
}: InvitationOpeningProps) {
  const openedRef = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const leftCoverRef = useRef<HTMLDivElement>(null);
  const rightCoverRef = useRef<HTMLDivElement>(null);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const petalContainerRef = useRef<HTMLDivElement>(null);

  /*
   * =========================================================
   * AUDIO
   * =========================================================
   */

  const playWeddingSong = () => {
    try {
      if (!audioRef.current) {
        const audio = new Audio("/audio/wedding-song.mp3");

        audio.preload = "auto";
        audio.loop = true;
        audio.volume = 0.72;

        audioRef.current = audio;

        audio.addEventListener("error", () => {
          // Never allow audio problems to affect the invitation.
        });
      }

      audioRef.current.play().catch(() => {
        // Ignore unsupported / unavailable audio.
      });
    } catch {
      // Ignore audio errors.
    }
  };


  /*
   * =========================================================
   * ROSE PETALS
   * =========================================================
   */

  const createRosePetals = () => {
    const container = petalContainerRef.current;

    if (!container) return;

    container.innerHTML = "";

    const PETAL_COUNT = 140;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement("span");

      petal.className = "rose-petal";

      /*
       * FULL SCREEN DISTRIBUTION
       */
      const startX = gsap.utils.random(0, 100);
      const startY = gsap.utils.random(-20, 5);

      const drift = gsap.utils.random(-25, 25);

      const endX = startX + drift;
      const endY = gsap.utils.random(105, 125);

      const size = gsap.utils.random(7, 16);

      const rotation = gsap.utils.random(0, 360);

      const rotationAmount = gsap.utils.random(
        540,
        1200
      );

      const duration = gsap.utils.random(
        7,
        10
      );

      const delay = gsap.utils.random(
        0,
        2.5
      );

      gsap.set(petal, {
        left: `${startX}%`,
        top: `${startY}%`,

        width: size,
        height: size * gsap.utils.random(1.15, 1.55),

        opacity: gsap.utils.random(0.55, 0.95),

        rotation,

        scale: gsap.utils.random(0.75, 1.15),
      });

      container.appendChild(petal);

      gsap.to(petal, {
        left: `${endX}%`,
        top: `${endY}%`,

        rotation: rotation + rotationAmount,

        duration,

        delay,

        ease: "none",
      });

      gsap.to(petal, {
        opacity: 0,

        duration: 1.3,

        delay: delay + duration - 1.3,

        ease: "power1.out",
      });
    }
  };


  /*
   * =========================================================
   * OPEN THREE-FOLD INVITATION
   * =========================================================
   */

  const openInvitation = () => {
    if (openedRef.current) return;

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

    /*
     * =====================================================
     * CLICK
     * =====================================================
     */

    playWeddingSong();

    createRosePetals();


    /*
     * =====================================================
     * INITIAL CLOSED BOOK
     * =====================================================
     */

    gsap.set(leftCover, {
      rotationY: 0,
    });

    gsap.set(rightCover, {
      rotationY: 0,
    });

    /*
     * Inside panels begin folded behind the cover.
     */

    gsap.set(leftPanel, {
      rotationY: 92,
    });

    gsap.set(centerPanel, {
      rotationY: 0,
    });

    gsap.set(rightPanel, {
      rotationY: -92,
    });


    /*
     * =====================================================
     * BOOK OPENING TIMELINE
     *
     * 0–4 sec:
     * Completely closed.
     *
     * 4 sec:
     * Left side starts opening.
     *
     * LEFT COVER + LEFT INSIDE PANEL
     * move simultaneously.
     *
     * 4.0 → 7.0
     *
     * Then right side starts.
     *
     * 6.7 → 9.7
     * =====================================================
     */

    const tl = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        onOpened?.();
      },
    });


    /*
     * =====================================================
     * PHASE 1
     *
     * CLOSED FOR 4 SECONDS
     * =====================================================
     */

    tl.to(
      {},
      {
        duration: 4,
      }
    );


    /*
     * =====================================================
     * PHASE 2
     *
     * LEFT SIDE OPENS
     *
     * The cover and left inside panel move together.
     * =====================================================
     */

    tl.to(
      leftCover,
      {
        rotationY: -175,

        duration: 2.9,

        ease: "power3.inOut",
      },
      4
    );

    tl.to(
      leftPanel,
      {
        rotationY: 0,

        duration: 2.9,

        ease: "power3.inOut",
      },
      4
    );


    /*
     * =====================================================
     * CENTER PANEL
     *
     * It is already physically underneath.
     *
     * It doesn't suddenly appear.
     *
     * As the left side opens, the center artwork naturally
     * becomes visible.
     * =====================================================
     */

    tl.set(
      centerPanel,
      {
        rotationY: 0,
      },
      4
    );


    /*
     * =====================================================
     * PHASE 3
     *
     * RIGHT SIDE OPENS
     *
     * Starts slightly before left side has completely
     * finished so there is NO DEAD GAP.
     * =====================================================
     */

    tl.to(
      rightCover,
      {
        rotationY: 175,

        duration: 2.9,

        ease: "power3.inOut",
      },
      6.65
    );

    tl.to(
      rightPanel,
      {
        rotationY: 0,

        duration: 2.9,

        ease: "power3.inOut",
      },
      6.65
    );


    /*
     * =====================================================
     * FINAL BOOK SETTLE
     * =====================================================
     */

    tl.to(
      [
        leftPanel,
        centerPanel,
        rightPanel,
      ],
      {
        y: -2,

        duration: 0.16,

        ease: "power2.out",
      },
      9.4
    );

    tl.to(
      [
        leftPanel,
        centerPanel,
        rightPanel,
      ],
      {
        y: 0,

        duration: 0.32,

        ease: "power2.out",
      },
      9.56
    );
  };


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {/* ===================================================
          FULL SCREEN PETALS
      ==================================================== */}

      <div
        ref={petalContainerRef}
        className="petal-shower"
        aria-hidden="true"
      />


      {/* ===================================================
          INVITATION
      ==================================================== */}

      <div
        className="invitation-stage"
        role="button"
        tabIndex={0}
        aria-label="Open wedding invitation"
        onClick={openInvitation}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            openInvitation();
          }
        }}
      >

        {/* =================================================
            LEFT INSIDE PANEL
        ================================================== */}

        <div
          ref={leftPanelRef}
          className="
            inside-panel
            inside-panel-left
          "
        >
          <div className="panel-surface">
            <img
              src="/invitation/artwork-01.png"
              alt=""
              draggable={false}
            />
          </div>
        </div>


        {/* =================================================
            CENTER INSIDE PANEL
        ================================================== */}

        <div
          ref={centerPanelRef}
          className="
            inside-panel
            inside-panel-center
          "
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


        {/* =================================================
            RIGHT INSIDE PANEL
        ================================================== */}

        <div
          ref={rightPanelRef}
          className="
            inside-panel
            inside-panel-right
          "
        >
          <div className="panel-surface">
            <img
              src="/invitation/artwork-02.png"
              alt=""
              draggable={false}
            />
          </div>
        </div>


        {/* =================================================
            CLOSED FRONT COVER
        ================================================== */}

        <div className="closed-cover">

          {/* LEFT HALF OF FRONT COVER */}

          <div
            ref={leftCoverRef}
            className="
              cover-half
              cover-half-left
            "
          >
            <img
              src="/invitation/cover.png"
              alt=""
              draggable={false}
            />
          </div>


          {/* RIGHT HALF OF FRONT COVER */}

          <div
            ref={rightCoverRef}
            className="
              cover-half
              cover-half-right
            "
          >
            <img
              src="/invitation/cover.png"
              alt="Rima and Avishek wedding invitation"
              draggable={false}
            />
          </div>

        </div>

      </div>
    </>
  );
}