/**
 * Docs ExpandDropdown — vanilla JS overlay panel (matches FileBrowser ExpandDropdown.vue)
 */
(function () {
  const EXPAND_OPEN_MS = 300;
  const EXPAND_CLOSE_MS = 150;

  function expandBeforeEnter(el) {
    el.style.height = '0';
    el.style.opacity = '0';
  }

  function expandEnter(el, done, durationMs) {
    el.style.transition = '';
    el.style.height = '0';
    el.style.opacity = '0';
    void el.offsetHeight;
    el.style.height = 'auto';
    el.style.visibility = 'hidden';
    void el.offsetHeight;
    const fullHeight = el.scrollHeight;
    el.style.height = '0';
    el.style.visibility = 'visible';
    el.style.transition = 'height ' + durationMs + 'ms cubic-bezier(0.4, 0, 0.2, 1), opacity ' + durationMs + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
    void el.offsetHeight;
    el.style.height = fullHeight + 'px';
    el.style.opacity = '1';
    window.setTimeout(done, durationMs);
  }

  function expandLeave(el, done, durationMs) {
    el.style.transition = 'height ' + durationMs + 'ms cubic-bezier(0.4, 0, 0.2, 1), opacity ' + durationMs + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
    el.style.height = el.scrollHeight + 'px';
    void el.offsetHeight;
    el.style.height = '0';
    el.style.opacity = '0';
    window.setTimeout(done, durationMs);
  }

  function getAnchor(dropdown) {
    return dropdown.querySelector('.expand-dropdown-anchor');
  }

  function getBody(dropdown) {
    return dropdown.querySelector('.expand-dropdown-body');
  }

  function resolveDropdownPlacement(anchorRect, optionCount) {
    const viewportHeight = window.innerHeight;
    const padding = 15;
    const cap = viewportHeight * 0.5;
    const spaceBelow = viewportHeight - anchorRect.bottom;
    const spaceAbove = anchorRect.top;
    const estimatedHeight = Math.min(Math.max(100, optionCount * 40 + 16), cap);
    const minPreferredSpace = estimatedHeight + padding;
    let expandUpward = false;
    if (spaceBelow >= minPreferredSpace) {
      expandUpward = false;
    } else if (spaceAbove >= minPreferredSpace) {
      expandUpward = true;
    } else {
      expandUpward = spaceAbove > spaceBelow;
    }
    return { expandUpward: expandUpward };
  }

  function applyOverlayGeometry(dropdown, anchorRect) {
    const overlay = dropdown._fbOverlay;
    const body = dropdown._fbBody;
    const anchor = getAnchor(dropdown);
    if (!overlay || !anchor || !body) {
      return;
    }

    const optionCount = body.querySelectorAll('.menu-option').length;
    const placement = resolveDropdownPlacement(anchorRect, optionCount);
    const expandUpward = placement.expandUpward;

    dropdown._fbExpandUpward = expandUpward;
    dropdown._fbAnchorRect = anchorRect;
    anchor.classList.toggle('expand-upward', expandUpward);
    body.classList.toggle('expand-upward', expandUpward);
    overlay.classList.toggle('expand-upward', expandUpward);

    const width = anchorRect.width;
    overlay.style.position = 'fixed';
    overlay.style.left = anchorRect.left + 'px';
    overlay.style.width = width + 'px';
    overlay.style.minWidth = width + 'px';
    overlay.style.maxWidth = width + 'px';
    overlay.style.boxSizing = 'border-box';
    overlay.style.zIndex = '1000';

    body.style.width = '100%';
    body.style.minWidth = '0';
    body.style.maxWidth = '100%';
    body.style.boxSizing = 'border-box';

    if (expandUpward) {
      overlay.style.top = '';
      overlay.style.bottom = (window.innerHeight - anchorRect.top + 1) + 'px';
    } else {
      overlay.style.bottom = '';
      overlay.style.top = (anchorRect.bottom - 1) + 'px';
    }
  }

  function updateOverlayPosition(dropdown) {
    const anchor = getAnchor(dropdown);
    if (!anchor) {
      return;
    }
    applyOverlayGeometry(dropdown, anchor.getBoundingClientRect());
  }

  function finishClose(dropdown) {
    const overlay = dropdown._fbOverlay;
    const body = dropdown._fbBody;
    const anchor = getAnchor(dropdown);

    dropdown.classList.remove('expand-dropdown--open');
    if (anchor) {
      anchor.classList.remove('expand-upward');
    }

    if (body && overlay) {
      body.style.height = '';
      body.style.opacity = '';
      body.style.transition = '';
      body.style.visibility = '';
      body.style.width = '';
      body.style.minWidth = '';
      body.style.maxWidth = '';
      body.style.boxSizing = '';
      body.setAttribute('hidden', '');
      dropdown.appendChild(body);
    }

    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }

    dropdown._fbOverlay = null;
    dropdown._fbBody = null;
    dropdown._fbClosing = false;

    const trigger = dropdown.querySelector('.expand-dropdown-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  function closeDropdown(dropdown) {
    if (!dropdown.classList.contains('expand-dropdown--open') || dropdown._fbClosing) {
      return;
    }

    const body = dropdown._fbBody;
    if (!body) {
      finishClose(dropdown);
      return;
    }

    dropdown._fbClosing = true;
    expandLeave(body, function () {
      finishClose(dropdown);
    }, EXPAND_CLOSE_MS);
  }

  function closeAllInMock(except) {
    document.querySelectorAll('.prompt-mock [data-fb-dropdown].expand-dropdown--open').forEach(function (el) {
      if (el !== except) {
        closeDropdown(el);
      }
    });
  }

  function openDropdown(dropdown) {
    closeAllInMock(dropdown);

    const anchor = getAnchor(dropdown);
    const body = getBody(dropdown);
    const trigger = dropdown.querySelector('.expand-dropdown-trigger');
    if (!anchor || !body || !trigger) {
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();

    const overlay = document.createElement('div');
    overlay.className = 'expand-dropdown expand-dropdown--open expand-dropdown-overlay';
    overlay.dataset.fbDropdownOverlay = dropdown.dataset.fbDropdownId || '';

    dropdown._fbOverlay = overlay;
    dropdown._fbBody = body;
    dropdown.classList.add('expand-dropdown--open');
    trigger.setAttribute('aria-expanded', 'true');

    body.removeAttribute('hidden');
    expandBeforeEnter(body);
    overlay.appendChild(body);
    document.body.appendChild(overlay);

    applyOverlayGeometry(dropdown, anchorRect);

    requestAnimationFrame(function () {
      expandEnter(body, function () {
        // Re-sync only if the page moved during animation (scroll/resize).
        const cached = dropdown._fbAnchorRect;
        const current = anchor.getBoundingClientRect();
        if (
          cached &&
          (Math.abs(cached.left - current.left) > 0.5 ||
            Math.abs(cached.top - current.top) > 0.5 ||
            Math.abs(cached.width - current.width) > 0.5)
        ) {
          applyOverlayGeometry(dropdown, current);
        }
      }, EXPAND_OPEN_MS);
    });
  }

  function toggleDropdown(dropdown) {
    if (dropdown.classList.contains('expand-dropdown--open')) {
      closeDropdown(dropdown);
    } else {
      openDropdown(dropdown);
    }
  }

  function onViewportChange() {
    document.querySelectorAll('.prompt-mock [data-fb-dropdown].expand-dropdown--open').forEach(function (dropdown) {
      updateOverlayPosition(dropdown);
    });
  }

  function initExpandDropdowns() {
    document.querySelectorAll('.prompt-mock [data-fb-dropdown]').forEach(function (dropdown, index) {
      if (dropdown.dataset.fbDropdownInit === 'true') {
        return;
      }
      dropdown.dataset.fbDropdownInit = 'true';
      dropdown.dataset.fbDropdownId = String(index);

      const trigger = dropdown.querySelector('.expand-dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          toggleDropdown(dropdown);
        });
      }

      dropdown.querySelectorAll('.menu-option').forEach(function (option) {
        option.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const value = option.getAttribute('data-value') || option.textContent.trim();
          const label = dropdown.querySelector('.expand-dropdown-trigger-label');
          if (label) {
            label.textContent = value;
          }
          dropdown.querySelectorAll('.menu-option').forEach(function (opt) {
            opt.classList.toggle('menu-option--selected', opt === option);
          });
          closeDropdown(dropdown);
        });
      });
    });

    document.addEventListener('mousedown', function (e) {
      document.querySelectorAll('.prompt-mock [data-fb-dropdown].expand-dropdown--open').forEach(function (dropdown) {
        const overlay = dropdown._fbOverlay;
        const anchor = getAnchor(dropdown);
        if (overlay && overlay.contains(e.target)) {
          return;
        }
        if (anchor && anchor.contains(e.target)) {
          return;
        }
        closeDropdown(dropdown);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllInMock(null);
      }
    });

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExpandDropdowns);
  } else {
    initExpandDropdowns();
  }
})();
