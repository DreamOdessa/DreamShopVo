import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(ScrollTrigger, Draggable);

type GalleryCardsProps = {
  images?: string[];
};

const GalleryRoot = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
  min-height: 520px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cards = styled.ul`
  position: absolute;
  width: 14rem;
  height: 18rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 0;
  margin: 0;
`;

const Card = styled.li<{ $bg: string }>`
  list-style: none;
  width: 14rem;
  aspect-ratio: 9/16;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.8rem;
  background-image: url(${p => p.$bg});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const Actions = styled.div`
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const ActionBtn = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  border: 2px solid #111;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover { transform: translateY(-1px); }
`;

// A lightweight React wrapper around the GSAP demo from the markdown
const GalleryCards: React.FC<GalleryCardsProps> = ({ images }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const imageList = useMemo(() => {
    const defaults = [
      'https://assets.codepen.io/16327/portrait-number-01.png',
      'https://assets.codepen.io/16327/portrait-number-02.png',
      'https://assets.codepen.io/16327/portrait-number-03.png',
      'https://assets.codepen.io/16327/portrait-number-04.png',
      'https://assets.codepen.io/16327/portrait-number-05.png',
      'https://assets.codepen.io/16327/portrait-number-06.png',
      'https://assets.codepen.io/16327/portrait-number-07.png',
    ];
    const list = (images && images.length > 0 ? images : defaults).slice(0, 12);
    // duplicate to make loop smoother
    return list.concat(list.slice(0, 5));
  }, [images]);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    const cards = Array.from(root.querySelectorAll<HTMLLIElement>('li'));
    if (!cards.length) return;

    let iteration = 0;
    const spacing = 0.1;
    const snapTime = gsap.utils.snap(spacing);

    gsap.set(cards, { xPercent: 400, opacity: 0, scale: 0 });

    const animateFunc = (el: Element) => {
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.in', immediateRender: false }
      ).fromTo(
        el,
        { xPercent: 400 },
        { xPercent: -400, duration: 1, ease: 'none', immediateRender: false },
        0
      );
      return tl;
    };

    const rawSequence = gsap.timeline({ paused: true });
    const overlap = Math.ceil(1 / spacing);
    const l = cards.length + overlap * 2;
    let time = 0;
    for (let i = 0; i < l; i++) {
      const index = i % cards.length;
      time = i * spacing;
      rawSequence.add(animateFunc(cards[index]), time);
      if (i <= cards.length) rawSequence.addLabel('label' + i, time);
    }
    const startTime = cards.length * spacing + 0.5;
    const loopTime = (cards.length + overlap) * spacing + 1;
    rawSequence.time(startTime);

    const seamlessLoop = gsap.timeline({ paused: true, repeat: -1, onRepeat() { // fix rare edge case
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._time === (this as any)._dur && ((this as any)._tTime += (this as any)._dur - 0.01);
    }});

    seamlessLoop
      .to(rawSequence, { time: loopTime, duration: loopTime - startTime, ease: 'none' })
      .fromTo(rawSequence, { time: overlap * spacing + 1 }, { time: startTime, duration: startTime - (overlap * spacing + 1), immediateRender: false, ease: 'none' });

    const playhead = { offset: 0 };
    const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());
    const scrub = gsap.to(playhead, {
      offset: 0,
      onUpdate() { seamlessLoop.time(wrapTime(playhead.offset)); },
      duration: 0.5,
      ease: 'power3',
      paused: true,
    });

    const progressToScroll = (progress: number) => gsap.utils.clamp(1, (ScrollTrigger.getById('gc')?.end || 3000) - 1, gsap.utils.wrap(0, 1, progress) * (ScrollTrigger.getById('gc')?.end || 3000));

    const wrap = (iterationDelta: number, scrollTo: number) => {
      iteration += iterationDelta;
      const t = ScrollTrigger.getById('gc');
      if (t) { t.scroll(scrollTo); t.update(); }
    };

    const trigger = ScrollTrigger.create({
      id: 'gc',
      start: 0,
      onUpdate(self) {
        const scroll = self.scroll();
        if (scroll > self.end - 1) {
          wrap(1, 2);
        } else if (scroll < 1 && self.direction < 0) {
          wrap(-1, self.end - 2);
        } else {
          // @ts-ignore
          scrub.vars.offset = (iteration + self.progress) * seamlessLoop.duration();
          scrub.invalidate().restart();
        }
      },
      end: '+=3000',
      pin: root,
    });

    const scrollToOffset = (offset: number) => {
      const snappedTime = snapTime(offset);
      const progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration();
      const scroll = progressToScroll(progress);
      if (progress >= 1 || progress < 0) {
        return wrap(Math.floor(progress), scroll);
      }
      trigger.scroll(scroll);
    };

    const next = root.querySelector<HTMLButtonElement>('button.next');
    const prev = root.querySelector<HTMLButtonElement>('button.prev');
    next?.addEventListener('click', () => scrollToOffset(scrub.vars.offset + spacing));
    prev?.addEventListener('click', () => scrollToOffset(scrub.vars.offset - spacing));

    const dragProxy = document.createElement('div');
    dragProxy.style.visibility = 'hidden';
    dragProxy.style.position = 'absolute';
    root.appendChild(dragProxy);

    Draggable.create(dragProxy, {
      type: 'x',
      trigger: root.querySelector('.cards') as Element,
      onPress() {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).startOffset = scrub.vars.offset;
      },
      onDrag() {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        scrub.vars.offset = (this as any).startOffset + ((this as any).startX - (this as any).x) * 0.001;
        scrub.invalidate().restart();
      },
      onDragEnd() { scrollToOffset(scrub.vars.offset as number); },
    });

    return () => {
      ScrollTrigger.getById('gc')?.kill();
      scrub.kill();
      seamlessLoop.kill();
      rawSequence.kill();
      next?.remove();
      prev?.remove();
    };
  }, [imageList]);

  return (
    <GalleryRoot ref={rootRef}>
      <Cards className="cards">
        {imageList.map((src, i) => (
          <Card key={i} $bg={src} />
        ))}
      </Cards>
      <Actions className="actions">
        <ActionBtn className="prev">Prev</ActionBtn>
        <ActionBtn className="next">Next</ActionBtn>
      </Actions>
    </GalleryRoot>
  );
};

export default GalleryCards;


