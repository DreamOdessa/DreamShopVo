"use client";

import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { publicMediaUrl } from "../../lib/media-url";

import {
  ORANGE_SHOWCASE_POSITIONS,
  type OrangeShowcasePosition,
} from "./orange-showcase-config";

type ShowcaseProduct = {
  id: string;
  images: Array<{
    objectKey: string;
    sortOrder: number;
  }>;
};

export type OrangeShowcaseCategory = {
  description: string;
  href: string;
  id: string;
  name: string;
  products: ShowcaseProduct[];
  slug: string;
};

type OrangeCategoryShowcaseProps = {
  categories: OrangeShowcaseCategory[];
};

type Decoration = OrangeShowcasePosition & {
  id: string;
  src: string;
};

type CentralObject = {
  isOrange: boolean;
  src: string;
};

function localArtwork(category: OrangeShowcaseCategory) {
  const categoryIdentity = `${category.slug} ${category.name}`.toLocaleLowerCase("uk-UA");

  if (categoryIdentity.includes("чип") || categoryIdentity.includes("chips")) {
    return [
      "/showcase/orange/chips.webp",
      "/showcase/orange/chips-2.webp",
      "/showcase/orange/chips-3.webp",
    ];
  }

  if (categoryIdentity.includes("пудр") || categoryIdentity.includes("powder")) {
    return ["/showcase/orange/powder.webp", "/showcase/orange/powder-2.webp"];
  }

  return [];
}

function artworkForCategory(category: OrangeShowcaseCategory) {
  const dedicatedArtwork = localArtwork(category);

  if (dedicatedArtwork.length) {
    return dedicatedArtwork;
  }

  return category.products
    .map((product) => product.images.find(({ sortOrder }) => sortOrder === 0))
    .filter((image): image is { objectKey: string; sortOrder: number } => Boolean(image))
    .map((image) => publicMediaUrl(image.objectKey));
}

function categoryIdentity(category: OrangeShowcaseCategory) {
  return `${category.slug} ${category.name}`.toLocaleLowerCase("uk-UA");
}

function isOrangeCategory(category: OrangeShowcaseCategory) {
  const identity = categoryIdentity(category);

  return ["чип", "chips", "пудр", "powder", "солод", "цукер", "candy", "sweet", "сироп", "syrup"]
    .some((term) => identity.includes(term));
}

function fallbackCentralObject(category: OrangeShowcaseCategory) {
  const identity = categoryIdentity(category);

  if (identity.includes("сухоцв") || identity.includes("dried-flower")) {
    return "/showcase/fallback/dried-flowers.webp";
  }

  if (identity.includes("чай") || identity.includes("tea")) {
    return "/showcase/fallback/herbal-tea.webp";
  }

  return "/showcase/fallback/cocktail-garnish.webp";
}

function centralObjectForCategory(category: OrangeShowcaseCategory): CentralObject {
  if (isOrangeCategory(category)) {
    return { isOrange: true, src: "/showcase/orange/orange.webp" };
  }

  const productImage = category.products
    .map((product) => product.images.find(({ sortOrder }) => sortOrder === 0))
    .find((image): image is { objectKey: string; sortOrder: number } => Boolean(image));

  return {
    isOrange: false,
    src: productImage ? publicMediaUrl(productImage.objectKey) : fallbackCentralObject(category),
  };
}

function decorationsForCategory(category: OrangeShowcaseCategory): Decoration[] {
  const artwork = artworkForCategory(category);

  if (!artwork.length) {
    return [];
  }

  return ORANGE_SHOWCASE_POSITIONS.map((position, index) => ({
    ...position,
    id: `${category.id}-${index}`,
    src: artwork[index % artwork.length],
  }));
}

function entryPose(element: HTMLElement) {
  return {
    rotation: Number(element.dataset.rotation ?? 0),
    scale: Number(element.dataset.scale ?? 1),
    x: element.dataset.x ?? "0vw",
    y: element.dataset.y ?? "0vh",
  };
}

