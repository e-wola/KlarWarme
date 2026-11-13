/* KlarWärme — accessible, dependency-free navigation and restrained motion. */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const services = document.querySelector('[data-service-toggle]');
  const item = services?.closest('.nav-item');
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
  const mobile = matchMedia('(max-width: 1050px)');
  const setServicesOpen = open => {
    item?.classList.toggle('open', open);
    services?.setAttribute('aria-expanded', String(open));
    services?.setAttribute('aria-label', open ? 'Untermenü Leistungen schließen' : 'Untermenü Leistungen öffnen');
  };
  const setMenuOpen = (open, returnFocus=false) => {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    toggle.textContent = open ? '×' : '☰';
    if (!open) setServicesOpen(false);
    if (returnFocus) toggle.focus();
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    setMenuOpen(open);
    if (open) nav.querySelector('a')?.focus();
  });
  services?.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    setServicesOpen(open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    setMenuOpen(false);
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (mobile.matches && nav?.classList.contains('open')) setMenuOpen(false, true);
      else if (item?.classList.contains('open')) {setServicesOpen(false); services?.focus();}
    }
  });
  document.addEventListener('pointerdown', e => {
    if (!item?.contains(e.target)) setServicesOpen(false);
    if (mobile.matches && nav?.classList.contains('open') && !nav.contains(e.target) && !toggle?.contains(e.target)) setMenuOpen(false);
  });
  mobile.addEventListener?.('change', () => setMenuOpen(false));
  const scrollHeader = () => header?.classList.toggle('scrolled', scrollY > 8);
  scrollHeader();
  addEventListener('scroll', scrollHeader, {passive: true});

  // Newsletter demo handler — no data is sent until a verified endpoint is configured.
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const feedback = form.querySelector('[data-newsletter-feedback]');
      const emailInput = form.querySelector('[name="email"]');
      feedback.className = 'form-feedback';
      feedback.textContent = '';
      if (!emailInput || !emailInput.value.trim() || !emailInput.checkValidity()) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        emailInput?.focus();
        return;
      }
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Vielen Dank! Bei Freischaltung des Newsletters erhalten Sie eine Bestätigung.';
      emailInput.value = '';
    });
  });

  // IntersectionObserver is local and progressive: no remote script or personal data transfer.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const nodes = [...document.querySelectorAll('.reveal,.steps article,.values article,.guide-grid a')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.06, rootMargin:'0px 0px -24px 0px'});
    nodes.forEach(el => {el.classList.add('motion-node'); observer.observe(el);});
  }
  // A readable and reversible selection state is preserved for keyboard + mouse users.
  const filters = [...document.querySelectorAll('[data-filter]')];
  const tiles = [...document.querySelectorAll('[data-projects] [data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.filter;
    filters.forEach(b => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    tiles.forEach(tile => {tile.hidden = !(kind==='all' || tile.dataset.category===kind);});
  }));
  const topic = new URLSearchParams(location.search).get('thema');
  if (topic) {
    const select = document.querySelector('[data-enquiry-form] select[name="service"]');
    if (select) {
      const match = [...select.options].find(o => o.textContent.toLowerCase().includes('wärmepumpe'));
      if (match) select.value = match.value;
    }
    const textarea = document.querySelector('[data-enquiry-form] textarea[name="message"]');
    if (textarea && !textarea.value) textarea.value = 'Ich habe den Wärmepumpen-Eignungscheck genutzt und möchte die nächsten Schritte besprechen.';
  }
});
