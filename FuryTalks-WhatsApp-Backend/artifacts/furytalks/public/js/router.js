/* In-page navigation for a normal, scrolling single page.
   - Cards "Upcoming Events", "Watch", "Attend", "Speakers" are accordions: click to open their content inside the card, click again to close.
   - Card "About FuryTalks" scrolls to the very top; card "Contact FuryTalks" scrolls to the Contact section at the bottom.
   - Menu items / #hash links to #events, #watch, #attend, #speakers open that accordion and scroll to it. */
(function () {
  var header = document.querySelector('.site-shell > header');
  var reduce = function () { return matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function smooth() { return reduce() ? 'auto' : 'smooth'; }
  function acc(id) { var a = document.getElementById(id); return a && a.hasAttribute('data-acc') ? a : null; }

  function setOpen(a, open) {
    a.classList.toggle('is-open', open);
    var panel = a.querySelector('.ft-acc-panel'), t = a.querySelector('[data-acc-toggle]');
    if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
    if (t) t.setAttribute('aria-expanded', String(open));
  }
  function toggle(a) { setOpen(a, !a.classList.contains('is-open')); }
  function openAndShow(a) { setOpen(a, true); a.scrollIntoView({ behavior: smooth(), block: 'start' }); }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || !e.target.closest) return;
    var t = e.target;

    var head = t.closest('[data-acc-head]');                                   // click on a point's title area or button
    if (head) { e.preventDefault(); toggle(head.closest('[data-acc]')); return; }
    if (t.closest('[data-acc]')) return;                                       // clicks inside opened content behave normally

    var link = t.closest('[data-scroll]') || (t.closest('[data-card-link]') || { querySelector: function () { return null; } }).querySelector('[data-scroll]');
    if (link) {
      e.preventDefault();
      if (link.dataset.scroll === 'top') { window.scrollTo({ top: 0, behavior: smooth() }); history.pushState(null, '', '#top'); }
      else { var c = document.getElementById('contact'); if (c) { c.scrollIntoView({ behavior: smooth(), block: 'start' }); history.pushState(null, '', '#contact'); } }
      return;
    }

    var a = t.closest('a[href^="#"]'); if (!a) return;                         // menu / other links to an accordion point
    var target = acc(a.getAttribute('href').slice(1)); if (!target) return;
    e.preventDefault(); history.pushState(null, '', '#' + target.id); openAndShow(target);
  });

  window.addEventListener('hashchange', function () { var a = acc(location.hash.slice(1)); if (a) openAndShow(a); });
  if (acc(location.hash.slice(1))) window.addEventListener('load', function () { openAndShow(acc(location.hash.slice(1))); });

  /* Solid header bar once the visitor scrolls past the top of the landing image. */
  function onScroll() { if (header) header.classList.toggle('is-scrolled', (window.pageYOffset || document.documentElement.scrollTop) > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
