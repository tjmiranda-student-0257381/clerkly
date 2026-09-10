/* =========================================================================
   Clerkly - clerkly.us
   Site behaviour: navigation, accordions, video facades, forms, motion.
   Vanilla JS, no dependencies. Loaded with `defer`.
   ========================================================================= */
(function () {
  'use strict';

  /* ----------------------------------------------------------- Site config */
  var CONFIG = {
    /* Where the contact form posts. Works out of the box with Formspree or
       Netlify Forms. Replace with your own endpoint, e.g.
       'https://formspree.io/f/xxxxxxxx'. Leave empty ('') to fall back to
       opening the visitor's email client with the message pre-filled. */
    formEndpoint: '',
    /* Fallback inbox used when formEndpoint is empty. */
    email: 'hello@clerkly.us'
  };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ------------------------------------------------------- Sticky header */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------------------------------------------- Mobile drawer */
  function initNav() {
    var toggle = $('.nav__toggle');
    var menu   = $('#primary-menu');
    if (!toggle || !menu) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    var header = $('.site-header');
    var mqMobile = window.matchMedia('(max-width: 900px)');

    /* Belt and braces with the CSS visibility rule: a closed off-canvas drawer
       must not be reachable by keyboard or exposed to screen readers. inert is
       set synchronously so correctness never depends on transition timing. */
    function syncInert() {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (mqMobile.matches && !open) menu.setAttribute('inert', '');
      else menu.removeAttribute('inert');
    }

    function setOpen(open) {
      /* The drawer's top padding has to clear whatever the header currently
         measures - the top bar scrolls away, and its notice can wrap to two
         lines on narrow phones, so this is not a constant. */
      if (open && header) {
        var bottom = Math.round(header.getBoundingClientRect().bottom);
        document.documentElement.style.setProperty('--header-h', bottom + 'px');
      }

      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);

      /* Hand focus back to the trigger before the drawer goes inert, so it is
         never stranded inside a hidden subtree - e.g. when closing by tapping
         the backdrop rather than the toggle. */
      if (!open && menu.contains(document.activeElement)) toggle.focus();
      syncInert();

      if (open) {
        var first = menu.querySelector('a, button');
        if (first) first.focus();
      }
    }

    syncInert();

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    backdrop.addEventListener('click', function () { setOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Close the drawer when a link is tapped or the viewport grows. */
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    var onBreakpoint = function () {
      if (!mqMobile.matches) setOpen(false);
      else syncInert();
    };
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpoint);
    else if (mqMobile.addListener) mqMobile.addListener(onBreakpoint);
  }

  /* ----------------------------------------------- Highlight current page */
  function initActiveLink() {
    var path = window.location.pathname.split('/').pop() || 'index.html';

    $$('.nav__link').forEach(function (link) {
      var href = (link.getAttribute('href') || '').split('/').pop().split('#')[0];
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ------------------------------------------------------------ Accordion */
  function initAccordions() {
    $$('.acc-trigger').forEach(function (trigger) {
      var item  = trigger.closest('.acc-item');
      var panel = item && item.querySelector('.acc-panel');
      if (!panel) return;

      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') === 'true';
        var group = item.closest('[data-accordion="single"]');

        /* In single mode, collapse siblings first. */
        if (group && !open) {
          $$('.acc-item.is-open', group).forEach(function (sibling) {
            if (sibling === item) return;
            sibling.classList.remove('is-open');
            var t = sibling.querySelector('.acc-trigger');
            var p = sibling.querySelector('.acc-panel');
            if (t) t.setAttribute('aria-expanded', 'false');
            if (p) p.setAttribute('aria-hidden', 'true');
          });
        }

        trigger.setAttribute('aria-expanded', String(!open));
        panel.setAttribute('aria-hidden', String(open));
        item.classList.toggle('is-open', !open);
      });
    });

    /* Deep link: /faqs.html#some-question opens that item. */
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      var host = target && target.closest ? target.closest('.acc-item') : null;
      if (host) {
        var t = host.querySelector('.acc-trigger');
        if (t && t.getAttribute('aria-expanded') !== 'true') t.click();
      }
    }
  }

  /* ------------------------------------------- Click-to-load video embeds */
  /* Nothing loads from YouTube until the visitor asks for it: faster first
     paint and no third-party cookies dropped on arrival. */
  function initVideos() {
    $$('.video-embed').forEach(function (btn) {
      var id = btn.getAttribute('data-video-id');

      /* No id yet: the slot is reserved but nothing is published there. */
      if (!id) {
        btn.classList.add('is-placeholder');
        btn.setAttribute('aria-disabled', 'true');
        var label = btn.querySelector('.video-embed__label');
        if (label) label.textContent = 'Coming soon';
        return;
      }

      /* Use the YouTube poster so nothing loads from YouTube until asked. */
      if (!btn.querySelector('img')) {
        var img = document.createElement('img');
        img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
        img.alt = '';
        img.loading = 'lazy';
        img.addEventListener('error', function () { img.remove(); });
        btn.insertBefore(img, btn.firstChild);
      }

      btn.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id +
                    '?autoplay=1&rel=0&modestbranding=1';
        frame.title = btn.getAttribute('data-video-title') || 'Video player';
        frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                      'gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;
        btn.innerHTML = '';
        btn.appendChild(frame);
        btn.classList.add('is-playing');
      });
    });
  }

  /* --------------------------------------------------- Video category tabs */
  function initVideoFilter() {
    var buttons = $$('.filter-btn');
    var cards   = $$('[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        buttons.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });

        var shown = 0;
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        var empty = $('#video-empty');
        if (empty) empty.classList.toggle('is-hidden', shown > 0);
      });
    });
  }

  /* ------------------------------------------------------- Contact form */
  function initForm() {
    var form = $('#contact-form');
    if (!form) return;

    var status = $('#form-status');
    var submit = form.querySelector('[type="submit"]');
    var submitLabel = submit ? submit.textContent : '';

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status is-visible is-' + kind;
    }

    function fieldError(input, message) {
      var field = input.closest('.field') || input.closest('.checkbox');
      if (!field) return;
      field.classList.add('has-error');
      var msg = field.querySelector('.error-msg');
      if (msg && message) msg.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var field = input.closest('.field') || input.closest('.checkbox');
      if (field) field.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    form.addEventListener('input', function (e) {
      if (e.target.matches('input, select, textarea')) clearError(e.target);
    });

    function validate() {
      var firstBad = null;

      form.querySelectorAll('[required]').forEach(function (input) {
        var ok = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';

        if (ok && input.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
        }
        if (ok && input.name === 'message') {
          ok = input.value.trim().length >= 20;
        }

        if (!ok) {
          fieldError(input);
          if (!firstBad) firstBad = input;
        } else {
          clearError(input);
        }
      });

      if (firstBad) {
        firstBad.focus();
        setStatus('Please check the highlighted fields and try again.', 'error');
      }
      return !firstBad;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot: silently accept and drop obvious bot submissions. */
      var trap = form.querySelector('[name="company_website"]');
      if (trap && trap.value) {
        setStatus('Thanks - your message has been sent.', 'success');
        form.reset();
        return;
      }

      if (!validate()) return;

      var data = new FormData(form);

      /* No endpoint configured: hand off to the visitor's mail client. */
      if (!CONFIG.formEndpoint) {
        var body = [];
        data.forEach(function (value, key) {
          if (key === 'company_website' || !String(value).trim()) return;
          body.push(key.replace(/_/g, ' ').replace(/\b\w/g, function (c) {
            return c.toUpperCase();
          }) + ': ' + value);
        });
        var subject = 'New project enquiry from ' + (data.get('name') || 'clerkly.us');
        window.location.href = 'mailto:' + CONFIG.email +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body.join('\n\n'));
        setStatus('Opening your email app with the message ready to send. ' +
                  'If nothing happens, email ' + CONFIG.email + ' directly.', 'success');
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending...';
      }
      setStatus('Sending your message...', 'success');

      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          setStatus('Thanks for reaching out. Your message is in - expect a reply ' +
                    'within one business day.', 'success');
        })
        .catch(function () {
          setStatus('Something went wrong sending the form. Please email ' +
                    CONFIG.email + ' instead.', 'error');
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = submitLabel;
          }
        });
    });
  }

  /* ---------------------------------------------------- Reveal on scroll */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* --------------------------------------------------------- Back to top */
  function initToTop() {
    var btn = $('.to-top');
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------- Current year */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* --------------------------------- Prefill contact form from a deep link */
  /* Services and pricing cards link through as, e.g.
     contact.html?service=web-development  or  contact.html?plan=growth */
  function initPrefill() {
    if (!$('#contact-form') || !('URLSearchParams' in window)) return;

    var params = new URLSearchParams(window.location.search);

    function selectIfPresent(id, value) {
      var select = document.getElementById(id);
      if (!select || !value) return false;
      var found = Array.prototype.some.call(select.options, function (opt) {
        return opt.value === value;
      });
      if (found) select.value = value;
      return found;
    }

    selectIfPresent('service', params.get('service'));

    /* Pricing plans map onto the engagement dropdown. */
    var plan = params.get('plan');
    var planMap = {
      starter: 'retainer-starter',
      growth: 'retainer-growth',
      scale: 'retainer-scale',
      project: 'project',
      hourly: 'hourly'
    };
    if (plan && planMap[plan]) {
      selectIfPresent('engagement', planMap[plan]);

      var message = $('#message');
      if (message && !message.value) {
        message.placeholder = 'I am interested in the ' +
          plan.charAt(0).toUpperCase() + plan.slice(1) +
          ' option. Here is what I need help with...';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initNav();
    initActiveLink();
    initAccordions();
    initVideos();
    initVideoFilter();
    initForm();
    initReveal();
    initToTop();
    initYear();
    initPrefill();
  });
})();
