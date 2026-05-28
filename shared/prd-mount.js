(function () {
  function mount() {
    if (document.getElementById('prdOpenBtn')) return;

    if (document.getElementById('prdFloatingRoot')) {
      document.getElementById('prdFloatingRoot').remove();
    }

    var root = document.createElement('div');
    root.id = 'prdFloatingRoot';
    root.innerHTML =
      '<link rel="stylesheet" href="./shared/prd-panel.css">' +
      '<button type="button" class="prd-trigger-btn" id="prdOpenBtn" aria-controls="prdPanel" aria-expanded="false">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>' +
      '<path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>查看 PRD</button>' +
      '<div class="prd-panel" id="prdPanel" role="dialog" aria-labelledby="prdPanelTitle" aria-modal="false">' +
      '<div class="prd-panel-header" id="prdPanelHeader">' +
      '<div class="prd-panel-title" id="prdPanelTitle">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>' +
      '<span id="prdPanelTitleText">产品需求文档 · 报告风格设置</span></div>' +
      '<div class="prd-panel-actions">' +
    '<button type="button" class="prd-panel-reload" id="prdReloadBtn" aria-label="重新加载 PRD" title="重新加载 PRD">↻</button>' +
    '<button type="button" class="prd-panel-close" id="prdCloseBtn" aria-label="关闭">×</button></div></div>' +
      '<div class="prd-sync-meta" id="prdSyncMeta"></div>' +
      '<div class="prd-panel-body" id="prdPanelBody"></div>' +
      '<div class="prd-panel-resize-handle" id="prdResizeHandle" aria-label="缩放面板" title="拖动缩放"></div></div>';

    document.documentElement.appendChild(root);

    if (!window.__prdScriptsLoaded) {
      window.__prdScriptsLoaded = true;
      loadScript('./shared/prd-bundle.js', function () {
        loadScript('./shared/prd-loader.js', function () {
          loadScript('./shared/prd-panel-init.js');
        });
      });
    } else if (typeof window.renderPrdPanel === 'function') {
      loadScript('./shared/prd-panel-init.js');
    }
  }

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src + (src.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now();
    s.onload = onload || function () {};
    document.documentElement.appendChild(s);
  }

  mount();
  document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('load', mount);

  var observer = new MutationObserver(function () {
    if (!document.getElementById('prdOpenBtn')) mount();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
