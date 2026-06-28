// MaxHTML behavior layer — <mh-toasts>.
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
// maxhtml.css — this is a progressive-enhancement graduation, exactly like
// mh-menu / mh-dialog.
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
