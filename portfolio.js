document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Unobserve element after it's revealed for better performance
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Make sure hero content is revealed smoothly on load
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content.reveal');
        if (heroContent) {
            heroContent.classList.add('active');
        }
    }, 100);
});
