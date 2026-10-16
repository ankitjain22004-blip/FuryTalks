/* Renders js/data/speakers.js as a gallery with a View Bio dialog. */
(function () {
  var grid = document.getElementById('speaker-grid'), dlg = document.getElementById('speaker-dialog');
  if (!grid || !dlg) return;
  FT.wireDialog(dlg);
  var PH = 'images/speakers/placeholder.svg', last = null;
  function ig(url) { var u = FT.safeUrl(url || ''); if (!u) return null; var m = u.match(/instagram\.com\/([\w.]+)/i); return { href: u, label: m ? '@' + m[1] : 'Instagram' }; }
  function igLink(s, cls) {
    if (!s.ig) return FT.el('span', cls + ' ft-soon', 'Instagram · coming soon');
    var a = FT.el('a', cls + ' text-link', s.ig.label + ' '); a.href = s.ig.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', s.name + ' on Instagram'); a.appendChild(FT.arrow(13)); return a;
  }
  var items = (window.FURYTALKS_SPEAKERS || []).map(function (s, i) {
    var named = !!(s.name || '').trim();
    return { name: named ? s.name : 'Speaker ' + (i + 1) + ' · To be announced', photo: FT.safeUrl(s.photo || '') ? s.photo : PH, real: !!FT.safeUrl(s.photo || ''),
      ig: ig(s.instagram), short: s.shortBio || 'Biography coming soon.', full: s.fullBio || s.shortBio || 'Full biography coming soon.' };
  });
  items.forEach(function (s) {
    var li = FT.el('li', 'ft-speaker'), fig = FT.el('div', 'ft-speaker-photo'), im = FT.el('img', 'story-photo');
    im.src = s.photo; im.alt = s.real ? 'Photograph of ' + s.name : 'Placeholder portrait for ' + s.name; im.width = 400; im.height = 500; im.loading = 'lazy'; im.decoding = 'async';
    im.addEventListener('error', function () { if (im.src.indexOf('placeholder') < 0) im.src = PH; });
    fig.appendChild(im); li.appendChild(fig);
    li.appendChild(FT.el('h3', 'serif ft-speaker-name', s.name));
    li.appendChild(igLink(s, 'ft-speaker-ig'));
    li.appendChild(FT.el('p', 'ft-speaker-bio', s.short));
    var b = FT.el('button', 'ft-viewbio text-link', 'View Bio'); b.type = 'button'; b.setAttribute('aria-haspopup', 'dialog'); b.setAttribute('aria-label', 'View bio of ' + s.name);
    b.addEventListener('click', function () {
      last = b; dlg.querySelector('img').src = s.photo; dlg.querySelector('img').alt = im.alt;
      dlg.querySelector('h3').textContent = s.name; dlg.querySelector('.ft-dlg-bio').textContent = s.full;
      var slot = dlg.querySelector('.ft-dlg-ig'); slot.replaceChildren(igLink(s, 'ft-speaker-ig')); FT.openDialog(dlg);
    });
    li.appendChild(b); grid.appendChild(li);
  });
  dlg.addEventListener('close', function () { if (last) last.focus(); });
})();
