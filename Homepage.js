/* Tacos Mi Rancho — Homepage.js
   Pairs with Homepage.html + Homepage.css.
   Progressive enhancement only — the page is fully usable with this file absent.

   Enqueue in WordPress with defer, e.g.:
     wp_enqueue_script('tmr-homepage', get_stylesheet_directory_uri().'/Homepage.js', array(), '1.0.0', true);
*/
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Hours config — EDIT HERE if the truck's hours change.
     Values are minutes past midnight, in the truck's local time (America/New_York).
     Use null for a closed day. 600 = 10:00am, 1260 = 9:00pm.
     -------------------------------------------------------------------------- */
  var TIMEZONE = 'America/New_York';
  var HOURS = {
    Sunday: null,
    Monday: [600, 1260],
    Tuesday: [600, 1260],
    Wednesday: [600, 1260],
    Thursday: [600, 1260],
    Friday: [600, 1260],
    Saturday: null
  };
  var DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ---------- Time helpers ---------- */
  function nowInTruckTime() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIMEZONE,
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(new Date());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      var hour = parseInt(o.hour, 10) % 24;
      return { weekday: o.weekday, minutes: hour * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { weekday: DAY_ORDER[d.getDay()], minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function formatTime(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var ap = h >= 12 ? 'pm' : 'am';
    var hr = h % 12;
    if (hr === 0) { hr = 12; }
    return hr + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ap;
  }

  function computeStatus() {
    var t = nowInTruckTime();
    var today = HOURS[t.weekday];

    if (today && t.minutes >= today[0] && t.minutes < today[1]) {
      return { open: true, label: 'Open now', detail: 'Closes ' + formatTime(today[1]) };
    }

    var idx = DAY_ORDER.indexOf(t.weekday);
    for (var i = 0; i < 8; i++) {
      var day = DAY_ORDER[(idx + i) % 7];
      var h = HOURS[day];
      if (!h) { continue; }
      if (i === 0 && t.minutes < h[0]) {
        return { open: false, label: 'Closed', detail: 'Opens ' + formatTime(h[0]) + ' today' };
      }
      if (i > 0) {
        var when = i === 1 ? 'tomorrow' : day;
        return { open: false, label: 'Closed', detail: 'Opens ' + formatTime(h[0]) + ' ' + when };
      }
    }
    return { open: false, label: 'Closed', detail: '' };
  }

  /* ---------- Features ---------- */
  function initStatusChip() {
    var chip = document.querySelector('.tmr-page .tmr-status-chip');
    if (!chip) { return; }
    var s = computeStatus();
    chip.textContent = s.detail ? (s.label + ' · ' + s.detail) : s.label;
    chip.classList.toggle('tmr-status-chip--closed', !s.open);
    chip.setAttribute('aria-label', s.open ? 'The truck is open now' : 'The truck is currently closed');
  }

  function initTodayHighlight() {
    var today = nowInTruckTime().weekday;
    var rows = document.querySelectorAll('.tmr-page .tmr-hours-row');
    Array.prototype.forEach.call(rows, function (row) {
      var days = (row.getAttribute('data-days') || '').split(',');
      if (days.indexOf(today) > -1) { row.classList.add('tmr-hours-row--today'); }
    });
  }

  function initNavToggle() {
    var toggle = document.querySelector('.tmr-page .tmr-nav-toggle');
    var links = document.querySelector('.tmr-page .tmr-nav-links');
    if (!toggle || !links) { return; }

    function close() {
      links.classList.remove('tmr-nav-links--open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('tmr-nav-links--open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); }
    });

    return { close: close, links: links, toggle: toggle };
  }

  function initSmoothScroll(nav) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var anchors = document.querySelectorAll('.tmr-page a[href^="#"]');
    Array.prototype.forEach.call(anchors, function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id.length < 2) { return; }
        var target = document.querySelector(id);
        if (!target) { return; }
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (nav && nav.links.classList.contains('tmr-nav-links--open')) { nav.close(); }
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', id);
        }
      });
    });
  }

  function initYear() {
    var el = document.querySelector('.tmr-page .tmr-year');
    if (el) { el.textContent = String(new Date().getFullYear()); }
  }

  ready(function () {
    if (!document.querySelector('.tmr-page')) { return; }
    initStatusChip();
    initTodayHighlight();
    var nav = initNavToggle();
    initSmoothScroll(nav);
    initYear();
  });
})();
