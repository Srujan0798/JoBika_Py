/**
 * Session Manager for Guest Mode
 * Handles temporary data storage, authentication state, and global auth modal
 */

class SessionManager {
    constructor() {
        this.isGuest = !this.hasAuthToken();
        this.guestDataKey = 'jobika_guest_data';
        this.initAuthModal();
        this.init();
    }

    init() {
        this.checkGuestStatus();
        this.setupGuestBanner();
        this.initDarkMode();
    }

    initDarkMode() {
        const isDark = localStorage.getItem('jobika_dark_mode') === 'true';
        if (isDark) {
            this.injectDarkModeStyles();
            document.body.classList.add('dark-mode');
        }
    }

    injectDarkModeStyles() {
        if (document.getElementById('darkModeStyles')) return;
        const style = document.createElement('style');
        style.id = 'darkModeStyles';
        style.textContent = `
            body.dark-mode { background-color: #111827; color: #f9fafb; }
            body.dark-mode .sidebar { background-color: #1f2937; border-right-color: #374151; }
            body.dark-mode .nav-link { color: #9ca3af; }
            body.dark-mode .nav-link:hover, body.dark-mode .nav-link.active { background-color: #374151; color: white; }
            body.dark-mode .card, body.dark-mode .settings-section, body.dark-mode .job-card, body.dark-mode .application-card, body.dark-mode .stat-card { background-color: #1f2937; color: #f9fafb; border-color: #374151; }
            body.dark-mode .settings-title, body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 { color: #f9fafb; }
            body.dark-mode .form-input, body.dark-mode input, body.dark-mode select, body.dark-mode textarea { background-color: #374151; border-color: #4b5563; color: white; }
            body.dark-mode .text-gray-600, body.dark-mode .text-gray-700, body.dark-mode p, body.dark-mode .stat-label, body.dark-mode .job-company, body.dark-mode .job-meta { color: #d1d5db !important; }
            body.dark-mode .main-content { background-color: #111827; }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize Auth Modal
     */
    async initAuthModal() {
        if (document.getElementById('globalAuthModal')) return;

        try {
            const response = await fetch('components/auth-modal.html');
            if (response.ok) {
                const html = await response.text();
                document.body.insertAdjacentHTML('beforeend', html);
            }
        } catch (error) {
            console.error('Failed to load auth modal:', error);
        }
    }

    /**
     * Check if user is logged in
     */
    hasAuthToken() {
        return localStorage.getItem('auth_token') !== null;
    }

    /**
     * Show Auth Modal
     * @param {string} mode - 'login' or 'register'
     */
    showAuthModal(mode = 'login') {
        const modal = document.getElementById('globalAuthModal');
        if (modal) {
            modal.style.display = 'flex';
            this.switchAuthTab(mode);
        }
    }

    /**
     * Hide Auth Modal
     */
    hideAuthModal() {
        const modal = document.getElementById('globalAuthModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * Switch between Login and Register tabs
     */
    switchAuthTab(mode) {
        const loginForm = document.getElementById('authModalLogin');
        const registerForm = document.getElementById('authModalRegister');
        const tabs = document.querySelectorAll('.auth-tab');

        if (mode === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            tabs[0].classList.add('active');
            tabs[1].classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            tabs[0].classList.remove('active');
            tabs[1].classList.add('active');
        }
    }

    /**
     * Handle Login
     */
    async handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const btn = event.target.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Logging in...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                this.isGuest = false;
                this.hideAuthModal();

                // Migrate guest data
                await this.migrateGuestData();

                window.location.reload();
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    /**
     * Handle Registration
     */
    async handleRegister(event) {
        event.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const btn = event.target.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Creating Account...';
        btn.disabled = true;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                this.isGuest = false;
                this.hideAuthModal();

                // Migrate guest data
                await this.migrateGuestData();

                window.location.reload();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    /**
     * Migrate Guest Data to User Account
     */
    async migrateGuestData() {
        const guestData = sessionStorage.getItem(this.guestDataKey);
        if (!guestData) return;

        try {
            await fetch('/api/auth/migrate-guest-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: guestData
            });
            sessionStorage.removeItem(this.guestDataKey);
        } catch (error) {
            console.error('Migration error:', error);
        }
    }

    /**
     * Check Guest Status and Update UI
     */
    checkGuestStatus() {
        if (this.isGuest) {
            document.body.classList.add('guest-mode');
            this.updateGuestUI();
        }
    }

    /**
     * Update UI elements for guest mode
     */
    updateGuestUI() {
        // Update user profile in sidebar
        const userName = document.querySelector('.user-name');
        const userRole = document.querySelector('.user-role');
        if (userName) userName.textContent = 'Guest User';
        if (userRole) userRole.textContent = 'Exploring Demo Mode';

        // Update logout button to login
        const logoutLink = document.querySelector('a[onclick="logout()"]');
        if (logoutLink) {
            logoutLink.innerHTML = '<span>🔑</span><span>Login to Save</span>';
            logoutLink.onclick = (e) => {
                e.preventDefault();
                this.showAuthModal('login');
            };
        }
    }

    /**
     * Setup Guest Banner
     */
    setupGuestBanner() {
        if (!this.isGuest) return;

        const banner = document.createElement('div');
        banner.className = 'guest-banner';
        banner.innerHTML = `
            <div class="guest-banner-content">
                <span>👋 You are exploring in Guest Mode. Data will be lost when you close the tab.</span>
                <button onclick="sessionManager.showAuthModal('register')">Create Free Account</button>
            </div>
        `;
        document.body.prepend(banner);
    }

    /**
     * Access Feature Guard
     */
    accessFeature(featureName) {
        if (this.isGuest) {
            this.showAuthModal('login');
            return false;
        }
        return true;
    }
}

// Initialize
const sessionManager = new SessionManager();

// Global Logout
function logout() {
    localStorage.removeItem('auth_token');
    window.location.href = 'index.html';
}
