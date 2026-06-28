// MaxHTML behavior layer — dragging <mh-note> on <mh-canvas>.
// ---------------------------------------------------------------------------
// Position is DATA carried on the custom properties --x/--y (see the ESCAPE
// HATCH note in maxhtml.css). Because of that, this handler only ever writes two
// numbers — it never builds a style string and never touches a class. Drag a
// note and its --x/--y update; everything visual stays in the stylesheet.
//
// Honest limitation: connectors are static SVG geometry, so lines do NOT follow
// a note as you drag it — re-routing them would need per-note wiring (data-*,
// banned) plus geometry recompute, i.e. fully off the rail. That gap is the
// point: free-form canvases live outside what MaxHTML's vocabulary can express.
// ---------------------------------------------------------------------------
(function () {
  var drag = null;

  document.addEventListener('pointerdown', function (e) {
    var note = e.target.closest('mh-note');
    if (!note || !note.closest('mh-canvas')) return;
    drag = {
      note: note,
      sx: e.clientX,
      sy: e.clientY,
      ox: parseFloat(note.style.getPropertyValue('--x')) || 0,
      oy: parseFloat(note.style.getPropertyValue('--y')) || 0
    };
    note.setPointerCapture(e.pointerId);
  });

  document.addEventListener('pointermove', function (e) {
    if (!drag) return;
    drag.note.style.setProperty('--x', (drag.ox + e.clientX - drag.sx) + 'px');
    drag.note.style.setProperty('--y', (drag.oy + e.clientY - drag.sy) + 'px');
  });

  document.addEventListener('pointerup', function () { drag = null; });
})();
