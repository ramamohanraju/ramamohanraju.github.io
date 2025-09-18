/**
 * Cookie Manager Module
 * Handles cookie operations for testing scenarios
 */

class CookieManager {
    /**
     * Drops a specified number of cookies with unique names and values
     * @param {string} baseName - Base name for cookie naming
     * @param {number} count - Number of cookies to create
     */
    static dropCookies(baseName, count) {
        console.log(`Dropping ${count} cookies for ${baseName}`);

        for (let i = 1; i <= count; i++) {
            const cookieName = `${baseName}-cookie${i}`;
            const cookieValue = `value-${i}-${Date.now()}`;
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

            const cookieString = `${cookieName}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
            document.cookie = cookieString;

            console.log(`Created cookie: ${cookieName}=${cookieValue}`);
        }
    }

    /**
     * Gets all cookies as an object
     * @returns {Object} Object containing all cookies
     */
    static getAllCookies() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = value;
            }
        });
        return cookies;
    }

    /**
     * Gets cookies matching a specific pattern
     * @param {string} pattern - Pattern to match cookie names
     * @returns {Object} Object containing matching cookies
     */
    static getCookiesByPattern(pattern) {
        const allCookies = this.getAllCookies();
        const matchingCookies = {};

        Object.keys(allCookies).forEach(cookieName => {
            if (cookieName.includes(pattern)) {
                matchingCookies[cookieName] = allCookies[cookieName];
            }
        });

        return matchingCookies;
    }

    /**
     * Deletes a cookie by name
     * @param {string} cookieName - Name of cookie to delete
     */
    static deleteCookie(cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        console.log(`Deleted cookie: ${cookieName}`);
    }

    /**
     * Deletes all cookies matching a pattern
     * @param {string} pattern - Pattern to match cookie names for deletion
     */
    static deleteCookiesByPattern(pattern) {
        const matchingCookies = this.getCookiesByPattern(pattern);
        Object.keys(matchingCookies).forEach(cookieName => {
            this.deleteCookie(cookieName);
        });
    }

    /**
     * Creates a privacy-compliant cookie with proper attributes
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {Object} options - Cookie options (expires, secure, sameSite, etc.)
     */
    static createPrivacyCookie(name, value, options = {}) {
        const defaults = {
            expires: 1, // days
            path: '/',
            sameSite: 'Lax',
            secure: location.protocol === 'https:'
        };

        const config = { ...defaults, ...options };

        let cookieString = `${name}=${value}`;

        if (config.expires) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + (config.expires * 24 * 60 * 60 * 1000));
            cookieString += `; expires=${expirationDate.toUTCString()}`;
        }

        if (config.path) {
            cookieString += `; path=${config.path}`;
        }

        if (config.secure) {
            cookieString += `; secure`;
        }

        if (config.sameSite) {
            cookieString += `; SameSite=${config.sameSite}`;
        }

        if (config.httpOnly) {
            cookieString += `; HttpOnly`;
        }

        document.cookie = cookieString;
        console.log(`Created privacy cookie: ${name}=${value}`);
    }
}