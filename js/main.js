document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

function scrollToNewsletter() {
    const newsletterSection = document.getElementById('newsletter');
    if (newsletterSection) {
        newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
}
