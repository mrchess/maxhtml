// MaxHTML behavior layer — <dialog>.
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
