# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Alternating layout option for calendar pages
- Support for unlimited photos in collages (previously limited to 6)
- Dynamic collage height based on number of photos
- Professional collage generation with improved layouts
- Hebrew holiday names from API (Hebrew language support)
- Local storage persistence for all user data
- Mobile-responsive navigation
- Storage usage indicator
- Image fit mode options (cover/contain)

### Changed

- Improved PDF export quality and page size
- Enhanced collage visual quality with shadows and borders
- Better photo distribution across months
- Optimized image processing and compression
- Updated Hebrew calendar integration
- Improved error handling and user feedback

### Fixed

- Fixed color customization not working in PDF export
- Fixed collage images not showing more than 6 photos
- Fixed event text cutoff in PDF calendar
- Fixed Hebrew year display in traditional format
- Fixed image aspect ratio preservation
- Fixed calendar layout issues on mobile
- Fixed duplicate month titles in PDF
- Fixed photo distribution algorithm

## [0.1.0] - 2024-12-XX

### Added

- Initial release of ShanaCal
- Hebrew personal calendar creation
- Photo collage generation
- Personal dates management
- PDF export functionality
- Hebrew calendar integration
- Customization options (colors, fonts, layouts)
- Local storage for project persistence
- Responsive design
- RTL (right-to-left) support for Hebrew

### Features

- **Photo Management**: Upload and organize photos for calendar
- **Collage Generation**: Automatic collage creation for each month
- **Hebrew Calendar**: 14-month calendar (September 2025 - October 2026)
- **Personal Dates**: Add birthdays, anniversaries, and custom events
- **Customization**: Choose colors, fonts, and layouts
- **PDF Export**: High-quality A3 PDF for printing
- **Local Storage**: Automatic saving of all user data
- **Hebrew Support**: Full Hebrew language interface and calendar

### Technical Stack

- React 18 + TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- jsPDF + html2canvas for PDF generation
- Hebcal API for Hebrew calendar data
- HTML5 Canvas for image processing
- shadcn/ui for UI components

---

## Version History

### Version 0.1.0

- **Release Date**: December 2024
- **Status**: Initial Release
- **Features**: Core functionality for Hebrew personal calendar creation

### Future Versions

#### Version 0.2.0 (Planned)

- [ ] Additional collage layouts
- [ ] More customization options
- [ ] Export to other formats (PNG, JPG)
- [ ] Calendar sharing features
- [ ] Advanced photo editing tools

#### Version 0.3.0 (Planned)

- [ ] Multi-language support
- [ ] Cloud storage integration
- [ ] Calendar templates
- [ ] Advanced printing options
- [ ] Mobile app version

#### Version 1.0.0 (Planned)

- [ ] Full feature set
- [ ] Performance optimizations
- [ ] Comprehensive testing
- [ ] Production-ready stability

---

## Migration Guide

### From Version 0.0.x to 0.1.0

This is the initial release, so no migration is needed.

### Breaking Changes

None in version 0.1.0 (initial release).

### Deprecations

None in version 0.1.0 (initial release).

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for information on contributing to this project.

## Support

For support and questions:

- Open an issue on GitHub
- Check the documentation
- Review the FAQ section

---

**Note**: This changelog follows [Keep a Changelog](https://keepachangelog.com/) format and uses [Semantic Versioning](https://semver.org/).
