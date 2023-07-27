// Generate somem markdown for a README detailing the various concepts covered and general overview of this project. Note that this is a recreation of the navbar menu from vercel.com/design. The css is not shown but I managed to get pixel perfect



/**
 * Interface for the calcSwitcher function.
 */
export interface ICalcSwitcher {
  (activeBtn: HTMLButtonElement | null, targetBtn: HTMLButtonElement): void;
}

const BTN_ACTIVE_CLASS = 'btn-active';
const GLOW_LEFT_OFFSET = 19.75;

let html: HTMLHtmlElement;
let start: HTMLDivElement;
let switcher: HTMLDivElement;
let switcherRoot: HTMLDivElement;
let switcherBtns: NodeListOf<HTMLButtonElement>;
let mainSections: NodeListOf<HTMLElement>;
let tops: number[];
let resizeTimeout: number;

/**
 * Adjusts the properties of the switcher buttons when clicked.
 * @param {HTMLButtonElement | null} activeBtn - Currently active button element.
 * @param {HTMLButtonElement} targetBtn - Target button element that was clicked.
 */
const calcSwitcher: ICalcSwitcher = (activeBtn, targetBtn) => {
  const glow = document.querySelector('.switcher-glow') as HTMLDivElement;
  const curr = document.querySelector('.switcher-curr') as HTMLDivElement;

  const currLeft: number = +targetBtn.offsetLeft;
  const width: number = +targetBtn.offsetWidth;
  const middle: number = Math.round(width / 2);

  curr.setAttribute('style', `width: ${width}px; left: ${currLeft}px`);
  glow.style.left = `${currLeft + middle - GLOW_LEFT_OFFSET}px`;

  const switcherOffsetWidth: number = switcher.offsetWidth;
  const sumOffsetX: number = Math.round(currLeft + middle + 4);
  const multOffsetX: number = Math.round((sumOffsetX / switcherOffsetWidth) * 100);
  switcher.style.setProperty('--x', `${100 - multOffsetX}%`);
  targetBtn.classList.add(BTN_ACTIVE_CLASS);

  if (!activeBtn) return;
  activeBtn.classList.remove(BTN_ACTIVE_CLASS);
};

/**
 * Handles the switcher button click events.
 * @param {MouseEvent} e - The click event object.
 */
const handleSwitcher = (e: MouseEvent): void => {
  const currentTarget = e.currentTarget as HTMLElement;
  const target = e.target as HTMLElement;

  const activeBtn = currentTarget.querySelector(`.${BTN_ACTIVE_CLASS}`) as HTMLButtonElement | null;
  const closestBtn = target.closest('.switcher-btn') as HTMLButtonElement;

  if (!closestBtn) return;
  if (closestBtn === activeBtn) return;
  calcSwitcher(activeBtn, closestBtn);

  const targetSection = document.querySelector(`#${closestBtn.dataset.scrollTo}`) as HTMLElement;
  window.scrollTo({
    top: targetSection.id === 'home' ? 0 : targetSection.offsetTop + 10,
    behavior: 'smooth',
  });
};

/**
 * Generates an array of top offsets for each main section.
 * @return {number[]} - The array of top offsets.
 */
const generateTops = (): number[] => {
  const topsArray: number[] = [start.offsetTop];
  for (const section of mainSections) {
    topsArray.push(section.offsetTop + start.offsetTop);
  }
  return topsArray;
};

/**
 * Handles the scroll events for the switcher.
 */
const switcherScroll = (): void => {
  const startingTop: number = start.offsetTop;
  const windowScrollY: number = Math.round(window.scrollY);
  const switcherHeight: number = switcher.offsetHeight;

  if (windowScrollY >= startingTop - 15) {
    switcher.classList.add('switcher-fixed');
  } else {
    switcher.classList.remove('switcher-fixed');
  }

  const currDiff: number = windowScrollY - startingTop - switcherHeight;
  const activeBtn = document.querySelector(`.${BTN_ACTIVE_CLASS}`) as HTMLButtonElement | null;
  let currSection: number = 0;

  for (let i = 0; i < tops.length; i++) {
    if (tops[i] > currDiff) {
      currSection = i;
      break;
    }
  }

  const targetBtn = switcherBtns[currSection] as HTMLButtonElement;
  if (activeBtn === targetBtn) return;
  calcSwitcher(activeBtn, targetBtn);
};

/**
 * Handles the window resize events.
 */
const handleResize = (): void => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    html.style.scrollBehavior = 'auto';
    tops = generateTops();
    html.style.scrollBehavior = 'smooth';
  }, 20);
};

/**
 * Initializes the DOM element variables.
 */
const initElements = (): void => {
  html = document.documentElement as HTMLHtmlElement;
  start = document.querySelector('.start') as HTMLDivElement;
  switcher = document.querySelector('.switcher') as HTMLDivElement;
  switcherRoot = document.querySelector('.switcher-root') as HTMLDivElement;
  switcherBtns = document.querySelectorAll('.switcher-btn') as NodeListOf<HTMLButtonElement>;
  mainSections = document.querySelectorAll('section') as NodeListOf<HTMLElement>;
  tops = generateTops();
};

/**
 * Sets up the initial state of the application on load.
 * 
 * Set history.scrollRestoration to manual to prevent the page from jumping to the top on refresh.
 * https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
 */
const setUpLoad = (): void => {
  calcSwitcher(null, switcherBtns[0]);
  if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
  }
};

/**
 * All event listeners are initialized here.
 */
const initListeners = (): void => {
  html.style.scrollBehavior = 'smooth';
  start.style.height = `${switcher.offsetHeight}px`;
  switcherRoot.addEventListener('click', handleSwitcher);
  window.addEventListener('scroll', switcherScroll, true);
  window.addEventListener('resize', handleResize);
};

/**
 * The main initialization function of the application.
 */
const initApp = (): void => {
  initElements();
  setUpLoad();
  initListeners();
};

window.addEventListener('load', initApp, { once: true });
