(() => {
  const root = document.documentElement;
  if (!root.classList.contains('elevd-intro-active')) return;

  const overlay = document.querySelector('[data-elevd-intro]');
  const brand = document.querySelector('.elevd-brand');
  const main = document.querySelector('#MainContent');
  const skip = document.querySelector('[data-elevd-intro-skip]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = [];
  const previousTabindex = brand?.getAttribute('tabindex');
  const previousInert = main?.inert;
  let finished = false;
  let startTransform = '';

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(window.elevdIntroWatchdog);
    const skipWasFocused = document.activeElement === skip;
    animations.forEach(animation => animation.cancel());
    root.classList.remove('elevd-intro-active', 'elevd-intro-ready');
    root.dataset.elevdIntro = 'complete';
    if (brand) {
      brand.style.removeProperty('transform');
      if (previousTabindex === null) brand.removeAttribute('tabindex');
      else brand.setAttribute('tabindex', previousTabindex);
    }
    if (main) main.inert = previousInert;
    try { sessionStorage.setItem('elevd:intro:v1', 'seen'); } catch (_) {}
    window.removeEventListener('resize', finish);
    window.removeEventListener('pagehide', finish);
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMotion.removeEventListener('change', finish);
    if (skipWasFocused) brand?.focus({ preventScroll: true });
  }

  function onKeydown(event) { if (event.key === 'Escape') finish(); }
  function onVisibility() { if (document.hidden) finish(); }
  function animate(element, frames, options) {
    if (!element || finished) return null;
    const animation = element.animate(frames, { fill: 'both', ...options });
    animations.push(animation);
    return animation;
  }
  function bounded(promise, duration) {
    return Promise.race([Promise.resolve(promise).catch(() => {}), new Promise(resolve => setTimeout(resolve, duration))]);
  }
  function decodeImage(image) {
    return image?.decode ? image.decode().catch(() => {}) : Promise.resolve();
  }

  window.elevdFinishIntro = finish;
  if (!overlay || !brand || !brand.animate || reducedMotion.matches || Shopify.designMode || window.scrollY > 0) {
    finish();
    return;
  }
  if (main) main.inert = true;
  brand.setAttribute('tabindex', '-1');
  skip?.addEventListener('click', finish, { once: true });
  window.addEventListener('resize', finish, { once: true });
  window.addEventListener('pagehide', finish, { once: true });
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('visibilitychange', onVisibility);
  reducedMotion.addEventListener('change', finish, { once: true });

  async function play() {
    const heroReady = bounded(Promise.all([...document.querySelectorAll('.elevd-hero img[fetchpriority="high"]')].map(decodeImage)), 1800);
    await bounded(Promise.all([document.fonts?.load('700 24px "Helvetica Now Display"'), decodeImage(brand.querySelector('img'))]), 1200);
    if (finished) return;
    const target = brand.getBoundingClientRect();
    if (!target.width || !target.height) { finish(); return; }
    const scale = Math.min(2.5, (window.innerWidth - 64) / target.width);
    const x = window.innerWidth / 2 - (target.left + target.width / 2);
    const y = window.innerHeight / 2 - (target.top + target.height / 2);
    startTransform = `translate(${x}px, ${y}px) scale(${scale})`;
    brand.style.transform = startTransform;
    root.classList.add('elevd-intro-ready');
    root.dataset.elevdIntro = 'centered';
    const pulse = animate(brand.querySelector('img'), [{ transform: 'scale(1)', opacity: .8 }, { transform: 'scale(1.1)', opacity: 1, offset: .45 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, easing: 'ease-in-out' });
    await Promise.all([heroReady, pulse?.finished.catch(() => {})]);
    if (finished) return;
    root.dataset.elevdIntro = 'travelling';
    animate(overlay.querySelector('.elevd-intro__status'), [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
    animate(skip, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
    animate(overlay.querySelector('.elevd-intro__curtain'), [{ opacity: 1 }, { opacity: 0 }], { duration: 620, delay: 100, easing: 'cubic-bezier(.22,1,.36,1)' });
    animate(brand, [{ color: '#ffffff' }, { color: '#202020' }], { duration: 550, delay: 200 });
    const flight = animate(brand, [{ transform: startTransform }, { transform: 'translate(0, 0) scale(1)' }], { duration: 1050, easing: 'cubic-bezier(.76,0,.24,1)' });
    const lines = [...document.querySelectorAll('.elevd-hero__heading > span')];
    lines.forEach((line, index) => animate(line, [{ opacity: 0, transform: 'translateY(24px)', clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)' }], { duration: 550, delay: 320 + index * 80, easing: 'cubic-bezier(.22,1,.36,1)' }));
    document.querySelectorAll('.elevd-hero__aside, .elevd-hero__sparkle').forEach(element => animate(element, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, delay: 480 }));
    await flight.finished.catch(() => {});
    finish();
  }
  play().catch(finish);
})();
