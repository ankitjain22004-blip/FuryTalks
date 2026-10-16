/* Browser-only form validation and WhatsApp click-to-chat. */
(function () {
  'use strict';

  /* WhatsApp number that receives enquiries. It is read from js/data/site.js (whatsappNumber),
     so you only change it in ONE place. The digits below are only a fallback. */
  var RECIPIENT = String((window.FURYTALKS_SITE || {}).whatsappNumber || '918800219630').replace(/\D/g, '');

  function phoneDigits(v) { return v.replace(/[\s\-().]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, ''); }
  function clean(v, multi) {
    v = v.replace(multi ? /[\u0000-\u0009\u000b-\u001f]+/g : /[\u0000-\u001f]+/g, ' ');
    return multi ? v.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim() : v.replace(/\s+/g, ' ').trim();
  }
  function linkedin(v) { return /^(https?:\/\/)/i.test(v) ? v : 'https://' + v; }
  var RULES = {
    name: { empty: 'Please enter your full name.', ok: function (v) { return /^[\p{L}][\p{L}\p{M}\s.'’-]{1,59}$/u.test(v); }, bad: 'Use letters only (2 to 60 characters).' },
    phone: { empty: 'Please enter your phone number.', ok: function (v) { return /^[6-9]\d{9}$/.test(phoneDigits(v)); }, bad: 'Enter a valid 10-digit mobile number (starting 6–9, optionally with +91).' },
    email: { empty: 'Please enter your email address.', ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }, bad: 'Enter a valid email address.' },
    linkedin: { ok: function (v) { return /^https?:\/\/([\w-]+\.)*linkedin\.com\/[^\s]+$/i.test(linkedin(v)); }, bad: 'Enter a valid LinkedIn profile link.' },
    consent: { empty: 'Please tick the box to give your consent.' },
  };

  function check(input) {
    var rule = RULES[input.dataset.rule], err = document.getElementById(input.id + '-err'), msg = '';
    var multi = input.tagName === 'TEXTAREA', value = clean(input.value, multi);
    if (input.type === 'checkbox') {
      if (!input.checked) msg = rule.empty;
    } else if (!value) {
      if (input.required) msg = (rule && rule.empty) || 'Please fill in this field.';
    } else if (rule && rule.ok) {
      if (!rule.ok(value)) msg = rule.bad;
    } else {
      var min = +input.dataset.min || 2, max = +input.dataset.max || 120;
      if (value.length < min || value.length > max) msg = 'Enter between ' + min + ' and ' + max + ' characters.';
    }
    if (err) err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function field(form, name) {
    var input = form.elements[name];
    if (!input) return '';
    return input.type === 'checkbox' ? (input.checked ? 'Yes' : 'No') : clean(input.value, input.tagName === 'TEXTAREA');
  }

  function enquiryMessage(form, kind) {
    if (kind === 'speaker') {
      return [
        'NEW FURYTALKS SPEAKER APPLICATION',
        '',
        'Full Name: ' + field(form, 'name'),
        'Email Address: ' + field(form, 'email'),
        'Phone Number: ' + field(form, 'phone'),
        'Company/Organization: ' + field(form, 'org'),
        'Designation/Role: ' + field(form, 'role'),
        'LinkedIn Profile: ' + (field(form, 'linkedin') || 'Not provided'),
        'Topic You Want to Speak About: ' + field(form, 'topic'),
        'Short Bio or Your Journey: ' + field(form, 'bio'),
        'Message: ' + (field(form, 'message') || 'Not provided'),
        'Consent Status: ' + field(form, 'consent'),
      ].join('\n');
    }
    return [
      'NEW FURYTALKS EVENT ENQUIRY',
      '',
      'Full Name: ' + field(form, 'name'),
      'Email Address: ' + field(form, 'email'),
      'Phone Number: ' + field(form, 'phone'),
      'College/Organization: ' + field(form, 'org'),
      'Message: ' + (field(form, 'message') || 'Not provided'),
    ].join('\n');
  }

  function setup(id) {
    var form = document.getElementById(id);
    if (!form) return;
    var kind = form.dataset.kind;
    var status = form.querySelector('.ft-status');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input,textarea')).filter(function (input) {
      return input.name !== 'website';
    });
    var trap = form.querySelector('input[name=website]');

    inputs.forEach(function (input) {
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', function () {
        if (input.getAttribute('aria-invalid') === 'true') check(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (status) {
        status.replaceChildren();
        status.className = 'ft-status';
      }
      var invalid = inputs.filter(function (input) { return !check(input); });
      if (invalid.length) {
        if (status) {
          status.textContent = 'Please correct the highlighted fields and try again.';
          status.classList.add('is-error');
        }
        invalid[0].focus();
        return;
      }
      if (trap && trap.value) return;

      var url = 'https://wa.me/' + RECIPIENT + '?text=' + encodeURIComponent(enquiryMessage(form, kind));
      var opened = window.open(url, '_blank');
      if (opened) opened.opener = null;
      if (!status) return;
       status.className = 'ft-status is-ready';
      status.appendChild(document.createTextNode('WhatsApp is ready. Press Send in WhatsApp to complete your enquiry. If a new tab did not open, '));
      var fallback = document.createElement('a');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'open WhatsApp here';
      status.appendChild(fallback);
      status.appendChild(document.createTextNode('.'));
    });
  }

  setup('attend-form');
  setup('speaker-form');
})();
