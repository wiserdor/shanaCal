# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report

Please report security vulnerabilities by emailing the maintainers directly at [security@shanacal.dev] (replace with actual email) or by creating a private security advisory on GitHub.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a security vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any suggested fixes or mitigations
- Your contact information (optional)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: As quickly as possible, typically within 30 days

### Security Considerations

#### Data Privacy

ShanaCal is designed with privacy in mind:

- **Local Storage Only**: All user data (photos, personal dates, customizations) is stored locally in the browser
- **No Server Communication**: The application does not send user data to external servers
- **External APIs**: Only uses Hebcal API for Hebrew calendar data (no user data transmitted)

#### File Handling

- **Client-Side Processing**: All image processing happens in the browser
- **File Validation**: Strict validation of uploaded file types and sizes
- **Memory Management**: Proper cleanup of file objects and canvas elements

#### Input Sanitization

- **User Input**: All user inputs are properly validated and sanitized
- **XSS Prevention**: No user data is rendered as raw HTML
- **File Upload**: Secure handling of uploaded files

### Security Best Practices

#### For Users

- Keep your browser updated
- Use trusted sources for the application
- Be cautious with file uploads
- Clear browser data if needed

#### For Developers

- Follow secure coding practices
- Validate all inputs
- Use HTTPS in production
- Keep dependencies updated
- Implement proper error handling

### Known Security Considerations

#### Browser Limitations

- **File Access**: Limited to user-selected files
- **Local Storage**: Subject to browser storage limits
- **Memory Usage**: Large images may impact browser performance

#### External Dependencies

We use the following external services:

- **Hebcal API**: For Hebrew calendar data (read-only)
- **Google Fonts**: For Hebrew font loading

### Security Updates

Security updates will be:

- Released as patch versions
- Documented in release notes
- Communicated through GitHub releases
- Prioritized over feature development

### Responsible Disclosure

We follow responsible disclosure practices:

1. **Report privately** to maintainers
2. **Allow time** for fixes to be developed
3. **Coordinate release** of fixes and disclosure
4. **Credit researchers** who report vulnerabilities

### Contact

For security-related questions or reports:

- **Email**: [security@shanacal.dev] (replace with actual email)
- **GitHub**: Create a private security advisory
- **Response Time**: Within 48 hours

Thank you for helping keep ShanaCal secure! 🔒
