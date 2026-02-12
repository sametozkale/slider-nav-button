import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import '../core/slider-button.css';

export interface SliderButtonProps {
  onPrev?: () => void;
  onNext?: () => void;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { height: 28, width: 70, iconSize: 14 },
  md: { height: 36, width: 90, iconSize: 18 },
  lg: { height: 44, width: 110, iconSize: 22 },
};

const TRANSITION = {
  duration: 0.28,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
};

type HoverSide = 'left' | 'right' | null;

/**
 * All states use transformOrigin: 'right center' so that:
 * - Both exit animations shrink toward the divider
 * - Cross-side slides (left↔right) are smooth
 * - Enter animations expand from the divider
 */
function getPillAnimation(hoverSide: HoverSide, prevHoverSide: HoverSide) {
  if (hoverSide === null && prevHoverSide === null) {
    return { scaleX: 0, x: '0%' };
  }
  if (hoverSide === null) {
    // Exit: shrink toward divider
    return prevHoverSide === 'left'
      ? { scaleX: 0, x: '0%' }
      : { scaleX: 0, x: '100%' };
  }
  if (hoverSide === 'left') {
    return { scaleX: 1, x: '0%' };
  }
  return { scaleX: 1, x: '100%' };
}

function getPillInitial(hoverSide: HoverSide, prevHoverSide: HoverSide) {
  const isEnter = prevHoverSide === null && hoverSide !== null;
  const isMove = prevHoverSide !== null && hoverSide !== null && prevHoverSide !== hoverSide;
  const isExit = hoverSide === null && prevHoverSide !== null;

  if (isEnter) {
    return hoverSide === 'left'
      ? { scaleX: 0, x: '0%' }
      : { scaleX: 0, x: '100%' };
  }
  if (isMove) {
    return prevHoverSide === 'left'
      ? { scaleX: 1, x: '0%' }
      : { scaleX: 1, x: '100%' };
  }
  if (isExit) {
    return prevHoverSide === 'left'
      ? { scaleX: 1, x: '0%' }
      : { scaleX: 1, x: '100%' };
  }
  if (hoverSide === null) {
    return { scaleX: 0, x: '0%' };
  }
  return hoverSide === 'left'
    ? { scaleX: 1, x: '0%' }
    : { scaleX: 1, x: '100%' };
}

export const SliderButton = forwardRef<HTMLDivElement, SliderButtonProps>(
  function SliderButton(
    {
      onPrev,
      onNext,
      iconLeft,
      iconRight,
      size = 'md',
      className = '',
    },
    ref
  ) {
    const dimensions = SIZE_MAP[size];
    const [hoverSide, setHoverSide] = useState<HoverSide>(null);
    const prevHoverRef = useRef<HoverSide>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      prevHoverRef.current = hoverSide;
    }, [hoverSide]);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const mid = rect.width / 2;
        setHoverSide(x < mid ? 'left' : 'right');
      },
      []
    );

    const handleMouseLeave = useCallback(() => setHoverSide(null), []);

    const prevHoverSide = prevHoverRef.current;
    const animate = getPillAnimation(hoverSide, prevHoverSide);
    const initial = getPillInitial(hoverSide, prevHoverSide);

    return (
      <div
        ref={setRefs}
        className={`snb snb-motion ${className}`.trim()}
        style={{
          ['--snb-height' as string]: `${dimensions.height}px`,
          ['--snb-width' as string]: `${dimensions.width}px`,
          ['--snb-icon-size' as string]: `${dimensions.iconSize}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="snb-motion-slide-bg"
          aria-hidden
          initial={initial}
          animate={animate}
          transition={TRANSITION}
        />
        <button
          type="button"
          className="snb-left"
          aria-label="Previous"
          onClick={onPrev}
        >
          <span className="snb-icon">
            {iconLeft ?? (
              <HugeiconsIcon icon={ArrowLeft02Icon} size={dimensions.iconSize} color="currentColor" />
            )}
          </span>
        </button>
        <motion.div
          className="snb-divider"
          aria-hidden
          initial={false}
          animate={{ opacity: hoverSide ? 0 : 1 }}
          transition={TRANSITION}
        />
        <button
          type="button"
          className="snb-right"
          aria-label="Next"
          onClick={onNext}
        >
          <span className="snb-icon">
            {iconRight ?? (
              <HugeiconsIcon icon={ArrowRight02Icon} size={dimensions.iconSize} color="currentColor" />
            )}
          </span>
        </button>
      </div>
    );
  }
);
