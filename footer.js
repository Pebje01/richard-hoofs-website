// Load shared footer on all pages
(function() {
    var placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;
    fetch('footer.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            placeholder.outerHTML = html;
            // Re-observe fade-in elements in footer
            if (typeof obs !== 'undefined') {
                document.querySelectorAll('.unified-footer .fade-in').forEach(function(el) {
                    obs.observe(el);
                });
            }
        });
})();
