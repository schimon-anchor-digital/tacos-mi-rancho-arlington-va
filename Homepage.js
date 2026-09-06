/* Tacos Mi Rancho — Homepage.js
   Pairs with Homepage.html + Homepage.css.
   Progressive enhancement only — the page is fully usable (in English) with this file absent.

   Enqueue in WordPress with defer, e.g.:
     wp_enqueue_script('tmr-homepage', get_stylesheet_directory_uri().'/Homepage.js', array(), '1.1.0', true);
*/
(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Hours config — EDIT HERE if the truck's hours change.
     Values are minutes past midnight, in the truck's local time (America/New_York).
     Use null for a closed day. 600 = 10:00am, 1260 = 9:00pm.
     Confirmed with Ismael: open every day, 10am–9pm.
     -------------------------------------------------------------------------- */
  var TIMEZONE = 'America/New_York';
  var HOURS = {
    Sunday: [600, 1260],
    Monday: [600, 1260],
    Tuesday: [600, 1260],
    Wednesday: [600, 1260],
    Thursday: [600, 1260],
    Friday: [600, 1260],
    Saturday: [600, 1260]
  };
  var DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* --------------------------------------------------------------------------
     Translations. English lives in the HTML as the default; this fills in both
     languages so the toggle can swap either way. To edit copy, change it here.
     -------------------------------------------------------------------------- */
  var I18N = {
    en: {
      'nav.toggleMenu': 'Toggle menu',
      'nav.menu': 'Menu',
      'nav.reviews': 'Reviews',
      'nav.story': 'Our Story',
      'nav.find': 'Find Us',

      'hero.badge': 'Arlington, VA · Family-run',
      'hero.title1': 'Real tacos.',
      'hero.title2': 'Parked on Barton St.',
      'hero.text': 'Asada, pastor, lengua, birria — grilled to order on the truck at 1401 N Barton St. Cash, card, or call ahead.',
      'hero.cta.menu': 'See the menu',
      'hero.cta.find': 'Find the truck',

      'menu.eyebrow': 'The Menu',
      'menu.h2': 'Choose your meat',
      'menu.lede': 'Everything is grilled to your ticket — meat on the comal, tortillas warmed to order, and house salsas (verde, roja, and a smoky chile de árbol) on the side.',
      'menu.tacos.sub': 'Double corn tortilla, onion & cilantro',
      'menu.quesadillas.sub': 'Flour tortilla, melted Oaxaca cheese',
      'menu.burritos.sub': 'Choice of meat, rice & beans',
      'menu.birria.sub': 'Slow-stewed beef, consommé to dip',
      'menu.d.asada': 'Grilled steak',
      'menu.d.pastor': 'Marinated pork, pineapple',
      'menu.d.pollo': 'Grilled chicken',
      'menu.d.carnitas': 'Braised pork',
      'menu.d.lengua': 'Beef tongue',
      'menu.d.camaron': 'Shrimp',
      'menu.i.cheese': 'Cheese',
      'menu.d.cheese': 'Just cheese, done right',
      'menu.d.chorizo': 'House chorizo',
      'menu.d.qasada': 'Grilled steak',
      'menu.d.qpastor': 'Marinated pork',
      'menu.d.burrito': 'Rice, beans, cheese, salsa',
      'menu.d.torta': 'Grilled roll, avocado, chipotle mayo',
      'menu.i.guac': 'Add guacamole',
      'menu.d.guac': 'or extra meat',
      'menu.i.birriaTacos': 'Birria Tacos',
      'menu.d.birriaTacos': '3 pieces + consommé',
      'menu.d.quesabirria': '3 pieces, melted cheese',
      'menu.i.consomme': 'Consommé',
      'menu.d.consomme': 'Cup, on its own',

      'reviews.eyebrow': 'What People Say',
      'reviews.h2': 'A neighborhood favorite',
      'reviews.lede': 'Regulars from all over Arlington — and a few who drive in just for this.',
      'reviews.q1': 'Best tacos in Arlington, hands down. The birria with consommé is exactly like what I grew up with.',
      'reviews.c1': 'Marisol R.',
      'reviews.q2': 'I drive across the county for the lengua tacos. Ismael runs the griddle like a pro and it shows.',
      'reviews.c2': 'Danny T.',
      'reviews.q3': "My family's go-to on Barton Street. Fair prices, huge flavor, and the salsas are unreal.",
      'reviews.c3': 'The Herrera family',
      'reviews.note': 'Placeholder quotes — real Google and Yelp reviews go here at launch.',

      'story.eyebrow': 'Our Story',
      'story.h2': 'One griddle, one recipe box',
      'story.p1': 'Tacos Mi Rancho started small — one griddle, a family recipe box, and Ismael Godoy taking orders at the window. The name says it: mi rancho, my home ground, the kitchen these recipes came from.',
      'story.p2': "It's still the same setup on N Barton St. Ismael still owns and runs the truck, the meat still hits the comal to order, and the salsas are still made in-house every day.",
      'story.kicker': 'Founder & operator',

      'find.eyebrow': 'Find Us',
      'find.h2': 'Corner of N Barton St',
      'find.lede': 'Look for the maroon truck. Limited picnic seating in the shade.',
      'find.loc.h3': 'Location',
      'find.loc.tel': 'Tel · (571) 419-0377',
      'find.cta.dir': 'Get directions',
      'find.cta.call': 'Call to order',
      'find.hours.h3': "When we're open",
      'find.hours.chipFallback': 'Open daily · 10am–9pm',
      'find.hours.weekdays': 'Mon – Fri',
      'find.hours.weekend': 'Sat – Sun',
      'find.hours.time': '10am – 9pm',
      'find.hours.note': 'Hours shift with weather & events — call ahead to be sure.',

      'footer.nav.menu': 'Menu',
      'footer.nav.reviews': 'Reviews',
      'footer.nav.story': 'Our Story',
      'footer.nav.find': 'Find Us',
      'footer.nav.call': 'Call',
      'footer.copy': 'Tacos Mi Rancho · Owner-operated by Ismael Godoy',
      'footer.pay': 'Cash · Card · Call ahead'
    },
    es: {
      'nav.toggleMenu': 'Abrir menú',
      'nav.menu': 'Menú',
      'nav.reviews': 'Reseñas',
      'nav.story': 'Nuestra Historia',
      'nav.find': 'Dónde Estamos',

      'hero.badge': 'Arlington, VA · Negocio familiar',
      'hero.title1': 'Tacos de verdad.',
      'hero.title2': 'En la esquina de Barton St.',
      'hero.text': 'Asada, pastor, lengua, birria — hechos al momento en la troca, en el 1401 de N Barton St. Efectivo, tarjeta, o llámanos antes.',
      'hero.cta.menu': 'Ver el menú',
      'hero.cta.find': 'Ubícanos',

      'menu.eyebrow': 'El Menú',
      'menu.h2': 'Elige tu carne',
      'menu.lede': 'Todo se prepara al momento — la carne en el comal, las tortillas calientitas, y las salsas de la casa (verde, roja, y una de chile de árbol bien picosa) aparte.',
      'menu.tacos.sub': 'Doble tortilla de maíz, cebolla y cilantro',
      'menu.quesadillas.sub': 'Tortilla de harina, quesillo de Oaxaca fundido',
      'menu.burritos.sub': 'Carne a elegir, arroz y frijoles',
      'menu.birria.sub': 'Res guisada lento, con consomé para remojar',
      'menu.d.asada': 'Bistec a la parrilla',
      'menu.d.pastor': 'Cerdo adobado con piña',
      'menu.d.pollo': 'Pollo a la parrilla',
      'menu.d.carnitas': 'Carnitas',
      'menu.d.lengua': 'Lengua de res',
      'menu.d.camaron': 'Camarón',
      'menu.i.cheese': 'Queso',
      'menu.d.cheese': 'Solo queso, bien hecho',
      'menu.d.chorizo': 'Chorizo de la casa',
      'menu.d.qasada': 'Bistec a la parrilla',
      'menu.d.qpastor': 'Cerdo adobado',
      'menu.d.burrito': 'Arroz, frijoles, queso, salsa',
      'menu.d.torta': 'Pan tostado, aguacate, mayonesa de chipotle',
      'menu.i.guac': 'Agrega guacamole',
      'menu.d.guac': 'o carne extra',
      'menu.i.birriaTacos': 'Tacos de Birria',
      'menu.d.birriaTacos': '3 piezas + consomé',
      'menu.d.quesabirria': '3 piezas, con queso fundido',
      'menu.i.consomme': 'Consomé',
      'menu.d.consomme': 'Vaso, solo',

      'reviews.eyebrow': 'Lo Que Dicen',
      'reviews.h2': 'El favorito del barrio',
      'reviews.lede': 'Clientes de todo Arlington — y algunos que manejan solo para esto.',
      'reviews.q1': 'Los mejores tacos de Arlington, sin duda. La birria con consomé sabe igualita a la de mi casa.',
      'reviews.c1': 'Marisol R.',
      'reviews.q2': 'Manejo de un lado del condado al otro por los tacos de lengua. Ismael domina el comal y se nota.',
      'reviews.c2': 'Danny T.',
      'reviews.q3': 'El lugar de mi familia en la Barton Street. Precio justo, mucho sabor, y las salsas están increíbles.',
      'reviews.c3': 'Familia Herrera',
      'reviews.note': 'Testimonios de ejemplo — aquí irán reseñas reales de Google y Yelp al publicar.',

      'story.eyebrow': 'Nuestra Historia',
      'story.h2': 'Un comal, un recetario',
      'story.p1': 'Tacos Mi Rancho empezó en chico — un comal, el recetario de la familia, e Ismael Godoy tomando las órdenes en la ventanilla. El nombre lo dice: mi rancho, la tierra de uno, la cocina de donde vienen estas recetas.',
      'story.p2': 'Sigue igual en la N Barton St. Ismael todavía es el dueño y atiende la troca, la carne sigue cayendo al comal al momento, y las salsas se hacen aquí mismo todos los días.',
      'story.kicker': 'Fundador y operador',

      'find.eyebrow': 'Dónde Estamos',
      'find.h2': 'En la esquina de N Barton St',
      'find.lede': 'Busca la troca color vino. Hay algunas mesas a la sombra.',
      'find.loc.h3': 'Ubicación',
      'find.loc.tel': 'Tel · (571) 419-0377',
      'find.cta.dir': 'Cómo llegar',
      'find.cta.call': 'Llama para ordenar',
      'find.hours.h3': 'Horario',
      'find.hours.chipFallback': 'Abierto todos los días · 10am–9pm',
      'find.hours.weekdays': 'Lun – Vie',
      'find.hours.weekend': 'Sáb – Dom',
      'find.hours.time': '10am – 9pm',
      'find.hours.note': 'El horario puede cambiar por el clima o eventos — mejor llámanos antes de venir.',

      'footer.nav.menu': 'Menú',
      'footer.nav.reviews': 'Reseñas',
      'footer.nav.story': 'Nuestra Historia',
      'footer.nav.find': 'Dónde Estamos',
      'footer.nav.call': 'Llámanos',
      'footer.copy': 'Tacos Mi Rancho · Atendido por su dueño, Ismael Godoy',
      'footer.pay': 'Efectivo · Tarjeta · Llama antes'
    }
  };

  /* Status-chip phrasing, per language. */
  var STATUS = {
    en: {
      open: 'Open now',
      closed: 'Closed',
      closes: function (time) { return 'Closes ' + time; },
      opensToday: function (time) { return 'Opens ' + time + ' today'; },
      opensTomorrow: function (time) { return 'Opens ' + time + ' tomorrow'; },
      opensDay: function (time, day) { return 'Opens ' + time + ' ' + day; },
      days: { Sunday: 'Sunday', Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday', Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday' }
    },
    es: {
      open: 'Abierto ahora',
      closed: 'Cerrado',
      closes: function (time) { return 'Cierra ' + time; },
      opensToday: function (time) { return 'Abre ' + time + ' hoy'; },
      opensTomorrow: function (time) { return 'Abre ' + time + ' mañana'; },
      opensDay: function (time, day) { return 'Abre ' + time + ' el ' + day; },
      days: { Sunday: 'domingo', Monday: 'lunes', Tuesday: 'martes', Wednesday: 'miércoles', Thursday: 'jueves', Friday: 'viernes', Saturday: 'sábado' }
    }
  };

  var LANGS = ['en', 'es'];
  var state = { lang: 'en' };

  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ---------- Language ---------- */
  function getInitialLang() {
    try {
      var fromUrl = new URLSearchParams(window.location.search).get('lang');
      if (LANGS.indexOf(fromUrl) > -1) { return fromUrl; }
    } catch (e) {}
    try {
      var saved = window.localStorage.getItem('tmr-lang');
      if (LANGS.indexOf(saved) > -1) { return saved; }
    } catch (e) {}
    var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : 'en';
  }

  function translate(key) {
    var dict = I18N[state.lang] || I18N.en;
    if (Object.prototype.hasOwnProperty.call(dict, key)) { return dict[key]; }
    return Object.prototype.hasOwnProperty.call(I18N.en, key) ? I18N.en[key] : null;
  }

  function applyLang(lang) {
    state.lang = LANGS.indexOf(lang) > -1 ? lang : 'en';

    var root = document.querySelector('.tmr-page');
    if (root) { root.setAttribute('lang', state.lang); }
    try { document.documentElement.setAttribute('lang', state.lang); } catch (e) {}

    var nodes = document.querySelectorAll('.tmr-page [data-i18n]');
    Array.prototype.forEach.call(nodes, function (el) {
      var value = translate(el.getAttribute('data-i18n'));
      if (value != null) { el.textContent = value; }
    });

    var toggle = document.querySelector('.tmr-page [data-lang-toggle]');
    if (toggle) {
      var toEs = state.lang !== 'es';
      toggle.textContent = toEs ? 'Español' : 'English';
      toggle.setAttribute('aria-label', toEs ? 'Cambiar a español' : 'Switch to English');
      toggle.setAttribute('aria-pressed', state.lang === 'es' ? 'true' : 'false');
    }

    initStatusChip();

    try { window.localStorage.setItem('tmr-lang', state.lang); } catch (e) {}
  }

  function initLangToggle() {
    var toggle = document.querySelector('.tmr-page [data-lang-toggle]');
    if (!toggle) { return; }
    toggle.addEventListener('click', function () {
      applyLang(state.lang === 'es' ? 'en' : 'es');
    });
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
    var s = STATUS[state.lang] || STATUS.en;
    var t = nowInTruckTime();
    var today = HOURS[t.weekday];

    if (today && t.minutes >= today[0] && t.minutes < today[1]) {
      return { open: true, label: s.open, detail: s.closes(formatTime(today[1])) };
    }

    var idx = DAY_ORDER.indexOf(t.weekday);
    for (var i = 0; i < 8; i++) {
      var day = DAY_ORDER[(idx + i) % 7];
      var h = HOURS[day];
      if (!h) { continue; }
      if (i === 0 && t.minutes < h[0]) {
        return { open: false, label: s.closed, detail: s.opensToday(formatTime(h[0])) };
      }
      if (i > 0) {
        var detail = i === 1 ? s.opensTomorrow(formatTime(h[0])) : s.opensDay(formatTime(h[0]), s.days[day]);
        return { open: false, label: s.closed, detail: detail };
      }
    }
    return { open: false, label: s.closed, detail: '' };
  }

  /* ---------- Features ---------- */
  function initStatusChip() {
    var chip = document.querySelector('.tmr-page .tmr-status-chip');
    if (!chip) { return; }
    var status = computeStatus();
    chip.textContent = status.detail ? (status.label + ' · ' + status.detail) : status.label;
    chip.classList.toggle('tmr-status-chip--closed', !status.open);
    chip.setAttribute('aria-label', status.open
      ? (state.lang === 'es' ? 'La troca está abierta ahora' : 'The truck is open now')
      : (state.lang === 'es' ? 'La troca está cerrada' : 'The truck is currently closed'));
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
    initTodayHighlight();
    var nav = initNavToggle();
    initSmoothScroll(nav);
    initYear();
    initLangToggle();
    applyLang(getInitialLang()); /* also runs initStatusChip() */
  });
})();
