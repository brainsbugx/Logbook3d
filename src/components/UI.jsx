import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pageAtom = atom(0);

export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});


/* ============================================================
   NIGHT SKY / PLEIADES / MILKY WAY
============================================================ */

const PlexusBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let animationFrame;
    let width = 0;
    let height = 0;

    let stars = [];
    let nebulaParticles = [];

    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const random = (min, max) =>
      Math.random() * (max - min) + min;

    const isMobile = () =>
      window.innerWidth < 768;


    /* ========================================================
       STAR FIELD
    ======================================================== */

    const createStars = () => {
      const mobile = isMobile();

      const count = mobile ? 150 : 330;

      stars = [];

      for (let i = 0; i < count; i++) {
        const depth = random(0.1, 1);

        stars.push({
          x: random(0, width),
          y: random(0, height),

          baseX: 0,
          baseY: 0,

          depth,

          vx: random(-0.014, 0.014) * depth,
          vy: random(-0.009, 0.009) * depth,

          radius:
            depth > 0.85
              ? random(0.55, 1.45)
              : random(0.2, 0.8),

          brightness:
            depth > 0.8
              ? random(0.35, 0.85)
              : random(0.08, 0.5),

          phase: random(0, Math.PI * 2),

          twinkleSpeed: random(
            0.0005,
            0.002
          ),

          major: false,
          pleiades: false,
        });

        stars[i].baseX = stars[i].x;
        stars[i].baseY = stars[i].y;
      }


      /* ======================================================
         PLEIADES
      ====================================================== */

      const cx = width * 0.52;
      const cy = height * 0.42;

      const pleiades = [
        { x: -0.075, y: -0.01, size: 2.7 },
        { x: -0.025, y: -0.055, size: 2.25 },
        { x: 0.025, y: -0.095, size: 2.05 },
        { x: 0.075, y: -0.035, size: 1.8 },
        { x: -0.005, y: 0.025, size: 1.75 },
        { x: 0.045, y: 0.065, size: 1.45 },
        { x: -0.06, y: 0.085, size: 1.35 },
      ];

      pleiades.forEach((star) => {
        stars.push({
          x: cx + star.x * width,
          y: cy + star.y * height,

          baseX: cx + star.x * width,
          baseY: cy + star.y * height,

          depth: 1,

          vx: 0,
          vy: 0,

          radius: star.size,

          brightness: random(0.82, 1),

          phase: random(0, Math.PI * 2),

          twinkleSpeed: random(
            0.0005,
            0.0012
          ),

          major: true,
          pleiades: true,
        });
      });
    };


    /* ========================================================
       MILKY WAY / NEBULA
    ======================================================== */

    const createNebula = () => {
      const mobile = isMobile();

      const count = mobile ? 500 : 1300;

      nebulaParticles = [];

      for (let i = 0; i < count; i++) {
        const progress = Math.random();

        const centerX =
          width *
          (-0.12 + progress * 1.22);

        const centerY =
          height *
          (0.95 - progress * 0.72);

        const spread =
          (Math.random() +
            Math.random() +
            Math.random() -
            1.5) *
          height *
          0.17;

        const x =
          centerX +
          spread * 0.32;

        const y =
          centerY +
          spread;

        nebulaParticles.push({
          x,
          y,

          radius: random(
            0.2,
            1.45
          ),

          alpha: random(
            0.025,
            0.13
          ),

          phase: random(
            0,
            Math.PI * 2
          ),

          speed: random(
            0.00015,
            0.0008
          ),
        });
      }
    };


    /* ========================================================
       RESIZE
    ======================================================== */

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createStars();
      createNebula();
    };


    /* ========================================================
       POINTER
    ======================================================== */

    const handleMouseMove = (event) => {
      mouse.targetX = event.clientX;
      mouse.targetY = event.clientY;
    };

    const handleTouchMove = (event) => {
      if (!event.touches?.[0]) {
        return;
      }

      mouse.targetX =
        event.touches[0].clientX;

      mouse.targetY =
        event.touches[0].clientY;
    };


    /* ========================================================
       DRAW
    ======================================================== */

    const draw = (time) => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      mouse.x +=
        (mouse.targetX - mouse.x) *
        0.02;

      mouse.y +=
        (mouse.targetY - mouse.y) *
        0.02;

      const mouseX =
        (mouse.x / width - 0.5) * 2;

      const mouseY =
        (mouse.y / height - 0.5) * 2;


      /* ======================================================
         BASE GALACTIC ATMOSPHERE
      ====================================================== */

      const galaxy =
        ctx.createRadialGradient(
          width * 0.52,
          height * 0.5,
          0,
          width * 0.52,
          height * 0.5,
          width * 0.8
        );

      galaxy.addColorStop(
        0,
        "rgba(80, 105, 111, 0.055)"
      );

      galaxy.addColorStop(
        0.35,
        "rgba(42, 66, 74, 0.035)"
      );

      galaxy.addColorStop(
        0.7,
        "rgba(12, 28, 35, 0.018)"
      );

      galaxy.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = galaxy;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      /* ======================================================
         MILKY WAY
      ====================================================== */

      const cloud1 =
        ctx.createLinearGradient(
          width * 0.0,
          height * 0.95,
          width * 1.0,
          height * 0.2
        );

      cloud1.addColorStop(
        0,
        "rgba(125, 150, 154, 0)"
      );

      cloud1.addColorStop(
        0.25,
        "rgba(115, 140, 145, 0.055)"
      );

      cloud1.addColorStop(
        0.48,
        "rgba(170, 185, 187, 0.09)"
      );

      cloud1.addColorStop(
        0.62,
        "rgba(105, 130, 136, 0.045)"
      );

      cloud1.addColorStop(
        0.82,
        "rgba(50, 75, 82, 0.02)"
      );

      cloud1.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = cloud1;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      /* ======================================================
         DARK DUST LANE
      ====================================================== */

      const dust =
        ctx.createLinearGradient(
          width * 0.0,
          height * 0.98,
          width * 1.0,
          height * 0.22
        );

      dust.addColorStop(
        0,
        "rgba(0, 5, 8, 0)"
      );

      dust.addColorStop(
        0.35,
        "rgba(0, 5, 8, 0.16)"
      );

      dust.addColorStop(
        0.48,
        "rgba(0, 4, 7, 0.25)"
      );

      dust.addColorStop(
        0.58,
        "rgba(0, 5, 8, 0.12)"
      );

      dust.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = dust;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      /* ======================================================
         NEBULA PARTICLES
      ====================================================== */

      nebulaParticles.forEach(
        (particle) => {
          const drift =
            Math.sin(
              time *
                particle.speed +
                particle.phase
            );

          const px =
            particle.x +
            drift * 2 +
            mouseX * 3;

          const py =
            particle.y +
            Math.cos(
              time *
                particle.speed *
                0.8 +
                particle.phase
            ) *
              1.5 +
            mouseY * 3;

          ctx.beginPath();

          ctx.fillStyle = `
            rgba(
              190,
              205,
              206,
              ${particle.alpha}
            )
          `;

          ctx.arc(
            px,
            py,
            particle.radius,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }
      );


      /* ======================================================
         STARS
      ====================================================== */

      stars.forEach((star) => {
        if (star.pleiades) {
          const movementX =
            Math.sin(
              time *
                star.twinkleSpeed +
                star.phase
            ) * 2.2;

          const movementY =
            Math.cos(
              time *
                star.twinkleSpeed *
                0.8 +
                star.phase
            ) * 2.2;

          star.x =
            star.baseX +
            movementX +
            mouseX * 6;

          star.y =
            star.baseY +
            movementY +
            mouseY * 6;

          return;
        }

        star.x += star.vx;
        star.y += star.vy;

        star.x +=
          mouseX *
          star.depth *
          0.015;

        star.y +=
          mouseY *
          star.depth *
          0.015;

        if (star.x < -20) {
          star.x = width + 20;
        }

        if (star.x > width + 20) {
          star.x = -20;
        }

        if (star.y < -20) {
          star.y = height + 20;
        }

        if (star.y > height + 20) {
          star.y = -20;
        }
      });


      /* ======================================================
         PLEXUS
      ====================================================== */

      const plexusStars =
        stars.filter(
          (star) =>
            star.pleiades ||
            star.depth > 0.78
        );

      const distanceLimit =
        isMobile()
          ? 120
          : 180;

      for (
        let i = 0;
        i < plexusStars.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < plexusStars.length;
          j++
        ) {
          const a =
            plexusStars[i];

          const b =
            plexusStars[j];

          const dx =
            a.x - b.x;

          const dy =
            a.y - b.y;

          const distance =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          if (
            distance >
            distanceLimit
          ) {
            continue;
          }

          const proximity =
            1 -
            distance /
              distanceLimit;

          let strength = 0.045;

          if (
            a.pleiades &&
            b.pleiades
          ) {
            strength = 0.34;
          } else if (
            a.pleiades ||
            b.pleiades
          ) {
            strength = 0.09;
          }

          const opacity =
            proximity *
            strength;

          ctx.beginPath();

          ctx.moveTo(
            a.x,
            a.y
          );

          ctx.lineTo(
            b.x,
            b.y
          );

          ctx.strokeStyle = `
            rgba(
              165,
              205,
              211,
              ${opacity}
            )
          `;

          ctx.lineWidth =
            a.pleiades &&
            b.pleiades
              ? 0.8
              : 0.4;

          ctx.stroke();
        }
      }


      /* ======================================================
         STAR GLOW
      ====================================================== */

      stars.forEach((star) => {
        const pulse =
          0.75 +
          Math.sin(
            time *
              star.twinkleSpeed *
              10 +
              star.phase
          ) *
            0.25;

        const alpha =
          star.brightness *
          pulse;

        if (star.pleiades) {
          const glow =
            ctx.createRadialGradient(
              star.x,
              star.y,
              0,
              star.x,
              star.y,
              star.radius * 14
            );

          glow.addColorStop(
            0,
            `rgba(
              225,
              242,
              244,
              ${alpha * 0.55}
            )`
          );

          glow.addColorStop(
            0.2,
            `rgba(
              175,
              215,
              220,
              ${alpha * 0.2}
            )`
          );

          glow.addColorStop(
            1,
            "rgba(120,190,200,0)"
          );

          ctx.beginPath();

          ctx.fillStyle = glow;

          ctx.arc(
            star.x,
            star.y,
            star.radius * 14,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        ctx.beginPath();

        ctx.fillStyle = `
          rgba(
            225,
            241,
            243,
            ${alpha}
          )
        `;

        ctx.arc(
          star.x,
          star.y,
          star.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });


      /* ======================================================
         FINAL VIGNETTE
      ====================================================== */

      const vignette =
        ctx.createRadialGradient(
          width * 0.5,
          height * 0.46,
          Math.min(
            width,
            height
          ) * 0.18,

          width * 0.5,
          height * 0.46,
          Math.max(
            width,
            height
          ) * 0.76
        );

      vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
      );

      vignette.addColorStop(
        0.6,
        "rgba(0,0,0,0.08)"
      );

      vignette.addColorStop(
        1,
        "rgba(0,0,0,0.82)"
      );

      ctx.fillStyle = vignette;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );


      animationFrame =
        requestAnimationFrame(draw);
    };


    resize();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "touchmove",
      handleTouchMove,
      {
        passive: true,
      }
    );

    animationFrame =
      requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "touchmove",
        handleTouchMove
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        fixed
        inset-0
        h-full
        w-full
        pointer-events-none
      "
      style={{
        zIndex: 0,
        background: "#02070b",
      }}
    />
  );
};


