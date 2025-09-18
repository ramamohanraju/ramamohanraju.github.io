/**
 * Page Manager Module
 * Handles dynamic page generation and navigation for use cases
 */

class PageManager {
    /**
     * Creates a page scanning interface with navigation to multiple pages
     * @param {string} useCase - The use case identifier
     * @param {number} pageCount - Number of pages to create
     */
    static createPageScanningInterface(useCase, pageCount) {
        console.log(`Creating page scanning interface for ${pageCount} pages`);

        // Replace the main content with page links
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) {
            console.error('Main container not found');
            return;
        }

        mainContainer.innerHTML = `
            <section class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Page Scanning Test: ${pageCount} Pages</h2>
                    <p class="section-description">
                        Navigate through ${pageCount} pages, each dropping 2 unique cookies for comprehensive scanning tests
                    </p>
                </div>

                <div class="url-grid" id="page-links-grid">
                    ${this.generatePageLinks(useCase, pageCount)}
                </div>

                <div style="text-align: center; margin-top: 3rem;">
                    <button onclick="location.href='/'" class="btn-primary">
                        ← Return to Homepage
                    </button>
                </div>
            </section>
        `;

        UIManager.showUseCaseStatus(useCase, `Generated ${pageCount-1} linked pages with cookie drops`);
    }

    /**
     * Generates HTML for page navigation links
     * @param {string} useCase - The use case identifier
     * @param {number} pageCount - Number of pages to generate
     * @returns {string} HTML string for page links
     */
    static generatePageLinks(useCase, pageCount) {
        let linksHtml = '';

        // First page (current page) - drop cookies immediately
        CookieManager.dropCookies(`${useCase}-page1`, 2);

        linksHtml += `
            <div class="url-item" style="border-left-color: #10b981;">
                <div class="url-header">
                    <div class="url-path">Page 1 (Current)</div>
                    <div class="url-type">Active</div>
                </div>
                <div class="url-description">Main page with navigation - 2 cookies dropped automatically</div>
                <div class="url-features">
                    <span class="url-feature">2 Cookies</span>
                    <span class="url-feature">Current Page</span>
                </div>
            </div>
        `;

        // Generate links for remaining pages
        for (let i = 2; i <= pageCount; i++) {
            const pageFileName = `${useCase}-page${i}.html`;
            linksHtml += `
                <div class="url-item" onclick="PageManager.navigateToPage('${pageFileName}')" style="cursor: pointer;">
                    <div class="url-header">
                        <div class="url-path">${pageFileName}</div>
                        <div class="url-type">Page ${i}</div>
                    </div>
                    <div class="url-description">Test page ${i} - drops 2 unique cookies on visit</div>
                    <div class="url-features">
                        <span class="url-feature">2 Cookies</span>
                        <span class="url-feature">Click to Visit</span>
                    </div>
                </div>
            `;
        }

        return linksHtml;
    }

    /**
     * Navigates to a specific page
     * @param {string} pageFileName - Name of the page to navigate to
     */
    static navigateToPage(pageFileName) {
        // For now, we'll create the pages dynamically
        // In production, you might want to pre-generate these pages
        this.createTestPage(pageFileName);
    }

    /**
     * Creates a dynamic test page (placeholder for actual page creation)
     * @param {string} pageFileName - Name of the page to create
     */
    static createTestPage(pageFileName) {
        // Extract page info from filename
        const match = pageFileName.match(/(.*)-page(\d+)\.html/);
        if (!match) {
            console.error('Invalid page filename format');
            return;
        }

        const [, useCase, pageNumber] = match;

        // Show loading state
        UIManager.showUseCaseStatus('navigation', `Loading ${pageFileName}...`);

        // Simulate page creation and navigation
        setTimeout(() => {
            // In a real implementation, this would navigate to the actual page
            // For demo purposes, we'll show what would happen
            CookieManager.dropCookies(`${useCase}-page${pageNumber}`, 2);

            alert(`Navigated to ${pageFileName}\n\nThis page would:\n• Drop 2 unique cookies\n• Show page-specific content\n• Maintain navigation back to main page\n\nCheck your browser cookies to see the new entries!`);

            UIManager.showUseCaseStatus(`page-${pageNumber}`, `Dropped 2 cookies on ${pageFileName}`);
        }, 1000);
    }

    /**
     * Creates an actual HTML page file for the scanning test
     * @param {string} useCase - The use case identifier
     * @param {number} pageNumber - Page number
     */
    static async createPhysicalPage(useCase, pageNumber) {
        const pageContent = this.getPageTemplate(useCase, pageNumber);
        const fileName = `${useCase}-page${pageNumber}.html`;

        try {
            // This would need server-side implementation in a real scenario
            console.log(`Would create file: ${fileName}`);
            console.log('Page content:', pageContent);
        } catch (error) {
            console.error(`Error creating page ${fileName}:`, error);
        }
    }

    /**
     * Gets the HTML template for a test page
     * @param {string} useCase - The use case identifier
     * @param {number} pageNumber - Page number
     * @returns {string} Complete HTML page content
     */
    static getPageTemplate(useCase, pageNumber) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${useCase} - Page ${pageNumber}</title>
    <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">${useCase.replace('-', ' ').toUpperCase()}</h1>
            <p class="hero-subtitle">Test Page ${pageNumber}</p>
            <p class="hero-description">
                This page automatically drops 2 unique cookies for testing purposes.
            </p>
        </div>
    </section>

    <div class="main-container">
        <section class="content-section">
            <div class="section-header">
                <h2 class="section-title">Page ${pageNumber} Content</h2>
                <p class="section-description">
                    This page is part of the ${useCase} testing scenario
                </p>
            </div>

            <div style="text-align: center; margin-top: 3rem;">
                <button onclick="location.href='/'" class="btn-primary">
                    ← Return to Homepage
                </button>
            </div>
        </section>
    </div>

    <script src="assets/js/cookie-manager.js"></script>
    <script src="assets/js/ui-manager.js"></script>
    <script>
        // Drop cookies when page loads
        document.addEventListener('DOMContentLoaded', function() {
            CookieManager.dropCookies('${useCase}-page${pageNumber}', 2);
            UIManager.showUseCaseStatus('page-${pageNumber}', 'Dropped 2 cookies on page load');
        });
    </script>
</body>
</html>`;
    }
}