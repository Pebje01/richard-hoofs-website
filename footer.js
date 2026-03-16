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

// Footer nieuwsbrief → Laposta koppeling
function footerNewsletterSubmit(form) {
    var email = form.email.value.trim();
    if (!email) return false;

    var apiKey = 'FqSl0KJvMZ0a69BuMyfR';
    var listId = 'pzqhbu8wwj';

    var body = new URLSearchParams();
    body.append('list_id', listId);
    body.append('ip', '0.0.0.0');
    body.append('email', email);
    body.append('source_url', window.location.href);

    fetch('https://api.laposta.nl/v2/member', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(apiKey + ':'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    }).then(function(r) {
        console.log('Laposta footer response:', r.status);
    }).catch(function(e) {
        console.log('Laposta footer error:', e);
    });

    // Toon bevestiging
    form.innerHTML = '<p style="color:#fff;font-size:14px;font-weight:600;">Bedankt voor je inschrijving!</p>';

    return false;
}
