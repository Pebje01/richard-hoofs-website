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

    // Maak hidden form voor Laposta
    var lapostaForm = document.createElement('form');
    lapostaForm.method = 'POST';
    lapostaForm.action = 'https://dokter-richard.email-provider.eu/subscribe/post/index.php';
    lapostaForm.target = 'laposta-footer-iframe';
    lapostaForm.acceptCharset = 'utf-8';

    var fields = {
        'a': 'szg9g1odij',
        'l': 'pzqhbu8wwj',
        '6Gw9jS4cU3': email,
        'next': ''
    };

    for (var key in fields) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        lapostaForm.appendChild(input);
    }

    document.body.appendChild(lapostaForm);
    lapostaForm.submit();

    // Opruimen
    setTimeout(function() {
        if (lapostaForm.parentNode) lapostaForm.parentNode.removeChild(lapostaForm);
    }, 3000);

    // Toon bevestiging
    form.innerHTML = '<p style="color:#fff;font-size:14px;font-weight:600;">Bedankt voor je inschrijving!</p>';

    return false;
}
