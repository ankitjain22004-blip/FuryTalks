/* Renders js/data/media.js: YouTube video cards (click-to-play) and the photo gallery. */
(function () {
  var M = window.FURYTALKS_MEDIA || {}, vg = document.getElementById('video-gallery'), pg = document.getElementById('photo-gallery');
  function empty(c, t) { c.appendChild(FT.el('p', 'ft-empty', t)); }

  var videos = (M.videos || []).map(function (v) { return { v: v, id: FT.youtubeId(v.url || v.youtubeId) }; }).filter(function (x) { return x.id; });
  if (vg) {
    if (!videos.length) empty(vg, 'Videos Coming Soon');
    else { vg.classList.add('ft-video-grid'); videos.forEach(function (x) {
      var c = FT.el('article', 'ft-video'), box = FT.el('div', 'ft-video-box'), btn = FT.el('button', 'ft-play');
      btn.type = 'button'; btn.setAttribute('aria-label', 'Play video: ' + (x.v.title || 'FuryTalks video'));
      var im = FT.el('img'), th = FT.safeUrl(x.v.thumbnail || '') || 'https://i.ytimg.com/vi/' + x.id + '/hqdefault.jpg';
      im.src = th; im.alt = ''; im.loading = 'lazy'; im.addEventListener('error', function () { im.remove(); });
      btn.appendChild(im); btn.appendChild(FT.el('span', 'ft-play-icon')); box.appendChild(btn);
      btn.addEventListener('click', function () {
        var f = FT.el('iframe'); f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(x.id) + '?autoplay=1&rel=0';
        f.title = x.v.title || 'FuryTalks video'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen = true;
        box.replaceChildren(f);
      });
      c.appendChild(box);
      if (x.v.category) c.appendChild(FT.el('p', 'eyebrow ft-cat', x.v.category));
      c.appendChild(FT.el('h4', 'serif ft-video-title', x.v.title || ''));
      if (x.v.description) c.appendChild(FT.el('p', 'ft-caption', x.v.description));
      vg.appendChild(c);
    }); }
  }

  var photos = (M.photos || []).filter(function (p) { return FT.safeUrl(p.src || ''); });
  if (pg) {
    if (!photos.length) empty(pg, 'Photographs Coming Soon');
    else {
      pg.classList.add('ft-photo-grid');
      var dlg = document.getElementById('photo-dialog'), big = dlg.querySelector('img'), cap = dlg.querySelector('figcaption');
      FT.wireDialog(dlg);
      photos.forEach(function (p) {
        var b = FT.el('button', 'ft-photo'), im = FT.el('img');
        b.type = 'button'; b.setAttribute('aria-label', 'View photo: ' + (p.alt || p.caption || 'FuryTalks event'));
        im.src = p.src; im.alt = p.alt || ''; im.loading = 'lazy'; im.decoding = 'async';
        im.addEventListener('error', function () { b.remove(); });
        b.appendChild(im);
        b.addEventListener('click', function () { big.src = p.src; big.alt = p.alt || ''; cap.textContent = p.caption || ''; FT.openDialog(dlg); });
        pg.appendChild(b);
      });
    }
  }
})();
