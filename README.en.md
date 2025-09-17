# ShanaCal - Hebrew Personal Calendar Creator

Create beautiful Hebrew personal calendars with photo collages, personal dates, and Hebrew holidays. Export to high-quality PDF for printing.

## Features

### 📸 Photo Management

- Upload multiple photos
- Automatic collage generation for each month
- Support for JPG, PNG, GIF formats
- Automatic image processing and resizing
- Unlimited photos per collage (previously limited to 6)

### 📅 Hebrew Calendar

- 14 months (September 2025 - October 2026)
- Hebrew and Israeli holidays
- Hebrew and Gregorian dates
- Full Hebrew language support
- Traditional Hebrew year format (e.g., תשפ״ה)

### 🎨 Customization

- Choose background and text colors
- Select Hebrew fonts
- Preset color themes
- Real-time preview
- Alternating layout options

### 📝 Personal Dates

- Add birthdays
- Add anniversaries
- Add personal holidays
- Custom descriptions

### 💾 Data Persistence

- Local storage for all data
- Automatic saving
- No server communication
- Privacy-focused

### 🖨️ PDF Export

- A3 format for printing
- High quality (300+ DPI)
- Landscape orientation
- 14 pages (one month per page)
- Professional layout

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/shanacal.git
   cd shanacal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

## Usage

### 1. Upload Photos

- Click "בחר תמונות" (Choose Photos) or drag photos to upload area
- Upload at least 14 photos (one for each month)
- Photos will be automatically arranged in beautiful collages

### 2. Add Personal Dates

- Click "הוסף תאריך חדש" (Add New Date)
- Fill in details: title, date, type
- Dates will appear in the calendar with special marking

### 3. Customize

- Choose background and text colors
- Select Hebrew font
- Use preset color themes
- Preview changes in real-time
- Enable alternating layouts for visual variety

### 4. Preview

- Navigate between different months
- Check collages and dates
- Make additional adjustments if needed

### 5. Export PDF

- Click "ייצא ל-PDF" (Export to PDF)
- Wait for process to complete
- File will download automatically

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **PDF Generation**: jsPDF + html2canvas
- **Hebrew Calendar**: Hebcal API
- **Image Processing**: HTML5 Canvas
- **UI Components**: shadcn/ui

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Calendar.tsx    # Calendar display
│   ├── PhotoUpload.tsx # Photo management
│   ├── PersonalDates.tsx # Personal dates
│   ├── CustomizationPanel.tsx # Customization
│   ├── ExportPanel.tsx # PDF export
│   └── StorageIndicator.tsx # Storage usage
├── services/           # Business logic
│   ├── hebrewCalendar.ts # Hebrew calendar API
│   ├── photoCollage.ts  # Collage generation
│   ├── localStorage.ts  # Local storage
│   └── photoStorage.ts  # Photo storage
├── lib/               # Utilities
│   └── utils.ts       # Common functions
├── types/             # TypeScript types
│   └── index.ts       # Interfaces
└── App.tsx            # Main component
```

## External APIs

The application uses Hebcal API for Hebrew calendar information:

- **URL**: https://www.hebcal.com/hebcal
- **Features**: Holidays, fasts, new moons
- **Fallback**: Prepared data in case of failure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For questions and support:

- Open an issue on GitHub
- Check the documentation
- Review the FAQ

## Roadmap

### Version 0.2.0 (Planned)

- [ ] Additional collage layouts
- [ ] More customization options
- [ ] Export to other formats (PNG, JPG)
- [ ] Calendar sharing features

### Version 0.3.0 (Planned)

- [ ] Multi-language support
- [ ] Cloud storage integration
- [ ] Calendar templates
- [ ] Advanced printing options

### Version 1.0.0 (Planned)

- [ ] Full feature set
- [ ] Performance optimizations
- [ ] Comprehensive testing
- [ ] Production-ready stability

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Security

See [SECURITY.md](SECURITY.md) for security policies and reporting.

---

**ShanaCal** - Create beautiful Hebrew personal calendars with photos and holidays
