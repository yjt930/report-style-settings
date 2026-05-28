(function () {
  let activeModuleId = null;

  function inlineMarkdown(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function markdownToHtml(markdown, anchor) {
    var lines = markdown.split('\n');
    var html = '';
    var listLevel = -1;
    var inTable = false;
    var tableRows = [];

    function closeAllLists() {
      while (listLevel >= 0) {
        html += '</ul>';
        listLevel -= 1;
      }
    }

    function flushTable() {
      if (!inTable || !tableRows.length) {
        inTable = false;
        tableRows = [];
        return;
      }
      html += '<table>';
      tableRows.forEach(function (row, idx) {
        var cellTag = idx === 0 ? 'th' : 'td';
        if (idx === 0) html += '<thead><tr>';
        else if (idx === 1) html += '</tr></thead><tbody><tr>';
        else html += '<tr>';
        row.forEach(function (cell) {
          html += '<' + cellTag + '>' + inlineMarkdown(cell.trim()) + '</' + cellTag + '>';
        });
        html += '</tr>';
      });
      html += '</tbody></table>';
      inTable = false;
      tableRows = [];
    }

    function openListLevel(level) {
      while (listLevel < level) {
        html += '<ul>';
        listLevel += 1;
      }
      while (listLevel > level) {
        html += '</ul>';
        listLevel -= 1;
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();

      if (/^\|.+\|$/.test(trimmed) && !/^\|[\s\-:|]+\|$/.test(trimmed)) {
        closeAllLists();
        inTable = true;
        tableRows.push(trimmed.slice(1, -1).split('|'));
        continue;
      }

      if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue;

      if (inTable && !/^\|/.test(trimmed)) flushTable();

      if (trimmed === '') {
        continue;
      }

      var headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        closeAllLists();
        flushTable();
        var level = headingMatch[1].length;
        var tag = 'h' + level;
        var idAttr = level === 2 && anchor ? ' id="' + anchor + '"' : '';
        html += '<' + tag + idAttr + '>' + inlineMarkdown(headingMatch[2]) + '</' + tag + '>';
        continue;
      }

      if (trimmed.startsWith('>')) {
        closeAllLists();
        flushTable();
        var quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i += 1;
        }
        i -= 1;
        html += '<blockquote><p>' + quoteLines.map(function (q) { return inlineMarkdown(q); }).join('<br>') + '</p></blockquote>';
        continue;
      }

      var listMatch = line.match(/^(\s*)-\s+(.+)$/);
      if (listMatch) {
        flushTable();
        var indentLevel = Math.floor(listMatch[1].length / 2);
        openListLevel(indentLevel);
        html += '<li>' + inlineMarkdown(listMatch[2]) + '</li>';
        continue;
      }

      if (trimmed.startsWith('```')) {
        closeAllLists();
        flushTable();
        var codeLines = [];
        i += 1;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i += 1;
        }
        html += '<pre><code>' + inlineMarkdown(codeLines.join('\n')) + '</code></pre>';
        continue;
      }

      closeAllLists();
      flushTable();
      html += '<p>' + inlineMarkdown(trimmed) + '</p>';
    }

    closeAllLists();
    flushTable();
    return html;
  }

  function getModuleById(modules, id) {
    return modules.find(function (m) { return m.id === id; }) || modules[0];
  }

  function renderModuleContent(module) {
    var contentEl = document.getElementById('prdContent');
    if (!contentEl || !module) return;
    contentEl.innerHTML = markdownToHtml(module.markdown, module.anchor);
    contentEl.scrollTop = 0;
  }

  function setActiveModule(id) {
    var bundle = window.PRD_BUNDLE;
    if (!bundle || !bundle.modules || !bundle.modules.length) return;

    var module = getModuleById(bundle.modules, id);
    if (!module) return;

    activeModuleId = module.id;

    document.querySelectorAll('.prd-nav-item').forEach(function (btn) {
      var isActive = btn.dataset.moduleId === module.id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    renderModuleContent(module);
  }

  function bindNavEvents() {
    document.querySelectorAll('.prd-nav-item').forEach(function (btn) {
      btn.onclick = function () { setActiveModule(btn.dataset.moduleId); };
    });
  }

  function renderPrdPanel() {
    var body = document.getElementById('prdPanelBody');
    if (!body) return;

    var bundle = window.PRD_BUNDLE;
    if (!bundle || !Array.isArray(bundle.modules) || !bundle.modules.length) {
      body.innerHTML = '<p style="padding:20px">未加载 PRD 内容。</p>';
      return;
    }

    var navItems = bundle.modules.map(function (m) {
      return '<button type="button" class="prd-nav-item" data-module-id="' + m.id + '">' + m.title + '</button>';
    }).join('');

    body.innerHTML =
      '<nav class="prd-nav" aria-label="PRD 目录">' + navItems + '</nav>' +
      '<div class="prd-content" id="prdContent"></div>';

    bindNavEvents();

    var nextId = bundle.modules.some(function (m) { return m.id === activeModuleId; })
      ? activeModuleId
      : bundle.modules[0].id;
    setActiveModule(nextId);

    var titleEl = document.getElementById('prdPanelTitleText');
    if (titleEl && bundle.title) titleEl.textContent = bundle.title;

    var meta = document.getElementById('prdSyncMeta');
    if (meta && bundle.syncedAt) {
      meta.textContent = '更新于 ' + new Date(bundle.syncedAt).toLocaleString('zh-CN') + ' · 保存 md 后自动同步';
    }
  }

  function parseBundleFromScript(text) {
    var match = text.match(/window\.PRD_BUNDLE\s*=\s*(\{[\s\S]*\});?\s*$/);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      return null;
    }
  }

  function applyBundle(next) {
    if (!next || !Array.isArray(next.modules)) return false;
    if (next.syncedAt === window.PRD_BUNDLE?.syncedAt) return false;
    window.PRD_BUNDLE = next;
    renderPrdPanel();
    return true;
  }

  function fetchLatestBundle() {
    if (location.protocol === 'file:') {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = './shared/prd-bundle.js?t=' + Date.now();
        script.onload = function () {
          script.remove();
          if (window.PRD_BUNDLE) resolve(window.PRD_BUNDLE);
          else reject(new Error('PRD_BUNDLE missing'));
        };
        script.onerror = function () {
          script.remove();
          reject(new Error('failed to load prd-bundle.js'));
        };
        document.documentElement.appendChild(script);
      });
    }
    return fetch('./shared/prd-bundle.js?t=' + Date.now())
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(parseBundleFromScript);
  }

  function startAutoSync(intervalMs) {
    if (window.__prdAutoSyncTimer) return;
    window.__prdAutoSyncTimer = setInterval(function () {
      fetchLatestBundle()
        .then(applyBundle)
        .catch(function () {});
    }, intervalMs || 1500);
  }

  window.reloadPrdBundle = function () {
    fetchLatestBundle()
      .then(function (next) {
        if (next) {
          window.PRD_BUNDLE = next;
          renderPrdPanel();
        }
      })
      .catch(function () {});
  };

  window.renderPrdPanel = renderPrdPanel;

  if (window.PRD_BUNDLE) renderPrdPanel();
  startAutoSync(1500);
})();
