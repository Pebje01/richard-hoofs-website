/* ===== UNIVERSAL TOOLBAR ===== */
(function() {
    // Share mode: apply fonts from URL params, hide toolbar
    if (window.location.search.indexOf('share') !== -1) {
        var links = document.querySelectorAll('link[href*="toolbar"]');
        links.forEach(function(l) { l.disabled = true; });

        function getParam(name) {
            var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
            return m ? decodeURIComponent(m[1]) : null;
        }
        function applyShared() {
            var logo = getParam('logo'), logoW = getParam('logoW') || '400';
            var h1 = getParam('h1'), h1W = getParam('h1W') || '400';
            var header = getParam('header'), headerW = getParam('headerW') || '400';
            var body = getParam('body'), bodyW = getParam('bodyW') || '400';
            var h1Size = getParam('h1Size'), headerSize = getParam('headerSize'), bodySize = getParam('bodySize');

            if (logo) document.querySelectorAll('.logo-text').forEach(function(el) {
                el.style.fontFamily = "'" + logo + "', sans-serif";
                el.style.fontWeight = logoW;
                el.classList.toggle('bosten-active', logo === 'Bosten');
            });
            if (h1) document.querySelectorAll('.h1-text, h1.header-text').forEach(function(el) {
                el.style.fontFamily = "'" + h1 + "', sans-serif";
                el.style.fontWeight = h1W;
            });
            if (header) document.querySelectorAll('.header-text:not(h1)').forEach(function(el) {
                el.style.fontFamily = "'" + header + "', sans-serif";
                el.style.fontWeight = headerW;
            });
            if (body) document.querySelectorAll('.body-text').forEach(function(el) {
                el.style.fontFamily = "'" + body + "', sans-serif";
                el.style.fontWeight = bodyW;
            });
            if (h1Size) document.querySelectorAll('.h1-text, h1.header-text').forEach(function(el) { el.style.fontSize = h1Size + 'px'; });
            if (headerSize) document.querySelectorAll('.header-text:not(h1)').forEach(function(el) { el.style.fontSize = headerSize + 'px'; });
            if (bodySize) document.querySelectorAll('.body-text').forEach(function(el) { el.style.fontSize = bodySize + 'px'; });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyShared);
        } else {
            applyShared();
        }
        return;
    }

    var fonts = [
        { name: 'Bilmond', style: "font-family:'Bilmond',sans-serif;font-weight:400", weight: 400 },
        { name: 'Bilmond Light', family: 'Bilmond', style: "font-family:'Bilmond',sans-serif;font-weight:300", weight: 300 },
        { name: 'Bilmond SemiBold', family: 'Bilmond', style: "font-family:'Bilmond',sans-serif;font-weight:600", weight: 600 },
        { name: 'Meditera', style: "font-family:'Meditera',sans-serif" },
        { name: 'Canpile Drawn', label: 'Canpile', style: "font-family:'Canpile Drawn',sans-serif" },
        { name: 'Quano', style: "font-family:'Quano',sans-serif" },
        { name: 'Mantul', style: "font-family:'Mantul',sans-serif" },
        { name: 'Wayang', style: "font-family:'Wayang',sans-serif" },
        { name: 'Saluna', style: "font-family:'Saluna',sans-serif" },
        { name: 'Bosten', style: "font-family:'Bosten',sans-serif" },
        { name: 'Lenia Sans', style: "font-family:'Lenia Sans',sans-serif" },
        { name: 'Konfus', style: "font-family:'Konfus',sans-serif" },
        { name: 'Maxima Nouva', label: 'Maxima N.', style: "font-family:'Maxima Nouva',sans-serif" },
        { name: 'New Black', style: "font-family:'New Black',sans-serif" },
        { name: 'Colossia', style: "font-family:'Colossia',sans-serif" },
        { name: 'Neue Montreal', label: 'Neue Mtl', style: "font-family:'Neue Montreal',sans-serif" },
        { name: 'Milky Croffle', label: 'Milky C.', style: "font-family:'Milky Croffle',sans-serif" }
    ];

    function fontFamily(f) { return f.family || f.name; }
    function fontLabel(f) { return f.label || f.name; }

    function makeBtn(f, cls) {
        return '<button class="tb-btn ' + cls + '" style="' + f.style + ';font-size:11px" ' +
            'data-font="' + fontFamily(f) + '" data-weight="' + (f.weight || 400) + '">' +
            fontLabel(f) + '</button>';
    }

    var h1Btns = fonts.map(function(f) { return makeBtn(f, 'h1-btn'); }).join('');
    var headerBtns = fonts.map(function(f) { return makeBtn(f, 'header-btn'); }).join('');
    var bodyBtns = fonts.map(function(f) { return makeBtn(f, 'body-btn'); }).join('');
    var logoBtns = fonts.map(function(f) { return makeBtn(f, 'logo-btn'); }).join('');

    // Version buttons (only inside iframe)
    var inIframe = window !== window.top;
    var versionHtml = '';
    if (inIframe) {
        versionHtml = '<div class="toolbar-row tb-version-row">' +
            '<button class="tb-version-btn active" data-version="v1">V1</button>' +
            '<button class="tb-version-btn" data-version="v2">V2</button>' +
            '<button class="tb-version-btn" data-version="v3">V3</button>' +
            '<button class="tb-share-btn" id="tbShare">' +
                '<svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>' +
                'Delen' +
            '</button>' +
        '</div>';
    }

    var resetSvg = '<svg viewBox="0 0 24 24" width="12" height="12"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';

    var html = versionHtml +
    '<div class="toolbar-row" id="tbTopRow">' +
        '<span class="toolbar-label">Logo</span>' +
        '<button class="tb-reset" data-reset="logo" title="Reset logo">' + resetSvg + '</button>' +
        '<div class="tb-scroll">' + logoBtns + '</div>' +
        '<button class="toolbar-toggle" id="tbToggle">▲ Inklappen</button>' +
    '</div>' +
    '<div class="toolbar-inner">' +
        '<div class="toolbar-row">' +
            '<span class="toolbar-label">H1</span>' +
            '<button class="tb-reset" data-reset="h1" title="Reset H1">' + resetSvg + '</button>' +
            '<div class="tb-scroll">' + h1Btns + '</div>' +
            '<div class="tb-right">' +
                '<div class="toolbar-divider"></div>' +
                '<span class="toolbar-label" style="min-width:auto">Px</span>' +
                '<div class="size-control">' +
                '<button class="size-btn" onclick="window._tbAdjust(\'h1\',-2)">−</button>' +
                '<span class="size-val" id="h1SizeVal">—</span>' +
                '<button class="size-btn" onclick="window._tbAdjust(\'h1\',2)">+</button></div>' +
            '</div>' +
        '</div>' +
        '<div class="toolbar-row">' +
            '<span class="toolbar-label">Headers</span>' +
            '<button class="tb-reset" data-reset="header" title="Reset headers">' + resetSvg + '</button>' +
            '<div class="tb-scroll">' + headerBtns + '</div>' +
            '<div class="tb-right">' +
                '<div class="toolbar-divider"></div>' +
                '<span class="toolbar-label" style="min-width:auto">Px</span>' +
                '<div class="size-control">' +
                '<button class="size-btn" onclick="window._tbAdjust(\'header\',-1)">−</button>' +
                '<span class="size-val" id="headerSizeVal">—</span>' +
                '<button class="size-btn" onclick="window._tbAdjust(\'header\',1)">+</button></div>' +
                '<div class="toolbar-divider"></div>' +
                '<div class="device-icons">' +
                '<button class="device-icon active" onclick="window._tbDevice(\'desktop\',this)" title="Desktop"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></button>' +
                '<button class="device-icon" onclick="window._tbDevice(\'tablet\',this)" title="Tablet"><svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="10" y1="18" x2="14" y2="18"/></svg></button>' +
                '<button class="device-icon" onclick="window._tbDevice(\'mobile\',this)" title="Mobiel"><svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="10.5" y1="18" x2="13.5" y2="18"/></svg></button>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="toolbar-row">' +
            '<span class="toolbar-label">Body</span>' +
            '<button class="tb-reset" data-reset="body" title="Reset body">' + resetSvg + '</button>' +
            '<div class="tb-scroll">' + bodyBtns + '</div>' +
            '<div class="tb-right">' +
                '<div class="toolbar-divider"></div>' +
                '<span class="toolbar-label" style="min-width:auto">Px</span>' +
                '<div class="size-control">' +
                '<button class="size-btn" onclick="window._tbAdjust(\'body\',-1)">−</button>' +
                '<span class="size-val" id="bodySizeVal">16px</span>' +
                '<button class="size-btn" onclick="window._tbAdjust(\'body\',1)">+</button></div>' +
                '<div class="toolbar-divider"></div>' +
                '<span class="toolbar-label" style="min-width:auto">BG</span>' +
                '<button class="tb-reset" data-reset="bg" title="Reset achtergrond">' + resetSvg + '</button>' +
                '<div class="color-control">' +
                '<input type="color" id="bgColorPicker" class="color-picker" value="#354A32" title="Achtergrondkleur">' +
                '<input type="text" id="bgHexInput" class="hex-input" value="#354A32" placeholder="#hex" maxlength="7">' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';

    var toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.id = 'toolbar';
    toolbar.innerHTML = html;
    document.body.insertBefore(toolbar, document.body.firstChild);

    // Toggle
    document.getElementById('tbToggle').addEventListener('click', function() {
        var tb = document.getElementById('toolbar');
        tb.classList.toggle('collapsed');
        var collapsed = tb.classList.contains('collapsed');
        this.textContent = collapsed ? '▼ Uitklappen' : '▲ Inklappen';
    });

    // Track active font selections
    var activeFont = { logo: null, logoWeight: '400', h1: null, h1Weight: '400', header: null, headerWeight: '400', body: null, bodyWeight: '400' };

    // Capture defaults on load for reset
    var defaults = {};
    (function captureDefaults() {
        function getStyle(sel, prop) {
            var el = document.querySelector(sel);
            return el ? getComputedStyle(el)[prop] : '';
        }
        defaults.logo = { font: getStyle('.logo-text', 'fontFamily'), weight: getStyle('.logo-text', 'fontWeight') };
        defaults.h1 = { font: getStyle('h1.header-text, .h1-text', 'fontFamily'), weight: getStyle('h1.header-text, .h1-text', 'fontWeight'), size: getStyle('h1.header-text, .h1-text', 'fontSize') };
        defaults.header = { font: getStyle('.header-text:not(h1)', 'fontFamily'), weight: getStyle('.header-text:not(h1)', 'fontWeight'), size: getStyle('.header-text:not(h1)', 'fontSize') };
        defaults.body = { font: getStyle('.body-text', 'fontFamily'), weight: getStyle('.body-text', 'fontWeight'), size: getStyle('.body-text', 'fontSize') };
        var cs = getComputedStyle(document.body).backgroundColor;
        var m = cs.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        defaults.bg = m ? '#' + [m[1],m[2],m[3]].map(function(x) { return parseInt(x).toString(16).padStart(2,'0'); }).join('') : '#354A32';
    })();

    // Reset handlers
    toolbar.addEventListener('click', function(e) {
        var resetBtn = e.target.closest('.tb-reset');
        if (!resetBtn) return;
        var type = resetBtn.getAttribute('data-reset');

        if (type === 'logo') {
            document.querySelectorAll('.logo-text').forEach(function(el) {
                el.style.fontFamily = ''; el.style.fontWeight = '';
                el.style.transform = ''; el.style.transformOrigin = '';
            });
            toolbar.querySelectorAll('.logo-btn').forEach(function(b) { b.classList.remove('active'); });
            activeFont.logo = null; activeFont.logoWeight = '400';
        }
        else if (type === 'h1') {
            document.querySelectorAll('.h1-text, h1.header-text').forEach(function(el) {
                el.style.fontFamily = ''; el.style.fontWeight = ''; el.style.fontSize = '';
                el.style.transform = ''; el.style.transformOrigin = '';
            });
            toolbar.querySelectorAll('.h1-btn').forEach(function(b) { b.classList.remove('active'); });
            activeFont.h1 = null; activeFont.h1Weight = '400';
            sizes.h1 = 0;
            document.getElementById('h1SizeVal').textContent = '—';
        }
        else if (type === 'header') {
            document.querySelectorAll('.header-text:not(h1)').forEach(function(el) {
                el.style.fontFamily = ''; el.style.fontWeight = ''; el.style.fontSize = '';
                el.style.transform = ''; el.style.transformOrigin = '';
            });
            toolbar.querySelectorAll('.header-btn').forEach(function(b) { b.classList.remove('active'); });
            activeFont.header = null; activeFont.headerWeight = '400';
            sizes.header = 0;
            document.getElementById('headerSizeVal').textContent = '—';
        }
        else if (type === 'body') {
            document.querySelectorAll('.body-text').forEach(function(el) {
                el.style.fontFamily = ''; el.style.fontWeight = ''; el.style.fontSize = '';
                el.style.transform = ''; el.style.transformOrigin = '';
            });
            toolbar.querySelectorAll('.body-btn').forEach(function(b) { b.classList.remove('active'); });
            activeFont.body = null; activeFont.bodyWeight = '400';
            sizes.body = 0;
            document.getElementById('bodySizeVal').textContent = '—';
        }
        else if (type === 'bg') {
            document.documentElement.style.removeProperty('--bg');
            document.body.style.backgroundColor = '';
            var page = document.getElementById('page');
            if (page) page.style.backgroundColor = '';
            document.querySelectorAll('.hero, .projects, .consulten, .footer, .contact-row').forEach(function(el) {
                el.style.backgroundColor = '';
            });
            document.getElementById('bgColorPicker').value = defaults.bg;
            document.getElementById('bgHexInput').value = defaults.bg;
        }
    });

    // Expose state for parent frame (shareVersion)
    window._tbGetState = function() {
        return {
            logo: activeFont.logo, logoWeight: activeFont.logoWeight,
            h1: activeFont.h1, h1Weight: activeFont.h1Weight,
            header: activeFont.header, headerWeight: activeFont.headerWeight,
            body: activeFont.body, bodyWeight: activeFont.bodyWeight,
            h1Size: sizes.h1 || 0,
            headerSize: sizes.header || 0,
            bodySize: sizes.body || 0
        };
    };

    // Click handlers via delegation
    toolbar.addEventListener('click', function(e) {
        var btn = e.target.closest('.tb-btn');
        if (!btn) return;
        var font = btn.getAttribute('data-font');
        var weight = btn.getAttribute('data-weight') || '400';

        function applyStretch(el, font) {
            if (font === 'Milky Croffle') { el.style.transform = 'scaleX(1.1)'; el.style.transformOrigin = 'left center'; }
            else if (font === 'Bosten') { el.style.transform = 'scaleX(1.15)'; el.style.transformOrigin = 'left center'; }
            else { el.style.transform = ''; el.style.transformOrigin = ''; }
        }

        if (btn.classList.contains('logo-btn')) {
            document.querySelectorAll('.logo-text').forEach(function(el) {
                el.style.fontFamily = "'" + font + "', sans-serif";
                el.style.fontWeight = weight;
                applyStretch(el, font);
            });
            toolbar.querySelectorAll('.logo-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFont.logo = font; activeFont.logoWeight = weight;
        }
        else if (btn.classList.contains('h1-btn')) {
            document.querySelectorAll('.h1-text, h1.header-text').forEach(function(el) {
                el.style.fontFamily = "'" + font + "', sans-serif";
                el.style.fontWeight = weight;
                applyStretch(el, font);
            });
            toolbar.querySelectorAll('.h1-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFont.h1 = font; activeFont.h1Weight = weight;
        }
        else if (btn.classList.contains('header-btn')) {
            document.querySelectorAll('.header-text:not(h1)').forEach(function(el) {
                el.style.fontFamily = "'" + font + "', sans-serif";
                el.style.fontWeight = weight;
                applyStretch(el, font);
            });
            toolbar.querySelectorAll('.header-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFont.header = font; activeFont.headerWeight = weight;
        }
        else if (btn.classList.contains('body-btn')) {
            document.querySelectorAll('.body-text').forEach(function(el) {
                el.style.fontFamily = "'" + font + "', sans-serif";
                el.style.fontWeight = weight;
                applyStretch(el, font);
            });
            toolbar.querySelectorAll('.body-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeFont.body = font; activeFont.bodyWeight = weight;
        }
    });

    // Size adjusters
    var sizes = { body: 16, h1: 0, header: 0 };
    window._tbAdjust = function(type, delta) {
        if (type === 'body') {
            if (sizes.body === 0) {
                var sample = document.querySelector('.body-text');
                sizes.body = sample ? parseInt(getComputedStyle(sample).fontSize) : 16;
            }
            sizes.body = Math.max(10, Math.min(40, sizes.body + delta));
            document.querySelectorAll('.body-text').forEach(function(el) { el.style.fontSize = sizes.body + 'px'; });
            document.getElementById('bodySizeVal').textContent = sizes.body + 'px';
        }
        else if (type === 'h1') {
            if (sizes.h1 === 0) {
                var sample = document.querySelector('h1.header-text, .h1-text');
                sizes.h1 = sample ? parseInt(getComputedStyle(sample).fontSize) : 48;
            }
            sizes.h1 = Math.max(20, Math.min(120, sizes.h1 + delta));
            document.querySelectorAll('h1.header-text, .h1-text').forEach(function(el) { el.style.fontSize = sizes.h1 + 'px'; });
            document.getElementById('h1SizeVal').textContent = sizes.h1 + 'px';
        }
        else if (type === 'header') {
            if (sizes.header === 0) {
                var sample = document.querySelector('.header-text:not(h1)');
                sizes.header = sample ? parseInt(getComputedStyle(sample).fontSize) : 24;
            }
            sizes.header = Math.max(12, Math.min(80, sizes.header + delta));
            document.querySelectorAll('.header-text:not(h1)').forEach(function(el) { el.style.fontSize = sizes.header + 'px'; });
            document.getElementById('headerSizeVal').textContent = sizes.header + 'px';
        }
    };

    // Device switcher
    window._tbDevice = function(device, btn) {
        var frame = document.getElementById('deviceFrame');
        if (!frame) return;
        frame.className = 'device-frame ' + device;
        toolbar.querySelectorAll('.device-icon').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
    };

    // Version switcher (iframe → parent communication)
    if (inIframe) {
        // Detect which version we are
        var path = window.location.pathname;
        var currentV = 'v1';
        if (path.indexOf('/v2/') !== -1) currentV = 'v2';
        else if (path.indexOf('/v3/') !== -1) currentV = 'v3';

        toolbar.querySelectorAll('.tb-version-btn').forEach(function(btn) {
            if (btn.getAttribute('data-version') === currentV) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            btn.addEventListener('click', function() {
                var v = this.getAttribute('data-version');
                window.top.postMessage({ type: 'switchVersion', version: v }, '*');
            });
        });

        document.getElementById('tbShare').addEventListener('click', function() {
            window.top.postMessage({ type: 'shareVersion' }, '*');
        });
    }

    // Background color picker
    function applyBgColor(hex) {
        document.documentElement.style.setProperty('--bg', hex);
        document.body.style.backgroundColor = hex;
        var page = document.getElementById('page');
        if (page) page.style.backgroundColor = hex;
        // Also set sections that might have explicit bg
        document.querySelectorAll('.hero, .projects, .consulten, .footer, .contact-row').forEach(function(el) {
            el.style.backgroundColor = hex;
        });
    }

    var colorPicker = document.getElementById('bgColorPicker');
    var hexInput = document.getElementById('bgHexInput');

    // Detect current bg color
    (function() {
        var cs = getComputedStyle(document.body).backgroundColor;
        var m = cs.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (m) {
            var hex = '#' + [m[1],m[2],m[3]].map(function(x) { return parseInt(x).toString(16).padStart(2,'0'); }).join('');
            colorPicker.value = hex;
            hexInput.value = hex;
        }
    })();

    colorPicker.addEventListener('input', function() {
        hexInput.value = this.value;
        applyBgColor(this.value);
    });

    hexInput.addEventListener('input', function() {
        var val = this.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            colorPicker.value = val;
            applyBgColor(val);
        }
    });

    hexInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var val = this.value.trim();
            if (!/^#/.test(val)) val = '#' + val;
            if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                this.value = val;
                colorPicker.value = val;
                applyBgColor(val);
            }
        }
    });
})();
