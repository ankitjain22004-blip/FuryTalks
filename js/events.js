/* Renders js/data/events.js into the Upcoming Events panel and the Attend panel. */
(function () {
  var events = window.FURYTALKS_EVENTS || [];
  function details(rows) {
    var dl = FT.el('dl', 'ft-details');
    rows.forEach(function (r) {
      if (!r[1] && !r[2]) return;
      var row = FT.el('div'); row.appendChild(FT.el('dt', 'eyebrow', r[0]));
      var dd = FT.el('dd'); if (r[1]) dd.textContent = r[1]; else dd.appendChild(FT.el('span', 'ft-soon', 'Coming Soon'));
      row.appendChild(dd); dl.appendChild(row);
    });
    return dl;
  }
  var list = document.getElementById('events-list');
  if (list) events.forEach(function (ev) {
    var a = FT.el('article', 'ft-event'), main = FT.el('div', 'ft-event-main');
    if (ev.label) main.appendChild(FT.el('p', 'eyebrow ft-event-label', ev.label));
    main.appendChild(FT.el('h3', 'serif ft-event-title', ev.name));
    main.appendChild(details([['Date', ev.date, 1], ['Venue', ev.venue, 1], ['Location', ev.location], ['Theme', ev.theme]]));
    String(ev.description || '').split(/\n\s*\n/).forEach(function (t) { if (t.trim()) main.appendChild(FT.el('p', 'ft-event-desc', t.trim())); });
    a.appendChild(main);
    var poster = FT.safeUrl(ev.poster || '');
    if (poster) {
      var f = FT.el('figure', 'image-frame ft-poster'), im = FT.el('img');
      im.src = poster; im.alt = ev.posterAlt || ev.name; im.loading = 'lazy';
      im.addEventListener('error', function () { f.remove(); });
      f.appendChild(im); a.appendChild(f);
    }
    list.appendChild(a);
  });
  var ad = document.getElementById('attend-details');
  if (ad && events[0]) ad.appendChild(details([['Event', events[0].name, 1], ['Date', events[0].date, 1], ['Venue', events[0].venue, 1]]));
})();
