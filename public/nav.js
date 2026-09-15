/* Keyboard support for the "Clairo Services" menu in the header.
 *
 * The menu itself is CSS: .nav-drop:hover and .nav-drop:focus-within show it. That covers the mouse
 * and covers tabbing into the links, but the trigger is a span with role="button" and pressing Enter
 * or Space on it did nothing. This adds that, plus Escape to close, and keeps aria-expanded honest.
 * Hover behaviour is untouched.
 */
(function () {
  'use strict';

  function setup() {
    var drops = document.querySelectorAll('.nav-drop');
    Array.prototype.forEach.call(drops, function (drop) {
      var trigger = drop.querySelector('[role="button"]');
      if (!trigger) return;

      function setOpen(open) {
        if (open) drop.classList.add('open');
        else drop.classList.remove('open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          setOpen(!drop.classList.contains('open'));
        }
      });

      drop.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
          if (!drop.classList.contains('open')) return;
          setOpen(false);
          trigger.focus();
        }
      });

      drop.addEventListener('focusout', function (e) {
        if (!e.relatedTarget || !drop.contains(e.relatedTarget)) setOpen(false);
      });

      document.addEventListener('click', function (e) {
        if (!drop.contains(e.target)) setOpen(false);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
