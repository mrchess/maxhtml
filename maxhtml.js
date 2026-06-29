// MaxHTML — behavior layer (the OPTIONAL JS tier).
// ===========================================================================
// Most MaxHTML components are pure-CSS undefined custom elements and need no JS
// at all. A handful need behavior CSS can't express — those graduate to this
// one file. Load it once alongside maxhtml.css:
//
//     <link rel=stylesheet href="…/maxhtml.css">
//     <script src="…/maxhtml.js"></script>
//
// Everything here is progressive enhancement and self-gating: each section
// no-ops unless its component (<mh-menu> / <dialog commandfor> / <mh-toasts>)
// is actually present, so it is always safe to include the whole file.
//
// (The free-form canvas escape hatch lives in its own mh-canvas.js — it is the
// sanctioned exception, not part of the normal kit, so it stays opt-in.)
// ===========================================================================


// ===========================================================================
// <mh-menu> — dropdown.
// ---------------------------------------------------------------------------
// A real Web Component because it needs toggle, close-on-outside-click,
// close-on-Escape, and ARIA state. Light DOM on purpose: no shadow root, so
// maxhtml.css styles the inner parts and token theming still applies.
//
// Progressive enhancement: authored as
//     <mh-menu>
//       <button>Account</button>
//       <a href="...">Profile</a>
//       <a href="...">Billing</a>
//     </mh-menu>
// With no JS that renders as a visible button + a list of links (usable).
// With JS it becomes an accessible disclosure dropdown.
// ---------------------------------------------------------------------------

class MhMenu extends HTMLElement {
  connectedCallback() {
    if ('enhanced' in this.dataset) return;            // upgrade once
    const trigger = this.querySelector(':scope > button');
    const items = [...this.querySelectorAll(':scope > a')];
    if (!trigger || !items.length) return;

    // --- structure: wrap the links in a popup (JS doing what CSS can't) ----
    const popup = document.createElement('menu');       // real list semantics
    items.forEach((a) => popup.appendChild(a));
    this.appendChild(popup);

    // --- ARIA ---------------------------------------------------------------
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      this.toggleAttribute('open', open);
      trigger.setAttribute('aria-expanded', String(open));
    };

    // --- behavior -----------------------------------------------------------
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!this.hasAttribute('open'));
    });

    // selecting an item closes the menu
    items.forEach((a) => a.addEventListener('click', () => setOpen(false)));

    // click anywhere outside closes it (CSS cannot do this)
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) setOpen(false);
    });

    // Escape closes and returns focus to the trigger (CSS cannot do this)
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) {
        setOpen(false);
        trigger.focus();
      }
    });

    this.dataset.enhanced = '';
  }
}

customElements.define('mh-menu', MhMenu);


// ===========================================================================
// <dialog> — modal.
// ---------------------------------------------------------------------------
// Opens a native <dialog> from any element carrying commandfor="dialogId", and
// closes it on any dialog button, a backdrop click, or Esc (Esc + focus trap
// come free from the native element). One global listener, no per-dialog wiring.
//
//   <button commandfor="remove">Remove friend</button>
//   <dialog id="remove">
//     <header>Remove friend?</header>
//     <p>...</p>
//     <footer>
//       <button type=button>Cancel</button>   <!-- secondary; closes -->
//       <button>Remove</button>                <!-- primary; closes (do the action too) -->
//     </footer>
//   </dialog>
// ---------------------------------------------------------------------------

document.addEventListener('click', function (e) {
  // open: anything with commandfor="<id>"
  var opener = e.target.closest('[commandfor]');
  if (opener) {
    var dlg = document.getElementById(opener.getAttribute('commandfor'));
    if (dlg && typeof dlg.showModal === 'function') {
      e.preventDefault();
      dlg.showModal();
    }
    return;
  }
  // close: any button inside a dialog
  var btn = e.target.closest('dialog button');
  if (btn) { btn.closest('dialog').close(); return; }
  // close: click on the backdrop (target is the dialog element itself)
  if (e.target.tagName === 'DIALOG') e.target.close();
});


// ===========================================================================
// <mh-toasts> — transient notification stack.
// ---------------------------------------------------------------------------
// The on-rails part needs NO JS: a <mh-toasts> container with <mh-alert>
// children renders, positions (fixed bottom-right), and stacks via CSS alone.
// This layer adds only the *lifecycle* — the bit that's genuinely behavior:
//   • auto-dismiss each toast after a timeout (skip with data-sticky)
//   • dismiss on click of the toast's button
//   • a push() API to spawn a toast on an app event:
//       mhToast('<strong>Saved.</strong> …', {tone: 'success'})
//   • declarative trigger: <button data-toast="Saved" data-tone="success">  (no inline JS)
// Positioning, stacking, severity colour (the tone axis), and appearance stay in
// maxhtml.css — a progressive-enhancement graduation, exactly like the two above.
//
//   <mh-toasts>
//     <mh-alert tone="success"><strong>Deploy finished.</strong> v2.3.1 is live.<button type=button>✕</button></mh-alert>
//   </mh-toasts>
// ---------------------------------------------------------------------------

(function () {
  var TTL = 4000;

  function dismiss(t) {
    t.style.opacity = '0';
    setTimeout(function () { t.remove(); }, 200);
  }

  function arm(t) {
    if (t.dataset.mhArmed) return;
    t.dataset.mhArmed = '1';
    t.style.transition = 'opacity .2s ease';
    if (!t.hasAttribute('data-sticky')) {
      setTimeout(function () { dismiss(t); }, TTL);
    }
  }

  function scan() {
    document.querySelectorAll('mh-toasts > mh-alert').forEach(arm);
  }

  // Spawn a toast programmatically; returns the element.
  window.mhToast = function (html, opts) {
    var box = document.querySelector('mh-toasts');
    if (!box) { box = document.createElement('mh-toasts'); document.body.appendChild(box); }
    var t = document.createElement('mh-alert');
    t.innerHTML = html;
    if (opts && opts.tone) t.setAttribute('tone', opts.tone);
    if (opts && opts.sticky) t.setAttribute('data-sticky', '');
    box.appendChild(t);
    arm(t);
    return t;
  };

  document.addEventListener('click', function (e) {
    // dismiss on a toast's own button
    var btn = e.target.closest('mh-toasts > mh-alert button');
    if (btn) { dismiss(btn.closest('mh-alert')); return; }
    // declarative trigger
    var trig = e.target.closest('[data-toast]');
    if (trig) { window.mhToast(trig.getAttribute('data-toast'), { tone: trig.getAttribute('data-tone') }); }
  });

  if (document.readyState !== 'loading') scan();
  else document.addEventListener('DOMContentLoaded', scan);
})();
