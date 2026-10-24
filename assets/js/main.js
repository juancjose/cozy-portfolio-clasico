(() => {
  document.documentElement.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
  }));

  // Aparición suave
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else items.forEach(el => el.classList.add('is-visible'));

  // Contadores
  const fmt = new Intl.NumberFormat('es-AR');
  const counters = document.querySelectorAll('[data-count]');
  const run = el => {
    const to = +el.dataset.count, dur = 1600, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = fmt.format(v);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduce) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { run(e.target); co.unobserve(e.target); }
    }), { threshold: .6 });
    counters.forEach(c => { c.textContent = '0'; co.observe(c); });
  }

  // Filtro de deportistas
  const filters = document.querySelectorAll('.filter');
  const athletes = document.querySelectorAll('.athlete');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
    athletes.forEach(a => { a.hidden = !(f === 'all' || a.dataset.sport === f); if (!a.hidden) a.classList.add('is-visible'); });
  }));

  // Video bajo demanda (no carga YouTube hasta el click)
  document.querySelectorAll('[data-yt]').forEach(btn => btn.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0`;
    f.title = 'Video de Cozy Sport';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  }));

  document.querySelectorAll('[data-year]').forEach(y => y.textContent = new Date().getFullYear());
})();
