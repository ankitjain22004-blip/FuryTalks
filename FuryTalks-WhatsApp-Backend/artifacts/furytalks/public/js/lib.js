/* Shared helpers: window.FT */
window.FT = (function () {
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function safeUrl(u) { try { var x = new URL(u, location.href); return /^https?:$/.test(x.protocol) ? u : ''; } catch (e) { return ''; } }
  function youtubeId(v) {
    v = String(v || '').trim();
    if (/^[\w-]{11}$/.test(v)) return v;
    var m = v.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/); return m ? m[1] : '';
  }
  function whatsappUrl(msg) {
    return 'https://wa.me/' + String(window.FURYTALKS_SITE.whatsappNumber).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg);
  }
  function arrow(size) {
    var d = document.createElement('span');
    d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';
    return d.firstChild;
  }
  function openDialog(d) { d.showModal(); }
  function wireDialog(d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    var x = d.querySelector('[data-close]'); if (x) x.addEventListener('click', function () { d.close(); });
  }
  return { el: el, safeUrl: safeUrl, youtubeId: youtubeId, whatsappUrl: whatsappUrl, arrow: arrow, openDialog: openDialog, wireDialog: wireDialog };
})();
