/**
 * Mobile Navigation Script
 * Handles hamburger menu toggle for sidebar on mobile devices
 */

(function() {
    'use strict';
    
    function initMobileNav() {
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.innerHTML = `
            <div class="hamburger-icon">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        
        // Insert at start of body
        document.body.insertBefore(hamburger, document.body.firstChild);
        document.body.insertBefore(overlay, document.body.firstChild);
        
        // Get sidebar
        const sidebar = document.querySelector('.sidebar');
        
        if (!sidebar) return; // Exit if no sidebar found
        
        // Toggle function
        function toggleSidebar() {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Event listeners
        hamburger.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
        
        // Close menu when clicking nav link (mobile)
        if (window.innerWidth <= 768) {
            const navLinks = sidebar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (sidebar.classList.contains('active')) {
                        toggleSidebar();
                    }
                });
            });
        }
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    // Desktop view - reset everything
                    hamburger.classList.remove('active');
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 250);
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
