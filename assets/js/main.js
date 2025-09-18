/**
 * Main Application Entry Point
 * Coordinates all modules and handles global functionality
 */

class PrivacyTestingHub {
    constructor() {
        this.init();
    }

    init() {
        // Initialize clipboard functionality for URL copying
        this.initializeClipboard();

        // Initialize any global event listeners
        this.initializeGlobalEvents();

        console.log('Privacy Testing Hub initialized');
    }

    /**
     * Initializes clipboard functionality for copyable URLs
     */
    initializeClipboard() {
        // Add global copy function to window for inline onclick handlers
        window.copyToClipboard = (text, element) => {
            UIManager.copyToClipboard(text, element);
        };
    }

    /**
     * Initializes global event listeners
     */
    initializeGlobalEvents() {
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + H - Go to homepage
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                window.location.href = '/';
            }

            // Escape - Close any modals or notifications
            if (e.key === 'Escape') {
                this.closeActiveOverlays();
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden - pausing any active operations');
            } else {
                console.log('Page visible - resuming operations');
            }
        });
    }

    /**
     * Closes any active overlays (modals, notifications, etc.)
     */
    closeActiveOverlays() {
        // Close status notifications
        const statusDiv = document.getElementById('use-case-status');
        if (statusDiv) {
            statusDiv.classList.remove('show');
        }

        // Close any modals (if they exist)
        const modals = document.querySelectorAll('[style*="z-index: 2000"]');
        modals.forEach(modal => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        });
    }

    /**
     * Utility method to get current page info
     */
    static getPageInfo() {
        return {
            url: window.location.href,
            path: window.location.pathname,
            hash: window.location.hash,
            search: window.location.search,
            origin: window.location.origin,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Debug method to log current state
     */
    static debugInfo() {
        console.group('Privacy Testing Hub Debug Info');
        console.log('Page Info:', this.getPageInfo());
        console.log('Cookies:', CookieManager.getAllCookies());
        console.log('LocalStorage:', { ...localStorage });
        console.log('SessionStorage:', { ...sessionStorage });
        console.groupEnd();
    }
}

// Initialize the application
const privacyTestingHub = new PrivacyTestingHub();

// Make debug function globally available
window.debugPrivacyHub = PrivacyTestingHub.debugInfo;