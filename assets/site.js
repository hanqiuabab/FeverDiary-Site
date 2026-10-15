/* Local presentation only: no network calls, storage, analytics, or tracking. */
(() => {
  const tabs = [...document.querySelectorAll('[data-feature-tab]')];
  const selectTab = (next, focus = false) => {
    tabs.forEach((tab, i) => {
      const selected = i === next;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tabs[next].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(i));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(next, true); }
    });
  });
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  }
  const track = document.querySelector('.scene-track');
  if (track) {
    const scenes = [...track.querySelectorAll('[data-scene]')];
    const dots = [...document.querySelectorAll('.scene-dots span')];
    const prev = document.querySelector('[data-scene-prev]');
    const next = document.querySelector('[data-scene-next]');
    let current = 0;
    const update = () => {
      const left = track.getBoundingClientRect().left + 20;
      current = scenes.reduce((nearest, scene, i) =>
        Math.abs(scene.getBoundingClientRect().left - left) < Math.abs(scenes[nearest].getBoundingClientRect().left - left) ? i : nearest, 0);
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const move = direction => {
      const target = scenes[Math.max(0, Math.min(scenes.length - 1, current + direction))];
      const left = track.scrollLeft + target.getBoundingClientRect().left - track.getBoundingClientRect().left - 20;
      track.scrollTo({left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, {passive:true});
    track.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    window.addEventListener('resize', update, {passive:true});
    update();
  }
})();
