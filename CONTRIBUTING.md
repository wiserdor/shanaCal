# Contributing to ShanaCal

Thank you for your interest in contributing to ShanaCal! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Internationalization](#internationalization)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A modern web browser

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/wiserdor/shanacal.git
   cd shanacal
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/original-owner/shanacal.git
   ```

## Development Setup

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Calendar.tsx    # Calendar display component
│   ├── PhotoUpload.tsx # Photo upload and management
│   ├── PersonalDates.tsx # Personal dates management
│   ├── CustomizationPanel.tsx # Theme and layout customization
│   ├── ExportPanel.tsx # PDF export functionality
│   └── StorageIndicator.tsx # Local storage usage indicator
├── services/           # Business logic services
│   ├── hebrewCalendar.ts # Hebrew calendar API integration
│   ├── photoCollage.ts  # Photo collage generation
│   ├── localStorage.ts  # Local storage management
│   └── photoStorage.ts  # Photo storage and compression
├── lib/               # Utility functions
│   └── utils.ts       # Common utilities
├── types/             # TypeScript type definitions
│   └── index.ts       # Interface definitions
└── App.tsx            # Main application component
```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **New features** - Add new functionality
- **Documentation** - Improve or add documentation
- **UI/UX improvements** - Enhance user experience
- **Performance optimizations** - Improve app performance
- **Internationalization** - Add support for new languages
- **Accessibility** - Improve accessibility features

### Before You Start

1. Check existing issues and pull requests to avoid duplicates
2. For major changes, open an issue first to discuss the approach
3. Ensure your changes align with the project's goals

## Pull Request Process

### Creating a Pull Request

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

### Pull Request Guidelines

- **Title**: Use clear, descriptive titles
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Screenshots**: Include screenshots for UI changes
- **Breaking Changes**: Clearly mark any breaking changes

### Commit Message Format

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:

```
feat: add alternating layout option for calendar pages
fix: resolve photo collage not showing more than 6 photos
docs: update README with new installation instructions
```

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node.js version
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Any other relevant information

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type - use specific types
- Use type-only imports when appropriate: `import type { ... }`

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Use shadcn/ui components when possible
- Maintain RTL (right-to-left) support for Hebrew

### Code Style

- Use ESLint configuration provided
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

### Manual Testing

Before submitting a PR, please test:

- [ ] All existing functionality still works
- [ ] New features work as expected
- [ ] No console errors or warnings
- [ ] Responsive design on different screen sizes
- [ ] Hebrew text displays correctly
- [ ] PDF export works properly

### Testing Checklist

- [ ] Photo upload and collage generation
- [ ] Personal dates management
- [ ] Customization options
- [ ] PDF export functionality
- [ ] Local storage persistence
- [ ] Hebrew calendar integration

## Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props and interfaces
- Update README.md for significant changes
- Keep inline comments concise and helpful

### User Documentation

- Update user-facing documentation
- Add screenshots for new features
- Maintain Hebrew and English documentation
- Keep installation instructions current

## Internationalization

### Hebrew Support

- All user-facing text should be in Hebrew
- Maintain RTL (right-to-left) layout support
- Use proper Hebrew fonts (Noto Sans Hebrew)
- Test Hebrew text rendering and layout

### Adding New Languages

If you want to add support for new languages:

1. Create a new language file in `src/locales/`
2. Update the language switcher component
3. Test RTL support if applicable
4. Update documentation

## Performance Considerations

### Image Processing

- Optimize image compression and resizing
- Implement proper memory management
- Use Web Workers for heavy computations if needed
- Cache processed images when possible

### PDF Generation

- Optimize PDF generation performance
- Implement progress indicators for long operations
- Handle large numbers of photos efficiently
- Provide fallbacks for memory constraints

## Security

### Data Privacy

- All data is stored locally in the browser
- No data is sent to external servers (except Hebcal API)
- Implement proper input validation
- Sanitize user inputs

### File Handling

- Validate file types and sizes
- Implement proper error handling
- Prevent XSS attacks in user inputs
- Use secure file processing methods

## Getting Help

### Community

- Join our discussions in GitHub Issues
- Ask questions in the Q&A section
- Share your use cases and feedback

### Maintainers

- Tag maintainers for urgent issues
- Use appropriate labels for issues
- Be patient - we're volunteers!

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to ShanaCal! 🎉

---

## Quick Start for Contributors

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Start development**: `npm run dev`
4. **Make changes** and test thoroughly
5. **Submit a PR** with clear description
6. **Respond to feedback** and iterate

Happy coding! 🚀
