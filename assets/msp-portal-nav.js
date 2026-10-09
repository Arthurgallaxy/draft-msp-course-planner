/* MSP cross-app menu for the current standalone Course Planner sidebar.
 * The planner's code and existing sidebar tabs are deliberately untouched.
 * Sibling paths work both on localhost and draft GitHub Pages.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var plannerRoot = script ? new URL('../', script.src) : new URL('./', location.href);
  var base = new URL('../', plannerRoot);
  function sibling(name, file) { return new URL(name + '/' + (file || ''), base).href; }
  var homepage = sibling('draft-msp-homepage');
  var portalLinks = [
    { name: 'Student FAQ', repo: 'draft-msp-faq', icon: 'help' },
    { name: 'Course Planner', repo: 'draft-msp-course-planner', icon: 'calendar', current: true },
    { name: 'BTR Dashboard', repo: 'draft-msp-btr-dashboard', icon: 'book' },
    { name: 'Project Periods', repo: 'draft-msp-project-periods', icon: 'target' },
    { name: 'MSP Alumni', repo: 'draft-msp-alumni', icon: 'globe' }
  ];

  // Same SVG shapes used by the original MSP preview's msp-shell.js.
  var P = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var icons = {
    help: P + '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    calendar: P + '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    book: P + '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    target: P + '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    globe: P + '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    hub: P + '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="21" r="1.5"/><circle cx="3" cy="12" r="1.5"/><circle cx="21" cy="12" r="1.5"/><line x1="12" y1="9" x2="12" y2="4.5"/><line x1="12" y1="15" x2="12" y2="19.5"/><line x1="9" y1="12" x2="4.5" y2="12"/><line x1="15" y1="12" x2="19.5" y2="12"/></svg>'
  };

  function makeLogoLink(img) {
    if (!img || img.closest('a')) return;
    var a = document.createElement('a');
    a.href = homepage;
    a.className = 'msp-portal-logo-link';
    a.title = 'Back to MSP student homepage';
    a.setAttribute('aria-label', 'Back to MSP student homepage');
    img.parentNode.insertBefore(a, img);
    a.appendChild(img);
  }

  function init() {
    var brand = document.querySelector('#sidebar .sb-brand');
    var nav = document.querySelector('#sidebar .sb-nav');
    if (!brand || !nav || brand.querySelector('#msp-portal-switch')) return;
    makeLogoLink(document.getElementById('logoHeader'));
    makeLogoLink(document.getElementById('logoMain'));

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'msp-portal-switch';
    button.id = 'msp-portal-switch';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'msp-portal-menu');
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-label', 'Course Planner. Switch MSP application');
    button.innerHTML = '<span class="msp-portal-eyebrow">MSP Online · Students</span>' +
      '<span class="msp-portal-current">Course Planner</span>' +
      '<span class="msp-portal-chevron" aria-hidden="true">⌄</span>';

    var menu = document.createElement('div');
    menu.className = 'msp-portal-menu'; menu.id = 'msp-portal-menu'; menu.hidden = true;
    portalLinks.forEach(function (app) {
      var link = document.createElement('a');
      link.href = app.current ? location.href : sibling(app.repo);
      link.innerHTML = '<span class="msp-portal-item-ico">' + icons[app.icon] + '</span>' +
        '<span class="msp-portal-item-name"></span>' +
        (app.current ? '<span class="msp-portal-here">here</span>' : '');
      link.querySelector('.msp-portal-item-name').textContent = app.name;
      if (app.current) link.setAttribute('aria-current', 'page');
      menu.appendChild(link);
    });
    var all = document.createElement('a');
    all.href = homepage; all.className = 'msp-portal-all';
    all.innerHTML = '<span class="msp-portal-item-ico">' + icons.hub + '</span><span>All student tools</span>';
    menu.appendChild(all);
    var oldTitle = brand.querySelector('.sb-title');
    if (oldTitle) { oldTitle.before(button); button.after(menu); }
    else { brand.appendChild(button); brand.appendChild(menu); }
    brand.classList.add('msp-portal-ready');

    function toggle(on) { menu.hidden = !on; button.setAttribute('aria-expanded', String(on)); }
    button.addEventListener('click', function () { toggle(menu.hidden); });
    document.addEventListener('click', function (event) {
      if (!brand.contains(event.target) && !menu.hidden) toggle(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !menu.hidden) { toggle(false); button.focus(); }
    });
    try { sessionStorage.setItem('msp-suite', 'students'); } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
