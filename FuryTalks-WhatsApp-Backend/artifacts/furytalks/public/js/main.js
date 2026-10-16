/* FuryTalks — page behaviour (vanilla JS). Content lives in js/data/*.js. */
(function () {
  'use strict';

  /* ---------- Navigation menu ---------- */
  var trigger = document.querySelector('button[aria-controls="site-navigation"]');
  var panel = document.getElementById('site-navigation');
  var menuLinks = panel ? panel.querySelectorAll('[data-menu-link]') : [];
  var triggerHTML = trigger ? trigger.innerHTML : '';
  var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  function isOpen() { return panel && !panel.hidden; }

  function setMenu(open) {
    if (!panel || !trigger) return;
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    trigger.innerHTML = open ? 'Close' + closeIcon : triggerHTML;
    if (open && menuLinks.length) menuLinks[0].focus();
  }

  if (trigger && panel) {
    trigger.addEventListener('click', function () { setMenu(!isOpen()); });
    panel.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { setMenu(false); trigger.focus(); }
      if (e.key === 'Tab' && menuLinks.length) {
        var first = menuLinks[0], last = menuLinks[menuLinks.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Footer contact cards ---------- */
  var SITE = window.FURYTALKS_SITE || {};
  var C = SITE.contact || {};
  var footer = document.getElementById('contact');
  var footerGrid = footer && footer.querySelector('.grid.gap-12');
  if (footer && footerGrid) {
    footer.classList.add('ft-contact');
    footerGrid.classList.add('ft-contact-top');
    var contactWrap = footerGrid.querySelector(':scope > .grid');
    if (contactWrap) {
        var existingContactDetails = contactWrap.children[1] || null;
        if (existingContactDetails) {
          existingContactDetails.classList.add('ft-contact-details');
          var emailLink = existingContactDetails.querySelector('#footer-email');
          if (emailLink && C.email) {
            emailLink.href = 'mailto:' + C.email;
            emailLink.textContent = C.email;
          }
          var phoneLink = existingContactDetails.querySelector('#footer-phone');
          if (phoneLink && SITE.whatsappNumber) {
            phoneLink.href = 'https://wa.me/' + String(SITE.whatsappNumber).replace(/\D/g, '');
            phoneLink.target = '_blank';
            phoneLink.rel = 'noopener noreferrer';
            phoneLink.textContent = 'WhatsApp: ' + SITE.whatsappNumber;
          }
        }
      contactWrap.className = 'ft-contact-content';
      contactWrap.replaceChildren();
      var heading = document.createElement('p');
      heading.className = 'eyebrow ft-contact-heading';
      heading.textContent = 'Find us';
      contactWrap.appendChild(heading);

      var cards = document.createElement('div');
      cards.className = 'ft-contact-grid';
      var iconMarkup = {
        Instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
        Facebook: '<path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v5h4v-5h3l1-4h-4V9a1 1 0 0 1 1-1z"/>',
        WhatsApp: '<path d="M20.4 11.7a8.4 8.4 0 0 1-12.4 7.4L4 20l1-3.8a8.4 8.4 0 1 1 15.4-4.5z"/><path d="M8.3 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .6.5.9 1.3 1.6 2.2 2 .2.1.4.1.6-.1l.8-1c.2-.2.4-.2.7-.1l1.7.8c.3.2.4.3.4.5 0 .3-.2 1.2-.8 1.7-.5.5-1.2.7-2 .5-1.2-.3-2.6-1.1-3.8-2.2-1.1-1-2-2.4-2.3-3.4-.3-.9 0-1.7.4-2.4z"/>',
        LinkedIn: '<path d="M5 9v10"/><circle cx="5" cy="5" r="1"/><path d="M10 19v-6a4 4 0 0 1 8 0v6"/><path d="M10 10v9"/>',
        YouTube: '<rect x="3" y="5" width="18" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/>',
        Email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'
      };
      var entries = [
        { name: 'Instagram', value: C.instagramHandle || C.instagram, href: C.instagram, external: true },
        { name: 'Facebook', value: C.facebook || 'Link needed', href: C.facebook, external: true },
        { name: 'WhatsApp', value: SITE.whatsappNumber || '+91 8800219630', href: 'https://wa.me/' + String(SITE.whatsappNumber || '+91 8800219630').replace(/\D/g, ''), external: true },
        { name: 'LinkedIn', value: C.linkedinHandle || 'LinkedIn', href: C.linkedin, external: true },
        { name: 'YouTube', value: C.youtube || 'Link needed', href: C.youtube, external: true },
        { name: 'Email', value: C.email || 'Email needed', href: C.email ? 'mailto:' + C.email : '', external: false }
      ];
      entries.forEach(function (entry) {
        var card = document.createElement(entry.href ? 'a' : 'div');
        card.className = 'ft-contact-card' + (entry.href ? '' : ' is-unconfigured');
        if (entry.href) {
          card.href = entry.href;
          if (entry.external) {
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
          }
        } else {
          card.setAttribute('aria-disabled', 'true');
        }
        var icon = document.createElement('span');
        icon.className = 'ft-contact-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + iconMarkup[entry.name] + '</svg>';
        var name = document.createElement('span');
        name.className = 'ft-contact-name';
        name.textContent = entry.name;
        var value = document.createElement('span');
        value.className = 'ft-contact-value';
        value.textContent = entry.value;
        card.append(icon, name, value);
        cards.appendChild(card);
      });
      contactWrap.appendChild(cards);
      if (existingContactDetails) contactWrap.appendChild(existingContactDetails);
    }
  }
})();
