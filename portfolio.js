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

    // Dynamic Navigation Color on Scroll
    const siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                siteNav.classList.add('scrolled');
            } else {
                siteNav.classList.remove('scrolled');
            }
        });
    }

    // Mobile Hamburger Menu Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = navLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileNavToggle.classList.remove('active');
            });
        });
    }
});
