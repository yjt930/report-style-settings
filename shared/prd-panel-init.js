(function initPrdPanel() {
  if (window.__prdPanelInited) return;
  var panel = document.getElementById('prdPanel');
  var header = document.getElementById('prdPanelHeader');
  var openBtn = document.getElementById('prdOpenBtn');
  var closeBtn = document.getElementById('prdCloseBtn');
  var resizeHandle = document.getElementById('prdResizeHandle');
  if (!panel || !header || !openBtn || !closeBtn) return;
  window.__prdPanelInited = true;

  var DRAG_THRESHOLD = 6;
  var MIN_W = 360;
  var MIN_H = 320;
  var panelDragging = false;
  var btnDragging = false;
  var resizing = false;
  var panelDragOffsetX = 0;
  var panelDragOffsetY = 0;
  var btnDragOffsetX = 0;
  var btnDragOffsetY = 0;
  var btnPointerStartX = 0;
  var btnPointerStartY = 0;
  var btnDidDrag = false;
  var resizeStartX = 0;
  var resizeStartY = 0;
  var resizeStartW = 0;
  var resizeStartH = 0;

  function clampPosition(el, left, top) {
    var maxX = window.innerWidth - el.offsetWidth;
    var maxY = window.innerHeight - el.offsetHeight;
    el.style.left = Math.min(Math.max(0, left), Math.max(0, maxX)) + 'px';
    el.style.top = Math.min(Math.max(0, top), Math.max(0, maxY)) + 'px';
  }

  function positionTriggerDefault() {
    var margin = 24;
    openBtn.style.left = Math.max(margin, window.innerWidth - openBtn.offsetWidth - margin) + 'px';
    openBtn.style.top = (margin + 72) + 'px';
  }

  function positionPanelNearTrigger() {
    var margin = 16;
    var btnRect = openBtn.getBoundingClientRect();
    var left = btnRect.left;
    var top = btnRect.bottom + margin;

    if (left + panel.offsetWidth > window.innerWidth - margin) {
      left = window.innerWidth - panel.offsetWidth - margin;
    }
    if (top + panel.offsetHeight > window.innerHeight - margin) {
      top = btnRect.top - panel.offsetHeight - margin;
    }

    clampPosition(panel, left, top);
  }

  function openPanel() {
    if (!panel.classList.contains('open')) {
      positionPanelNearTrigger();
    }
    panel.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    if (typeof window.renderPrdPanel === 'function') window.renderPrdPanel();
  }

  function closePanel() {
    panel.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
  }

  function onPanelPointerDown(e) {
    if (e.target.closest('.prd-panel-actions')) return;
    panelDragging = true;
    var rect = panel.getBoundingClientRect();
    panelDragOffsetX = e.clientX - rect.left;
    panelDragOffsetY = e.clientY - rect.top;
    header.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onPanelPointerMove(e) {
    if (!panelDragging) return;
    clampPosition(panel, e.clientX - panelDragOffsetX, e.clientY - panelDragOffsetY);
  }

  function onPanelPointerUp(e) {
    if (!panelDragging) return;
    panelDragging = false;
    header.releasePointerCapture(e.pointerId);
  }

  function onResizePointerDown(e) {
    resizing = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartW = panel.offsetWidth;
    resizeStartH = panel.offsetHeight;
    resizeHandle.setPointerCapture(e.pointerId);
    e.preventDefault();
    e.stopPropagation();
  }

  function onResizePointerMove(e) {
    if (!resizing) return;
    var dw = e.clientX - resizeStartX;
    var dh = e.clientY - resizeStartY;
    var newW = Math.min(window.innerWidth - 16, Math.max(MIN_W, resizeStartW + dw));
    var newH = Math.min(window.innerHeight - 16, Math.max(MIN_H, resizeStartH + dh));
    panel.style.width = newW + 'px';
    panel.style.height = newH + 'px';
    var rect = panel.getBoundingClientRect();
    clampPosition(panel, rect.left, rect.top);
  }

  function onResizePointerUp(e) {
    if (!resizing) return;
    resizing = false;
    resizeHandle.releasePointerCapture(e.pointerId);
  }

  function onBtnPointerDown(e) {
    if (e.button !== 0) return;
    btnDragging = true;
    btnDidDrag = false;
    btnPointerStartX = e.clientX;
    btnPointerStartY = e.clientY;
    var rect = openBtn.getBoundingClientRect();
    btnDragOffsetX = e.clientX - rect.left;
    btnDragOffsetY = e.clientY - rect.top;
    openBtn.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onBtnPointerMove(e) {
    if (!btnDragging) return;
    var moved = Math.hypot(e.clientX - btnPointerStartX, e.clientY - btnPointerStartY);
    if (moved >= DRAG_THRESHOLD) {
      btnDidDrag = true;
      openBtn.classList.add('dragging');
      clampPosition(openBtn, e.clientX - btnDragOffsetX, e.clientY - btnDragOffsetY);
    }
  }

  function onBtnPointerUp(e) {
    if (!btnDragging) return;
    btnDragging = false;
    openBtn.classList.remove('dragging');
    openBtn.releasePointerCapture(e.pointerId);
    if (!btnDidDrag) {
      if (panel.classList.contains('open')) closePanel();
      else openPanel();
    }
  }

  closeBtn.addEventListener('click', closePanel);

  var reloadBtn = document.getElementById('prdReloadBtn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', function () {
      if (typeof window.reloadPrdBundle === 'function') window.reloadPrdBundle();
    });
  }

  header.addEventListener('pointerdown', onPanelPointerDown);
  header.addEventListener('pointermove', onPanelPointerMove);
  header.addEventListener('pointerup', onPanelPointerUp);
  header.addEventListener('pointercancel', onPanelPointerUp);

  if (resizeHandle) {
    resizeHandle.addEventListener('pointerdown', onResizePointerDown);
    resizeHandle.addEventListener('pointermove', onResizePointerMove);
    resizeHandle.addEventListener('pointerup', onResizePointerUp);
    resizeHandle.addEventListener('pointercancel', onResizePointerUp);
  }

  openBtn.addEventListener('pointerdown', onBtnPointerDown);
  openBtn.addEventListener('pointermove', onBtnPointerMove);
  openBtn.addEventListener('pointerup', onBtnPointerUp);
  openBtn.addEventListener('pointercancel', onBtnPointerUp);

  positionTriggerDefault();
  window.addEventListener('resize', function () {
    var btnRect = openBtn.getBoundingClientRect();
    clampPosition(openBtn, btnRect.left, btnRect.top);
    if (!panel.classList.contains('open')) return;
    panel.style.width = Math.min(panel.offsetWidth, window.innerWidth - 16) + 'px';
    panel.style.height = Math.min(panel.offsetHeight, window.innerHeight - 16) + 'px';
    var panelRect = panel.getBoundingClientRect();
    clampPosition(panel, panelRect.left, panelRect.top);
  });
})();
