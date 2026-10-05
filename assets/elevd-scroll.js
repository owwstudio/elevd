(() => {
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger || window.ElevdMotion) return;
  gsap.registerPlugin(ScrollTrigger);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const controllers = new Map();
  const runtime = { lenis: null, refresh: () => ScrollTrigger.refresh() };
  window.ElevdMotion = runtime;
  let tick;
  let lockObserver;

  function updateSmoothing() {
    if (runtime.lenis) {
      gsap.ticker.remove(tick);
      lockObserver.disconnect();
      runtime.lenis.destroy();
      runtime.lenis = null;
    }
    if (!Lenis || reducedMotion.matches || Shopify.designMode) return;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: .09,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
      stopInertiaOnNavigate: true,
      prevent: node => node instanceof HTMLElement && !!node.closest('[data-lenis-prevent], dialog, .drawer, .menu-drawer'),
    });
    runtime.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    function syncLock() {
      const locked = document.documentElement.classList.contains('elevd-intro-active') ||
        ['hidden', 'clip'].includes(getComputedStyle(document.body).overflowY);
      if (locked && !lenis.isStopped) lenis.stop();
      else if (!locked && lenis.isStopped) lenis.start();
    }
    lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    syncLock();
  }

  function mount(section) {
    if (controllers.has(section)) return;
    const panels = [...section.querySelectorAll('[data-day-scene]')];
    if (!panels.length) return;
    const stage = section.querySelector('[data-day-stage]');
    const links = [...section.querySelectorAll('[data-day-link]')];
    const progress = section.querySelector('[data-day-progress]');
    const media = gsap.matchMedia();
    let trigger;
    let activeIndex = -1;

    function select(index) {
      if (index === activeIndex) return;
      activeIndex = index;
      section.dataset.activeMode = panels[index].dataset.mode;
      panels.forEach((panel, i) => {
        panel.setAttribute('aria-hidden', String(i !== index));
        panel.inert = i !== index;
      });
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }

    function onSceneLink(event) {
      const link = event.target.closest('[data-day-link]');
      if (!link || !trigger || !section.classList.contains('elevd-day--enhanced')) return;
      event.preventDefault();
      // Pinned chapters use timeline positions, so Lenis must not also follow the DOM anchor.
      event.stopPropagation();
      const index = Number(link.dataset.dayLink);
      const fraction = (index + .5) / panels.length;
      const target = trigger.start + (trigger.end - trigger.start) * fraction;
      if (runtime.lenis) runtime.lenis.scrollTo(target);
      else window.scrollTo({ top: target, behavior: 'smooth' });
    }
    section.addEventListener('click', onSceneLink);

    media.add({ desktop: '(min-width: 900px) and (min-height: 650px)', motion: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions.motion || Shopify.designMode) return;
      if (!context.conditions.desktop) {
        panels.forEach(panel => gsap.fromTo(panel.querySelector('.elevd-day__image'),
          { y: 20, opacity: .5 },
          { y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: panel, start: 'top 90%', end: 'top 45%', scrub: true } }
        ));
        return;
      }
      section.classList.add('elevd-day--enhanced');
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      select(0);
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => select(Math.min(panels.length - 1, Math.floor(timeline.time() + .02))),
        scrollTrigger: {
          id: section.id,
          trigger: section,
          pin: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * panels.length * .85}`,
          scrub: .35,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      // Each scene holds for most of its chapter; only the boundary crossfades.
      timeline.to(progress, { scaleX: 1, duration: panels.length }, 0);
      panels.forEach((panel, index) => {
        if (index === 0) return;
        timeline.to(panels[index - 1], { autoAlpha: 0, duration: .3 }, index - .15);
        timeline.to(panel, { autoAlpha: 1, duration: .3 }, index - .15);
      });
      trigger = timeline.scrollTrigger;
      return () => {
        trigger = null;
        activeIndex = -1;
        section.classList.remove('elevd-day--enhanced');
        delete section.dataset.activeMode;
        panels.forEach(panel => { panel.removeAttribute('aria-hidden'); panel.inert = false; });
        links.forEach(link => link.removeAttribute('aria-current'));
      };
    });

    const refreshImage = () => { runtime.lenis?.resize(); ScrollTrigger.refresh(); };
    const images = [...section.querySelectorAll('img')];
    images.forEach(image => { if (!image.complete) image.addEventListener('load', refreshImage, { once: true }); });
    controllers.set(section, () => {
      media.revert();
      section.removeEventListener('click', onSceneLink);
      images.forEach(image => image.removeEventListener('load', refreshImage));
      controllers.delete(section);
    });
  }

  function init() {
    updateSmoothing();
    document.querySelectorAll('[data-elevd-day]').forEach(mount);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    ScrollTrigger.refresh();
  }

  reducedMotion.addEventListener('change', updateSmoothing);
  document.addEventListener('shopify:section:load', event => {
    event.target.querySelectorAll('[data-elevd-day]').forEach(mount);
    ScrollTrigger.refresh();
  });
  document.addEventListener('shopify:section:unload', event => {
    controllers.forEach((cleanup, section) => { if (event.target.contains(section)) cleanup(); });
  });
  // Let the signature logo finish before calculating pins or starting smooth scroll.
  if (document.documentElement.classList.contains('elevd-intro-active')) {
    const introObserver = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('elevd-intro-active')) {
        introObserver.disconnect();
        init();
      }
    });
    introObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } else init();
})();
