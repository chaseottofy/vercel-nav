"use strict";// src/index.ts
var BTN_ACTIVE_CLASS = "btn-active";
var GLOW_LEFT_OFFSET = 19.75;
var html;
var start;
var switcher;
var switcherRoot;
var switcherBtns;
var mainSections;
var tops;
var resizeTimeout;
var calcSwitcher = (activeBtn, targetBtn) => {
  const glow = document.querySelector(".switcher-glow");
  const curr = document.querySelector(".switcher-curr");
  const currLeft = +targetBtn.offsetLeft;
  const width = +targetBtn.offsetWidth;
  const middle = Math.round(width / 2);
  curr.setAttribute("style", `width: ${width}px; left: ${currLeft}px`);
  glow.style.left = `${currLeft + middle - GLOW_LEFT_OFFSET}px`;
  const switcherOffsetWidth = switcher.offsetWidth;
  const sumOffsetX = Math.round(currLeft + middle + 4);
  const multOffsetX = Math.round(sumOffsetX / switcherOffsetWidth * 100);
  switcher.style.setProperty("--x", `${100 - multOffsetX}%`);
  targetBtn.classList.add(BTN_ACTIVE_CLASS);
  if (!activeBtn)
    return;
  activeBtn.classList.remove(BTN_ACTIVE_CLASS);
};
var handleSwitcher = (e) => {
  const currentTarget = e.currentTarget;
  const target = e.target;
  const activeBtn = currentTarget.querySelector(`.${BTN_ACTIVE_CLASS}`);
  const closestBtn = target.closest(".switcher-btn");
  if (!closestBtn)
    return;
  if (closestBtn === activeBtn)
    return;
  calcSwitcher(activeBtn, closestBtn);
  const targetSection = document.querySelector(`#${closestBtn.dataset.scrollTo}`);
  window.scrollTo({
    top: targetSection.id === "home" ? 0 : targetSection.offsetTop + 10,
    behavior: "smooth"
  });
};
var generateTops = () => {
  const topsArray = [start.offsetTop];
  for (const section of mainSections) {
    topsArray.push(section.offsetTop + start.offsetTop);
  }
  return topsArray;
};
var switcherScroll = () => {
  const startingTop = start.offsetTop;
  const windowScrollY = Math.round(window.scrollY);
  const switcherHeight = switcher.offsetHeight;
  if (windowScrollY >= startingTop - 15) {
    switcher.classList.add("switcher-fixed");
  } else {
    switcher.classList.remove("switcher-fixed");
  }
  const currDiff = windowScrollY - startingTop - switcherHeight;
  const activeBtn = document.querySelector(`.${BTN_ACTIVE_CLASS}`);
  let currSection = 0;
  for (let i = 0; i < tops.length; i++) {
    if (tops[i] > currDiff) {
      currSection = i;
      break;
    }
  }
  const targetBtn = switcherBtns[currSection];
  if (activeBtn === targetBtn)
    return;
  calcSwitcher(activeBtn, targetBtn);
};
var handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    html.style.scrollBehavior = "auto";
    tops = generateTops();
    html.style.scrollBehavior = "smooth";
  }, 20);
};
var initElements = () => {
  html = document.documentElement;
  start = document.querySelector(".start");
  switcher = document.querySelector(".switcher");
  switcherRoot = document.querySelector(".switcher-root");
  switcherBtns = document.querySelectorAll(".switcher-btn");
  mainSections = document.querySelectorAll("section");
  tops = generateTops();
};
var setUpLoad = () => {
  calcSwitcher(null, switcherBtns[0]);
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
};
var initListeners = () => {
  html.style.scrollBehavior = "smooth";
  start.style.height = `${switcher.offsetHeight}px`;
  switcherRoot.addEventListener("click", handleSwitcher);
  window.addEventListener("scroll", switcherScroll, true);
  window.addEventListener("resize", handleResize);
};
var initApp = () => {
  initElements();
  setUpLoad();
  initListeners();
};
window.addEventListener("load", initApp, { once: true });
