/**
 * Use Case Handler Module
 * Handles URL-based use case detection and execution
 */

class UseCaseHandler {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.detectAndHandleUseCase();
        });
    }

    /**
     * Detects URL pattern and handles the corresponding use case
     */
    detectAndHandleUseCase() {
        const path = window.location.pathname;
        const pathSegments = path.split('/').filter(segment => segment !== '');

        if (pathSegments.length > 0) {
            const useCase = pathSegments[pathSegments.length - 1];
            this.handleUseCase(useCase);
        }
    }

    /**
     * Routes use cases to their specific handlers
     * @param {string} useCase - The detected use case pattern
     */
    handleUseCase(useCase) {
        console.log('Detected use case:', useCase);

        // Cookie scanning use cases
        if (useCase.startsWith('scan-') && useCase.includes('-cookies')) {
            const match = useCase.match(/scan-(\d+)-cookies/);
            if (match) {
                const cookieCount = parseInt(match[1]);
                CookieManager.dropCookies(useCase, cookieCount);
                UIManager.showUseCaseStatus(useCase, `Dropped ${cookieCount} cookies`);
                return;
            }
        }

        // Page scanning use cases
        if (useCase.startsWith('scan-') && useCase.includes('-pages')) {
            const match = useCase.match(/scan-(\d+)-pages/);
            if (match) {
                const pageCount = parseInt(match[1]);
                PageManager.createPageScanningInterface(useCase, pageCount);
                return;
            }
        }

        // Specific use case handlers
        switch (useCase) {
            case 'gdpr-test':
                this.handleGDPRTest();
                break;
            case 'ccpa-test':
                this.handleCCPATest();
                break;
            case 'iab-tcf-test':
                this.handleIABTCFTest();
                break;
            default:
                console.log('No specific handler for use case:', useCase);
        }
    }

    /**
     * Handles GDPR testing scenario
     */
    handleGDPRTest() {
        console.log('Handling GDPR test scenario');

        const gdprConsent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        };

        localStorage.setItem('gdpr-consent', JSON.stringify(gdprConsent));
        UIManager.showUseCaseStatus('gdpr-test', 'GDPR consent preferences set');
    }

    /**
     * Handles CCPA testing scenario
     */
    handleCCPATest() {
        console.log('Handling CCPA test scenario');

        localStorage.setItem('ccpa-opt-out', 'true');
        document.cookie = 'ccpa-opt-out=1; expires=Thu, 31 Dec 2025 12:00:00 UTC; path=/';
        UIManager.showUseCaseStatus('ccpa-test', 'CCPA opt-out signal activated');
    }

    /**
     * Handles IAB TCF testing scenario
     */
    handleIABTCFTest() {
        console.log('Handling IAB TCF test scenario');

        const tcString = 'CP7RgwAP7RgwAAOACKENAsCgAAAAAAAAAAAAAAAAAAAAA.QAAAAAAAAAA';
        localStorage.setItem('IABTCF_TCString', tcString);
        localStorage.setItem('IABTCF_gdprApplies', '1');
        UIManager.showUseCaseStatus('iab-tcf-test', 'IAB TCF consent string configured');
    }
}

// Initialize the use case handler
const useCaseHandler = new UseCaseHandler();