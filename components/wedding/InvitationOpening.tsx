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

  const petalContainerRef =
    useRef<HTMLDivElement | null>(null);

  const leftCoverRef =
    useRef<HTMLDivElement>(null);

  const rightCoverRef =
    useRef<HTMLDivElement>(null);

  const leftPanelRef =
    useRef<HTMLDivElement>(null);

  const centerPanelRef =
    useRef<HTMLDivElement>(null);

  const rightPanelRef =
    useRef<HTMLDivElement>(null);


  /*
   * =========================================================
   * WEDDING SONG
   * =========================================================
   */

  const playWeddingSong = () => {
    try {
      if (!audioRef.current) {
        const audio = new Audio(
          "/audio/wedding-song.mp3"
        );

        audio.preload = "auto";

        audio.loop = true;

        audio.volume = 0.72;

        audioRef.current = audio;

        /*
         * Audio errors should NEVER stop the invitation
         * animation.
         */
        audio.addEventListener("error", () => {
          // Intentionally ignored.
        });
      }

      const audio = audioRef.current;

      if (!audio) return;

      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /*
           * Ignore audio errors.
           *
           * The invitation must continue opening even if
           * the browser cannot decode the audio file.
           */
        });
      }
    } catch {
      /*
       * Ignore audio errors completely.
       */
    }
  };


  /*
   * =========================================================
   * ROSE PETAL SHOWER
   * =========================================================
   *
   * IMPORTANT:
   *
   * This container is INSIDE the landscape canvas.
   *
   * On portrait phones:
   *
   * .landscape-canvas
   *       ↓
   *   rotates 90°
   *
   * and therefore:
   *
   * .petal-shower
   *       ↓
   *   rotates 90°
   *
   * with the invitation.
   *
   * This keeps the shower LANDSCAPE relative to the
   * invitation rather than portrait relative to the phone.
   * =========================================================
   */

  const createRosePetals = () => {
    const container =
      petalContainerRef.current;

    if (!container) return;

    /*
     * Remove any previous petals.
     */
    container.innerHTML = "";

    /*
     * Number of petals.
     */
    const PETAL_COUNT = 140;

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal =
        document.createElement("span");

      petal.className = "rose-petal";


      /*
       * =====================================================
       * START POSITION
       * =====================================================
       *
       * Spread across the ENTIRE landscape width.
       *
       * -10 → 110 means petals can begin slightly outside
       * both edges.
       */

      const startX =
        gsap.utils.random(-10, 110);

      /*
       * Start slightly above the top.
       */

      const startY =
        gsap.utils.random(-20, 5);


      /*
       * =====================================================
       * WIND / HORIZONTAL MOVEMENT
       * =====================================================
       */

      const horizontalDrift =
        gsap.utils.random(-25, 25);

      const endX =
        startX + horizontalDrift;


      /*
       * Fall beyond the bottom.
       */

      const endY =
        gsap.utils.random(105, 125);


      /*
       * =====================================================
       * RANDOM PETAL APPEARANCE
       * =====================================================
       */

      const size =
        gsap.utils.random(7, 16);

      const heightMultiplier =
        gsap.utils.random(
          1.15,
          1.55
        );

      const startRotation =
        gsap.utils.random(
          0,
          360
        );

      const rotationAmount =
        gsap.utils.random(
          540,
          1200
        );

      const scale =
        gsap.utils.random(
          0.75,
          1.15
        );

      const opacity =
        gsap.utils.random(
          0.55,
          0.95
        );


      /*
       * =====================================================
       * LONG FALL
       * =====================================================
       *
       * Every petal falls for at least ~7 seconds.
       */

      const duration =
        gsap.utils.random(
          7,
          10
        );


      /*
       * Stagger the shower.
       */

      const delay =
        gsap.utils.random(
          0,
          2.5
        );


      /*
       * =====================================================
       * INITIAL STATE
       * =====================================================
       */

      gsap.set(petal, {
        left: `${startX}%`,
        top: `${startY}%`,

        width: size,

        height:
          size * heightMultiplier,

        opacity,

        rotation:
          startRotation,

        scale,
      });


      /*
       * Add to landscape petal container.
       */

      container.appendChild(petal);


      /*
       * =====================================================
       * FALL ANIMATION
       * =====================================================
       */

      gsap.to(petal, {
        left: `${endX}%`,

        top: `${endY}%`,

        rotation:
          startRotation +
          rotationAmount,

        duration,

        delay,

        ease: "none",
      });


      /*
       * =====================================================
       * FADE OUT NEAR THE END
       * =====================================================
       */

      gsap.to(petal, {
        opacity: 0,

        duration: 1.4,

        delay:
          delay +
          duration -
          1.4,

        ease: "power1.out",
      });
    }
  };


  /*
   * =========================================================
   * OPEN INVITATION
   * =========================================================
   */

  const openInvitation = () => {
    /*
     * Prevent double-clicking from starting multiple
     * timelines.
     */

    if (openedRef.current) return;

    openedRef.current = true;


    /*
     * =====================================================
     * GET ELEMENTS
     * =====================================================
     */

    const leftCover =
      leftCoverRef.current;

    const rightCover =
      rightCoverRef.current;

    const leftPanel =
      leftPanelRef.current;

    const centerPanel =
      centerPanelRef.current;

    const rightPanel =
      rightPanelRef.current;


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
     * CLICK ACTIONS
     * =====================================================
     *
     * Song starts immediately.
     *
     * Petal shower starts immediately.
     *
     * Invitation remains closed for 4 seconds.
     * =====================================================
     */

    playWeddingSong();

    createRosePetals();


    /*
     * =====================================================
     * INITIAL CLOSED STATE
     * =====================================================
     */

    gsap.set(leftCover, {
      rotationY: 0,
    });

    gsap.set(rightCover, {
      rotationY: 0,
    });


    /*
     * Inside panels are physically underneath the cover.
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
     * MASTER TIMELINE
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
     * 0 → 4 SECONDS
     *
     * CLOSED COVER
     *
     * Petals are falling.
     * Music is playing.
     * Book is waiting.
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
     * 4 → 7 SECONDS
     *
     * LEFT SIDE
     *
     * Front cover opens outward.
     *
     * Left inside artwork unfolds simultaneously.
     *
     * This is intended to feel like a real book/fold.
     * =====================================================
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
     * =====================================================
     * RIGHT SIDE
     *
     * Starts slightly before the left side completely
     * finishes so the whole motion feels continuous.
     *
     * 6.7 → 9.7
     * =====================================================
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
     * =====================================================
     * CENTER
     *
     * The center artwork is already underneath and remains
     * stationary.
     *
     * It becomes visible naturally as the two sides open.
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
     * FINAL SETTLE
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
      9.45
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
      9.61
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
          LANDSCAPE PETAL SHOWER

          IMPORTANT:

          This is intentionally rendered INSIDE the
          InvitationOpening component.

          Since InvitationOpening is inside:

              .landscape-canvas

          the petals rotate together with the invitation
          on portrait mobile.
      ==================================================== */}

      <div
        ref={petalContainerRef}
        className="petal-shower"
        aria-hidden="true"
      />


      {/* ===================================================
          INVITATION STAGE
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

          {/* =================================================
              LEFT HALF OF COVER
          ================================================= */}

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


          {/* =================================================
              RIGHT HALF OF COVER
          ================================================= */}

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