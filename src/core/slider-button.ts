const LEFT_ARROW_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;
const RIGHT_ARROW_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

export interface SliderButtonOptions {
  onPrev?: () => void;
  onNext?: () => void;
  iconLeft?: string;
  iconRight?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { height: 28, width: 70, iconSize: 14 },
  md: { height: 36, width: 90, iconSize: 18 },
  lg: { height: 44, width: 110, iconSize: 22 },
};

type HoverSide = 'left' | 'right' | null;

export class SliderButton {
  private container: HTMLDivElement;
  private leftBtn: HTMLButtonElement;
  private rightBtn: HTMLButtonElement;
  private options: SliderButtonOptions;
  private hoverSide: HoverSide = null;
  private prevHoverSide: HoverSide = null;
  private slideBg: HTMLDivElement;

  constructor(options: SliderButtonOptions = {}) {
    this.options = options;
    const { size = 'md' } = options;
    const dimensions = SIZE_MAP[size];

    this.container = document.createElement('div');
    this.container.className = `snb snb-js ${options.className ?? ''}`.trim();
    this.container.style.setProperty('--snb-height', `${dimensions.height}px`);
    this.container.style.setProperty('--snb-width', `${dimensions.width}px`);
    this.container.style.setProperty('--snb-icon-size', `${dimensions.iconSize}px`);

    this.slideBg = document.createElement('div');
    this.slideBg.className = 'snb-js-slide-bg';
    this.slideBg.setAttribute('aria-hidden', 'true');

    this.leftBtn = document.createElement('button');
    this.leftBtn.className = 'snb-left';
    this.leftBtn.type = 'button';
    this.leftBtn.setAttribute('aria-label', 'Previous');
    this.leftBtn.innerHTML = `<span class="snb-icon">${options.iconLeft ?? LEFT_ARROW_SVG}</span>`;

    const divider = document.createElement('div');
    divider.className = 'snb-divider';
    divider.setAttribute('aria-hidden', 'true');

    this.rightBtn = document.createElement('button');
    this.rightBtn.className = 'snb-right';
    this.rightBtn.type = 'button';
    this.rightBtn.setAttribute('aria-label', 'Next');
    this.rightBtn.innerHTML = `<span class="snb-icon">${options.iconRight ?? RIGHT_ARROW_SVG}</span>`;

    this.container.append(this.slideBg, this.leftBtn, divider, this.rightBtn);

    this.leftBtn.addEventListener('click', () => this.options.onPrev?.());
    this.rightBtn.addEventListener('click', () => this.options.onNext?.());

    this.container.addEventListener('mousemove', this.handleMouseMove);
    this.container.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private handleMouseMove = (e: MouseEvent): void => {
    const rect = this.container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const mid = rect.width / 2;
    const side: HoverSide = x < mid ? 'left' : 'right';
    this.prevHoverSide = this.hoverSide;
    this.hoverSide = side;
    this.updateSlideState();
  };

  private handleMouseLeave = (): void => {
    this.prevHoverSide = this.hoverSide;
    this.hoverSide = null;
    this.updateSlideState();
  };

  private updateSlideState(): void {
    const isEnter = this.prevHoverSide === null && this.hoverSide !== null;

    this.container.classList.remove(
      'snb-hover-left', 'snb-hover-right', 'snb-exit-from-left', 'snb-exit-from-right', 'snb-enter-right-prep'
    );

    if (this.hoverSide === 'left') {
      this.container.classList.add('snb-hover-left');
    } else if (this.hoverSide === 'right') {
      if (isEnter) {
        this.container.classList.add('snb-enter-right-prep');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.container.classList.remove('snb-enter-right-prep');
            this.container.classList.add('snb-hover-right');
          });
        });
      } else {
        this.container.classList.add('snb-hover-right');
      }
    } else if (this.prevHoverSide === 'left') {
      this.container.classList.add('snb-exit-from-left');
      this.slideBg.addEventListener('transitionend', () => {
        this.container.classList.remove('snb-exit-from-left');
      }, { once: true });
    } else if (this.prevHoverSide === 'right') {
      this.container.classList.add('snb-exit-from-right');
      this.slideBg.addEventListener('transitionend', () => {
        this.container.classList.remove('snb-exit-from-right');
      }, { once: true });
    }
  }

  /**
   * Get the root DOM element
   */
  getElement(): HTMLDivElement {
    return this.container;
  }

  /**
   * Mount the button into a parent element
   */
  mount(parent: HTMLElement | string): this {
    const el = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (!el) throw new Error(`SliderButton: parent element not found`);
    el.appendChild(this.container);
    return this;
  }

  /**
   * Remove the button from the DOM
   */
  unmount(): this {
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('mouseleave', this.handleMouseLeave);
    this.container.remove();
    return this;
  }

  /**
   * Update options
   */
  update(options: Partial<SliderButtonOptions>): this {
    this.options = { ...this.options, ...options };
    if (options.iconLeft !== undefined) {
      this.leftBtn.innerHTML = `<span class="snb-icon">${options.iconLeft}</span>`;
    }
    if (options.iconRight !== undefined) {
      this.rightBtn.innerHTML = `<span class="snb-icon">${options.iconRight}</span>`;
    }
    if (options.size !== undefined) {
      const dimensions = SIZE_MAP[options.size];
      this.container.style.setProperty('--snb-height', `${dimensions.height}px`);
      this.container.style.setProperty('--snb-width', `${dimensions.width}px`);
      this.container.style.setProperty('--snb-icon-size', `${dimensions.iconSize}px`);
    }
    if (options.className !== undefined) {
      this.container.className = `snb snb-js ${options.className ?? ''}`.trim();
    }
    return this;
  }
}
