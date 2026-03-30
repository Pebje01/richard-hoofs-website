// Load shared nav on all pages
(function() {
    var placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;
    fetch('nav.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            placeholder.outerHTML = html;
            // On subpages: use sticky light nav instead of transparent fixed nav
            var page = window.location.pathname.split('/').pop() || 'index.html';
            if (page !== 'index.html' && page !== '') {
                var nav = document.querySelector('.nav');
                if (nav) nav.classList.add('subpage-nav');
            }
            // Highlight current page in nav
            var links = document.querySelectorAll('.nav-center a');
            links.forEach(function(link) {
                if (link.getAttribute('href') === page) {
                    link.classList.add('active');
                }
            });
            // Scroll detection for subpage nav
            if (page !== 'index.html' && page !== '') {
                var navEl = document.querySelector('.nav');
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 80) {
                        navEl.classList.add('scrolled');
                    } else {
                        navEl.classList.remove('scrolled');
                    }
                });
            }
        });
})();

function openMobileNav(){document.getElementById('mobileNav').classList.add('open');document.body.style.overflow='hidden'}
function closeMobileNav(){document.getElementById('mobileNav').classList.remove('open');document.body.style.overflow=''}
