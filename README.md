# Privacy & Consent Management Testing Hub

A professional, production-grade testing environment for data privacy compliance, consent management frameworks, and regulatory testing scenarios.

## Project Structure

```
├── assets/
│   ├── css/
│   │   └── main.css              # Main stylesheet with all UI components
│   └── js/
│       ├── cookie-manager.js     # Cookie operations and management
│       ├── ui-manager.js         # UI interactions and feedback
│       ├── page-manager.js       # Dynamic page generation
│       ├── use-case-handler.js   # URL pattern detection and routing
│       └── main.js               # Application entry point and coordination
├── pages/
│   └── *.html                    # Generated test pages for scanning scenarios
├── templates/
│   └── test-page-template.html   # Template for dynamic page generation
├── data/                         # Data files for testing
└── index.html                    # Main homepage
```

## Features

### Dynamic Use Cases

#### 1. Cookie Scanning
- **Pattern**: `/scan-{number}-cookies`
- **Example**: `https://ramamohanraju.github.io/scan-10-cookies`
- **Behavior**: Drops the specified number of cookies with unique names and values

#### 2. Page Scanning
- **Pattern**: `/scan-{number}-pages`
- **Example**: `https://ramamohanraju.github.io/scan-10-pages`
- **Behavior**: Creates a multi-page navigation with each page dropping 2 cookies

#### 3. Privacy Compliance Testing
- **GDPR**: `/gdpr-test` - Sets GDPR consent preferences
- **CCPA**: `/ccpa-test` - Activates CCPA opt-out signals
- **IAB TCF**: `/iab-tcf-test` - Configures IAB Transparency & Consent Framework

### Static Reference Tools

The homepage also provides links to existing HTML testing tools:
- IAB TCF demo
- IAB US National privacy demo
- Various consent forms
- CloudFlare integration demos

## Technical Architecture

### Modular JavaScript Design
- **Separation of Concerns**: Each module handles a specific domain (cookies, UI, pages, etc.)
- **Class-based Architecture**: Modern ES6+ classes for better organization
- **Event-driven Communication**: Modules communicate through events and callbacks
- **Global Functions**: Strategic global functions for template compatibility

### CSS Architecture
- **Modern CSS**: Flexbox and Grid layouts
- **Custom Properties**: CSS variables for theming
- **Responsive Design**: Mobile-first approach with breakpoints
- **Component-based**: Modular CSS classes for reusability

### HTML Structure
- **Semantic Markup**: Proper HTML5 semantic elements
- **Accessibility**: ARIA labels and keyboard navigation support
- **SEO Optimized**: Proper meta tags and structured content
- **Template System**: Reusable HTML templates for dynamic content

## Usage Examples

### Cookie Testing
```
https://ramamohanraju.github.io/scan-5-cookies
→ Drops 5 cookies: scan-5-cookies-cookie1, scan-5-cookies-cookie2, etc.
```

### Page Testing
```
https://ramamohanraju.github.io/scan-3-pages
→ Creates navigation to 3 pages, each dropping 2 cookies
→ Total potential cookies: 6 (2 per page)
```

### Privacy Compliance
```
https://ramamohanraju.github.io/gdpr-test
→ Sets localStorage: gdpr-consent with consent preferences
```

## Development Guidelines

### Adding New Use Cases
1. Add pattern detection in `use-case-handler.js`
2. Create handler method for the new use case
3. Update documentation in `index.html`
4. Add CSS styles if needed in `main.css`

### Creating New Pages
1. Use `templates/test-page-template.html` as a base
2. Replace placeholder variables: `{{USE_CASE}}`, `{{PAGE_NUMBER}}`, etc.
3. Ensure all asset paths are correct (`../assets/`)
4. Test cookie dropping functionality

### Styling Guidelines
- Follow BEM methodology for CSS classes
- Use CSS custom properties for theming
- Maintain consistent spacing scale (0.25rem increments)
- Ensure accessibility compliance (WCAG 2.1 AA)

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## Privacy & Security

- **No External Dependencies**: All assets are local
- **No Tracking**: No analytics or third-party scripts
- **Temporary Cookies**: All test cookies expire within 24 hours
- **Clear Documentation**: Transparent about all data operations
- **User Control**: Easy clearing of test data

## License

This testing environment is designed for educational and compliance testing purposes only. All generated data is temporary and should not be used in production environments.