/* ============================================================
   UI
============================================================ */

export const UI = () => {
  const [page, setPage] =
    useAtom(pageAtom);

  const totalPages =
    pages.length;

  const lastArticlePage =
    Math.max(
      0,
      totalPages - 1
    );


  /* ==========================================================
     PAGE FLIP SOUND
  ========================================================== */

  useEffect(() => {
    const audio =
      new Audio(
        "/audios/page-flip-01a.mp3"
      );

    audio.volume = 0.35;

    audio.play().catch(() => {});
  }, [page]);


  /* ==========================================================
     PAGE CONTROL
  ========================================================== */

  const goToPage = (newPage) => {
    const safePage =
      Math.max(
        0,
        Math.min(
          newPage,
          totalPages
        )
      );

    if (safePage !== page) {
      setPage(safePage);
    }
  };


  /* ==========================================================
     NUMBER INPUT
  ========================================================== */

  const handlePageInput =
    (event) => {
      const value =
        Number(
          event.target.value
        );

      if (!Number.isNaN(value)) {
        goToPage(value);
      }
    };


  /* ==========================================================
     SLIDER PROGRESS
  ========================================================== */

  const progress =
    totalPages > 0
      ? (page / totalPages) * 100
      : 0;


  return (
    <>
      {/* ======================================================
          GALAXY
      ====================================================== */}

      <PlexusBackground />


      {/* ======================================================
          STATIC INSTRUCTION
          STAYS ON THE GALAXY LAYER
      ====================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          left-1/2
          top-[12vh]
          z-[1]
          w-[calc(100%-40px)]
          -translate-x-1/2
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            w-fit
            max-w-full
            flex-col
            items-center
            gap-[3px]
            whitespace-nowrap
            font-sans
            leading-none
          "
          style={{
            fontFamily:
              "Helvetica Neue, Helvetica, Arial, sans-serif",
          }}
        >
          <span
            className="
              text-[8px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-white/[0.48]
              sm:text-[9px]
              sm:tracking-[0.18em]
              md:text-[10px]
            "
          >
            THE BOOK IS REAL
          </span>

          <span
            className="
              text-[7px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-white/[0.22]
              sm:text-[7px]
              md:text-[8px]
            "
          >
            CLICK · DRAG · SLIDE
          </span>
        </div>
      </div>


      {/* ======================================================
          MAIN UI
      ====================================================== */}

      <main
        className="
          pointer-events-none
          select-none
          fixed
          inset-0
          z-10
          flex
          flex-col
          justify-between
          p-4
          sm:p-6
          md:p-8
          lg:p-10
        "
      >

        {/* ====================================================
            HOME
        ==================================================== */}

        <div className="pointer-events-auto">
          <a
            href="/"
            aria-label="Return to homepage"
            className="
              group
              inline-flex
              transition-transform
              duration-300
              hover:scale-105
              active:scale-95
            "
          >
            <img
              src="/images/jollyroger.png"
              alt="Home"
              className="
                w-11
                opacity-75
                transition-all
                duration-300
                group-hover:opacity-100
                group-hover:drop-shadow-[0_0_18px_rgba(220,240,242,0.35)]
                sm:w-13
                md:w-15
              "
            />
          </a>
        </div>


        {/* ====================================================
            NAVIGATION

            IMPORTANT:
            On mobile/tablet the whole navigation is lifted
            using safe-area-inset-bottom + extra breathing room.
            This prevents Chrome/Safari UI from covering it.
        ==================================================== */}

        <div
          className="
            pointer-events-auto
            mx-auto
            flex
            w-full
            max-w-xl
            flex-col
            items-center
            pb-[calc(env(safe-area-inset-bottom)+24px)]
            sm:pb-[calc(env(safe-area-inset-bottom)+28px)]
            md:pb-[calc(env(safe-area-inset-bottom)+30px)]
            lg:pb-5
          "
        >

          {/* ==================================================
              PAGE NUMBER
          ================================================== */}

          <div
            className="
              mb-2
              flex
              items-baseline
              gap-1.5
              font-mono
              text-[11px]
              tracking-[0.12em]
              sm:mb-3
              sm:text-xs
            "
          >
            <input
              type="number"
              min="0"
              max={totalPages}
              value={page}
              onChange={handlePageInput}
              aria-label="Current page"
              className="
                w-5
                appearance-none
                bg-transparent
                p-0
                text-center
                text-white/85
                outline-none
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
              "
            />

            <span className="text-white/20">
              /
            </span>

            <span className="text-white/25">
              {totalPages}
            </span>
          </div>


          {/* ==================================================
              SLIDER
          ================================================== */}

          <div
            className="
              relative
              h-7
              w-[min(72vw,420px)]
              sm:w-[min(65vw,500px)]
              md:w-[min(60vw,500px)]
            "
          >

            <input
              type="range"
              min="0"
              max={totalPages}
              step="1"
              value={page}
              onChange={(event) =>
                goToPage(
                  Number(
                    event.target.value
                  )
                )
              }
              aria-label="Page selector"
              className="
                absolute
                inset-0
                z-30
                h-full
                w-full
                cursor-pointer
                appearance-none
                opacity-0
              "
            />


            {/* Base */}

            <div
              className="
                absolute
                left-0
                right-0
                top-1/2
                h-px
                -translate-y-1/2
                bg-white/[0.12]
              "
            />


            {/* Progress */}

            <div
              className="
                absolute
                left-0
                top-1/2
                h-px
                -translate-y-1/2
                bg-white/70
                shadow-[0_0_8px_rgba(220,240,242,0.55)]
              "
              style={{
                width: `${progress}%`,
              }}
            />


            {/* Start marker */}

            <div
              className="
                absolute
                left-0
                top-1/2
                h-[4px]
                w-[4px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/40
              "
            />


            {/* End marker */}

            <div
              className="
                absolute
                right-0
                top-1/2
                h-[4px]
                w-[4px]
                translate-x-1/2
                -translate-y-1/2
                rounded-full
                bg-white/25
              "
            />


            {/* Quarter markers */}

            {[25, 50, 75].map(
              (position) => (
                <div
                  key={position}
                  className="
                    absolute
                    top-1/2
                    h-[3px]
                    w-[3px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-white/15
                  "
                  style={{
                    left: `${position}%`,
                  }}
                />
              )
            )}


            {/* Glowing handle */}

            <div
              className="
                absolute
                top-1/2
                z-20
                h-[8px]
                w-[8px]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-white
                bg-[#02070b]
                shadow-[0_0_8px_rgba(225,242,244,0.95),0_0_22px_rgba(110,190,200,0.5)]
                transition-[left]
                duration-150
              "
              style={{
                left: `${progress}%`,
              }}
            />
          </div>


          {/* ==================================================
              QUICK NAVIGATION
          ================================================== */}

          <div
            className="
              mt-3
              flex
              items-center
              justify-center
              gap-5
              sm:gap-8
            "
          >

            <button
              type="button"
              onClick={() =>
                goToPage(0)
              }
              className="
                text-[8px]
                tracking-[0.24em]
                text-white/30
                transition-all
                duration-300
                hover:text-white
                hover:drop-shadow-[0_0_8px_rgba(220,240,242,0.35)]
                sm:text-[9px]
              "
            >
              COVER
            </button>


            <button
              type="button"
              onClick={() =>
                goToPage(
                  lastArticlePage
                )
              }
              className="
                text-[8px]
                tracking-[0.24em]
                text-white/30
                transition-all
                duration-300
                hover:text-white
                hover:drop-shadow-[0_0_8px_rgba(220,240,242,0.35)]
                sm:text-[9px]
              "
            >
              LAST ARTICLE
            </button>


            <button
              type="button"
              onClick={() =>
                goToPage(
                  totalPages
                )
              }
              className="
                text-[8px]
                tracking-[0.24em]
                text-white/30
                transition-all
                duration-300
                hover:text-white
                hover:drop-shadow-[0_0_8px_rgba(220,240,242,0.35)]
                sm:text-[9px]
              "
            >
              END
            </button>

          </div>
        </div>
      </main>
    </>
  );
};