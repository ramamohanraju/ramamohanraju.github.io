/**
 * UI Manager Module
 * Handles user interface interactions and visual feedback
 */

class UIManager {
    /**
     * Shows a status notification for active use cases
     * @param {string} useCase - The use case identifier
     * @param {string} message - Status message to display
     */
    static showUseCaseStatus(useCase, message) {
        // Create or update status indicator
        let statusDiv = document.getElementById('use-case-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'use-case-status';
            statusDiv.className = 'use-case-status';
            document.body.appendChild(statusDiv);
        }

        statusDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px;">Use Case Active: ${useCase}</div>
            <div style="opacity: 0.9;">${message}</div>
        `;

        // Show the notification
        statusDiv.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusDiv.classList.remove('show');
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 300);
        }, 5000);
    }

    /**
     * Copies text to clipboard and provides visual feedback
     * @param {string} text - Text to copy
     * @param {HTMLElement} element - Element to provide visual feedback on
     */
    static async copyToClipboard(text, element) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback(element, 'Copied!');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(text);
            this.showCopyFeedback(element, 'Copied!');
        }
    }

    /**
     * Fallback method for copying text to clipboard
     * @param {string} text - Text to copy
     */
    static fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    /**
     * Shows visual feedback when text is copied
     * @param {HTMLElement} element - Element to show feedback on
     * @param {string} message - Feedback message
     */
    static showCopyFeedback(element, message) {
        element.classList.add('copied');
        const indicator = element.querySelector('.copy-indicator');
        if (indicator) {
            const originalText = indicator.textContent;
            indicator.textContent = message;

            setTimeout(() => {
                element.classList.remove('copied');
                indicator.textContent = originalText;
            }, 2000);
        }
    }

    /**
     * Creates a loading spinner
     * @param {HTMLElement} container - Container to add spinner to
     * @returns {HTMLElement} The spinner element
     */
    static createLoadingSpinner(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            "></div>
        `;

        // Add CSS animation if not already present
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        container.appendChild(spinner);
        return spinner;
    }

    /**
     * Removes a loading spinner
     * @param {HTMLElement} spinner - Spinner element to remove
     */
    static removeLoadingSpinner(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    /**
     * Shows a modal dialog
     * @param {string} title - Modal title
     * @param {string} content - Modal content (HTML)
     * @param {Array} buttons - Array of button objects {text, onClick, className}
     */
    static showModal(title, content, buttons = []) {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
        `;

        modal.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: #1a1a1a; font-size: 1.25rem;">${title}</h3>
            <div style="margin-bottom: 1.5rem; color: #666; line-height: 1.6;">${content}</div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                ${buttons.map(btn => `
                    <button class="${btn.className || 'btn-primary'}" data-action="${btn.action || ''}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Add button event listeners
        buttons.forEach((btn, index) => {
            const buttonElement = modal.querySelectorAll('button')[index];
            buttonElement.addEventListener('click', (e) => {
                if (btn.onClick) {
                    btn.onClick(e);
                }
                document.body.removeChild(backdrop);
            });
        });

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                document.body.removeChild(backdrop);
            }
        });

        return backdrop;
    }

    /**
     * Creates a toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 3000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        toast.textContent = message;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
        }, 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.style.transform = 'translateY(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);

        return toast;
    }
}