// MaxHTML behavior layer — <mh-menu> dropdown.
// ---------------------------------------------------------------------------
// This is the OPTIONAL JS tier. Most MaxHTML components are pure-CSS undefined
// custom elements; <mh-menu> is the kind that needs behavior CSS can't express
// (toggle, close-on-outside-click, close-on-Escape, ARIA state), so it's a real
// Web Component.
//
// Light DOM on purpose: no shadow root, so maxhtml.css styles the inner parts
// exactly like every other component and token theming still applies.
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
