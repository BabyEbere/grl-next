/* ========================================================
   Global Resources Limited — JS (pure vanilla)
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -- Sticky nav: hide topbar on scroll -- */
  const topbar = document.getElementById('topbar');
  window.addEventListener('scroll', () => {
    topbar?.classList.toggle('hidden', window.scrollY > 50);
  }, { passive: true });

  /* -- Mobile menu toggle -- */
  const mobBtn  = document.getElementById('mob-btn');
  const mobMenu = document.getElementById('mob-menu');
  const b1 = document.getElementById('b1');
  const b2 = document.getElementById('b2');
  const b3 = document.getElementById('b3');
  let open = false;

  mobBtn?.addEventListener('click', () => {
    open = !open;
    mobMenu.classList.toggle('hidden', !open);
    b1.style.transform = open ? 'rotate(45deg) translateY(8px)'  : '';
    b2.style.opacity   = open ? '0' : '1';
    b3.style.transform = open ? 'rotate(-45deg) translateY(-8px)' : '';
  });

  /* -- Scroll reveal -- */
  const revealEls = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => ro.observe(el));

  /* -- Animated counters -- */
  const counters = document.querySelectorAll('[data-count]');
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.getAttribute('data-count');
      const sfx = el.getAttribute('data-suffix') || '';
      let cur = 0;
      const step = end / 80;
      const iv = setInterval(() => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur).toLocaleString() + sfx;
        if (cur >= end) clearInterval(iv);
      }, 20);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => co.observe(el));

  /* -- Contact form loading state -- */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.innerHTML = '<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Sending...';
      btn.disabled = true;
    }
  });

});
