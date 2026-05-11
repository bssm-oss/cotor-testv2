// Simple script for landing page interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Add any interactive behavior here
    console.log('Landing page loaded');
    
    // Example: smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});