export function OrangeCategoryShowcase({ categories }: OrangeCategoryShowcaseProps) {
  const rootRef = useRef<HTMLElement>(null);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const goToStepRef = useRef<(nextIndex: number) => void>(() => undefined);
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionReady, setMotionReady] = useState(false);
  const decoratedCategories = useMemo(
    () => categories.map((category) => ({ ...category, decorations: decorationsForCategory(category) })),
    [categories],
  );
  const activeCategory = decoratedCategories[activeIndex] ?? decoratedCategories[0];
  const centralObjects = useMemo(
    () => decoratedCategories.map(centralObjectForCategory),
    [decoratedCategories],
  );
  const centralObject = centralObjects[activeIndex] ?? centralObjects[0];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || decoratedCategories.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      goToStepRef.current = (nextIndex) => {
        const boundedIndex = Math.min(
          Math.max(nextIndex, 0),
          decoratedCategories.length - 1,
        );
        activeIndexRef.current = boundedIndex;
        setActiveIndex(boundedIndex);
      };
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let pinTrigger: ScrollTrigger | undefined;
    let isPinned = false;
    let touchStartY: number | null = null;
    let wheelGestureLocked = false;
    let wheelUnlockTimer: number | undefined;
    const scheduleWheelUnlock = () => {
      window.clearTimeout(wheelUnlockTimer);
      wheelUnlockTimer = window.setTimeout(() => {
        wheelGestureLocked = false;
      }, 280);
    };
    const context = gsap.context(() => {
      const centralObjectElement = root.querySelector<HTMLElement>("[data-central-object]");
      const centralMedia = Array.from(
        root.querySelectorAll<HTMLElement>("[data-central-media]"),
      );
      const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-showcase-scene]"));
      if (!centralObjectElement || !centralMedia.length || !scenes.length) {
        return;
      }

      const sceneParts = scenes.map((scene) => ({
        decorations: Array.from(scene.querySelectorAll<HTMLElement>("[data-decoration]")),
        title: scene.querySelector<HTMLElement>("[data-scene-title]"),
      }));

      gsap.set(sceneParts.flatMap(({ decorations }) => decorations), {
        autoAlpha: 0,
        scale: 0.2,
        x: 0,
        y: 0,
      });
      gsap.set(
        sceneParts.slice(1).map(({ title }) => title).filter(Boolean),
        { autoAlpha: 0 },
      );
      gsap.set(centralObjectElement, { transformOrigin: "50% 62%" });
      gsap.set(centralMedia, { autoAlpha: 0 });
      gsap.set(centralMedia[0], { autoAlpha: 1 });
      sceneParts[0].decorations.forEach((decoration) => {
        gsap.set(decoration, { autoAlpha: 1, ...entryPose(decoration) });
      });
      setMotionReady(true);

      const syncScrollToStep = (index: number) => {
        if (!pinTrigger || sceneParts.length < 2) return;
        const progress = index / (sceneParts.length - 1);
        const target = pinTrigger.start + (pinTrigger.end - pinTrigger.start) * progress;
        pinTrigger.scroll(Math.min(target, pinTrigger.end - 1));
      };

      const goToStep = (nextIndex: number) => {
        const currentIndex = activeIndexRef.current;
        if (nextIndex === currentIndex) {
          return;
        }

        if (isTransitioningRef.current) return;

        if (nextIndex < 0) {
          wheelGestureLocked = false;
          isPinned = false;
          pinTrigger?.scroll(pinTrigger.start - 2);
          return;
        }

        if (nextIndex >= sceneParts.length) {
          wheelGestureLocked = false;
          isPinned = false;
          pinTrigger?.scroll(pinTrigger.end + 2);
          return;
        }

        isTransitioningRef.current = true;
        const previousScene = sceneParts[currentIndex];
        const nextScene = sceneParts[nextIndex];
        const currentMedia = centralMedia[currentIndex];
        const nextMedia = centralMedia[nextIndex];

        gsap.set(nextScene.title, { autoAlpha: 0 });
        nextScene.decorations.forEach((decoration) => {
          const pose = entryPose(decoration);
          gsap.set(decoration, {
            autoAlpha: 0,
            ...pose,
            scale: Number(pose.scale) * 0.84,
          });
        });
        gsap.set(nextMedia, { autoAlpha: 0 });

        const transition = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            gsap.set(centralObjectElement, { rotation: 0, scale: 1 });
            gsap.set(currentMedia, { autoAlpha: 0 });
            gsap.set(nextMedia, { autoAlpha: 1 });
            activeIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
            syncScrollToStep(nextIndex);
            isTransitioningRef.current = false;
            if (wheelGestureLocked) scheduleWheelUnlock();
          },
        });

        previousScene.decorations.forEach((decoration, index) => {
          transition.to(
            decoration,
            {
              autoAlpha: 0,
              duration: 0.2,
              ease: "power2.in",
              scale: Number(decoration.dataset.scale ?? 1) * 0.84,
            },
            index * 0.01,
          );
        });
        if (previousScene.title) {
          transition.to(previousScene.title, { autoAlpha: 0, duration: 0.18 }, 0);
        }
        transition.to(
          centralObjectElement,
          {
            duration: 0.72,
            ease: "power3.inOut",
            rotation: "+=360",
            scale: 1.035,
          },
          0,
        );
        transition.to(currentMedia, { autoAlpha: 0, duration: 0.16 }, 0.3);
        transition.to(nextMedia, { autoAlpha: 1, duration: 0.16 }, 0.38);
        if (nextScene.title) {
          transition.to(nextScene.title, { autoAlpha: 1, duration: 0.22 }, 0.3);
        }
        nextScene.decorations.forEach((decoration, index) => {
          transition.to(
            decoration,
            {
              autoAlpha: 1,
              duration: 0.42,
              ease: "power2.out",
              ...entryPose(decoration),
            },
            0.24 + index * 0.018,
          );
        });
        transition.to(
          centralObjectElement,
          { duration: 0.08, ease: "power1.out", scale: 1 },
          0.72,
        );
      };
      goToStepRef.current = goToStep;

      const onWheel = (event: WheelEvent) => {
        if (!(isPinned || pinTrigger?.isActive) || Math.abs(event.deltaY) < 12) {
          return;
        }

        event.preventDefault();
        if (wheelGestureLocked) {
          if (!isTransitioningRef.current) scheduleWheelUnlock();
          return;
        }
        wheelGestureLocked = true;
        goToStep(activeIndexRef.current + (event.deltaY > 0 ? 1 : -1));
      };
      const onTouchStart = (event: TouchEvent) => {
        touchStartY = event.touches[0]?.clientY ?? null;
      };
      const onTouchMove = (event: TouchEvent) => {
        if (isPinned || pinTrigger?.isActive) {
          event.preventDefault();
        }
      };
      const onTouchEnd = (event: TouchEvent) => {
        if (!(isPinned || pinTrigger?.isActive) || touchStartY === null) {
          return;
        }

        const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
        const distance = touchStartY - touchEndY;
        touchStartY = null;

        if (Math.abs(distance) >= 32) {
          goToStep(activeIndexRef.current + (distance > 0 ? 1 : -1));
        }
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (!(isPinned || pinTrigger?.isActive) || !["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
          return;
        }
        event.preventDefault();
        if (event.repeat) return;
        const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
        goToStep(activeIndexRef.current + direction);
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      root.addEventListener("keydown", onKeyDown);

      pinTrigger = ScrollTrigger.create({
        end: () => `+=${window.innerHeight * Math.max(sceneParts.length - 1, 1)}`,
        invalidateOnRefresh: true,
        onEnter: () => { isPinned = true; },
        onEnterBack: () => { isPinned = true; },
        onLeave: () => { isPinned = false; },
        onLeaveBack: () => { isPinned = false; },
        pin: true,
        start: "top top",
        trigger: root,
      });
      isPinned = pinTrigger.isActive;

      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        root.removeEventListener("keydown", onKeyDown);
        window.clearTimeout(wheelUnlockTimer);
      };
    }, root);

    return () => {
      pinTrigger?.kill();
      goToStepRef.current = () => undefined;
      context.revert();
    };
  }, [decoratedCategories]);

  if (!activeCategory) {
    return null;
  }

  return (
    <section
      className={`orange-category-showcase${motionReady ? " is-motion-ready" : ""}`}
      id="home-categories"
      ref={rootRef}
      tabIndex={0}
      aria-labelledby="orange-showcase-current-category"
    >
      <div className="orange-category-showcase-canvas">
        <p className="orange-category-showcase-kicker">Один фрукт — різні смаки</p>
        <p className="orange-category-showcase-step" aria-hidden="true">
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>/{String(decoratedCategories.length).padStart(2, "0")}</span>
        </p>
        {decoratedCategories.map((category, categoryIndex) => (
          <div
            className={`orange-category-showcase-scene${categoryIndex === activeIndex ? " is-active" : ""}`}
            data-showcase-scene
            key={category.id}
          >
            <h2
              aria-hidden={categoryIndex !== activeIndex}
              data-scene-title
              id={categoryIndex === activeIndex ? "orange-showcase-current-category" : undefined}
            >
              {category.name}
            </h2>
            {category.decorations.map((decoration) => (
              <div
                aria-hidden="true"
                className={`orange-category-showcase-decoration is-${decoration.depth}`}
                data-decoration
                data-exit-x={decoration.exitX}
                data-exit-y={decoration.exitY}
                data-mobile-hidden={decoration.mobileHidden ? "true" : undefined}
                data-rotation={decoration.rotation}
                data-scale={decoration.scale}
                data-x={decoration.x}
                data-y={decoration.y}
                key={decoration.id}
                style={
                  {
                    "--orange-decoration-rotation": `${decoration.rotation}deg`,
                    "--orange-decoration-scale": decoration.scale,
                    "--orange-decoration-x": decoration.x,
                    "--orange-decoration-y": decoration.y,
                  } as CSSProperties
                }
              >
                <Image alt="" fill sizes="(max-width: 760px) 28vw, 190px" src={decoration.src} />
              </div>
            ))}
          </div>
        ))}
        <Link
          aria-label={`Перейти до категорії ${activeCategory.name}`}
          className={`orange-category-showcase-central-object${centralObject.isOrange ? " is-orange" : " is-category-product"}`}
          data-central-object
          href={activeCategory.href}
        >
          {centralObjects.map((object, index) => (
            <span
              className={`orange-category-showcase-central-media${index === activeIndex ? " is-active" : ""}`}
              data-central-media
              key={`${decoratedCategories[index]?.id}-${object.src}`}
            >
              <Image
                alt=""
                fill
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 760px) 62vw, (max-width: 1180px) 36vw, 460px"
                src={object.src}
              />
            </span>
          ))}
        </Link>
        <div className="orange-category-showcase-controls" aria-label="Керування категоріями">
          <button
            aria-label="Попередня категорія"
            disabled={activeIndex === 0}
            onClick={() => goToStepRef.current(activeIndexRef.current - 1)}
            type="button"
          >
            <ArrowUp aria-hidden size={18} />
          </button>
          <button
            aria-label="Наступна категорія"
            disabled={activeIndex === decoratedCategories.length - 1}
            onClick={() => goToStepRef.current(activeIndexRef.current + 1)}
            type="button"
          >
            <ArrowDown aria-hidden size={18} />
          </button>
        </div>
        <Link className="orange-category-showcase-link" href={activeCategory.href}>
          Перейти до категорії
          <ArrowUpRight aria-hidden size={17} />
        </Link>
      </div>
      <p aria-live="polite" className="sr-only">
        Активна категорія: {activeCategory.name}
      </p>
    </section>
  );
}
