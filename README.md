# Resume Writer

An intelligent resume writing application that creates targeted resumes based on job postings. The app features both a **modern graphical user interface (GUI)** and a **command-line interface (CLI)**, using Playwright to scrape job posting details, your online presence, and combines them with your existing resume to generate a tailored resume for each position.

## Features

- 🖥️ **Dual Interface**: Beautiful GUI built with Electron and full-featured CLI
- 🎯 **Targeted Resume Generation**: Analyzes job postings to create resumes that match specific requirements
- 🌐 **Web Scraping**: Uses Playwright to gather data from job postings, personal websites, and social profiles
- 📄 **Multiple Input Formats**: Supports both JSON and plain text resume formats
- 🔍 **Skill Matching**: Automatically identifies and highlights relevant skills for the position
- 📊 **Comprehensive Output**: Generates structured resumes with sections tailored to job requirements
- 👥 **User-Friendly**: GUI makes it accessible for non-technical users

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Dwilford1305/resume_writer.git
cd resume_writer
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (required for web scraping):
```bash
npm run install-browsers
```

**Note:** If the browser installation fails, you can still test the application using mock data (see Testing section below).

## Usage

The Resume Writer offers two ways to use the application:

### 🖥️ GUI Application (Recommended)

Launch the graphical user interface for the easiest experience:

```bash
npm start
```

This opens a window where you can:
1. Enter the job posting URL
2. Browse and select your resume file
3. Add your personal websites and social profiles
4. Choose where to save the output
5. Click "Generate Resume" and watch the progress in real-time

The GUI is perfect for users who prefer a visual interface and want to see the generation progress.

### 💻 Command Line Interface (CLI)

For advanced users and automation, use the CLI:

#### Basic CLI Usage

Generate a resume for a specific job posting:

```bash
npm run start:cli generate --job-url "https://example.com/job-posting" --resume ./examples/resume.txt
```

#### Advanced CLI Usage

Include your websites and social profiles for more comprehensive data:

```bash
npm run start:cli generate \
  --job-url "https://example.com/job-posting" \
  --resume ./examples/resume.json \
  --websites "https://myportfolio.com" "https://myblog.com" \
  --social "https://linkedin.com/in/yourprofile" "https://github.com/yourusername" \
  --output ./output/my-targeted-resume.txt
```

### Command Line Options (CLI)

- `-j, --job-url <url>` (required): URL of the job posting you're applying to
- `-r, --resume <path>`: Path to your current resume (JSON or text format)
- `-w, --websites <urls...>`: Your personal websites or portfolio URLs (space-separated)
- `-s, --social <profiles...>`: Your social profile URLs like LinkedIn, GitHub (space-separated)
- `-o, --output <path>`: Output file path (default: `./output/resume.txt`)

### Examples

#### GUI Examples

Simply run `npm start` and fill in the form with:
- Job URL: `https://jobs.example.com/position`
- Resume: Browse to select `./examples/resume.json`
- Websites: Add any portfolio URLs (one per line)
- Social Profiles: Add LinkedIn, GitHub URLs (one per line)
- Click "Generate Resume"

#### CLI Examples

Using the example resume files:

```bash
# Using JSON resume
npm run start:cli generate \
  --job-url "https://jobs.example.com/position" \
  --resume ./examples/resume.json

# Using text resume with websites
npm run start:cli generate \
  --job-url "https://jobs.example.com/position" \
  --resume ./examples/resume.txt \
  --websites "https://mysite.com"

# Complete example with all options
npm run start:cli generate \
  --job-url "https://jobs.example.com/senior-developer" \
  --resume ./examples/resume.json \
  --websites "https://portfolio.example.com" \
  --social "https://linkedin.com/in/johndoe" "https://github.com/johndoe" \
  --output ./output/senior-dev-resume.txt
```

## Input Formats

### Resume Files

The application supports two resume formats:

**JSON Format** (see `examples/resume.json`):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "summary": "...",
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

**Text Format** (see `examples/resume.txt`):
Plain text resume with your information formatted as you prefer.

## How It Works

1. **Job Analysis**: Scrapes the job posting URL to extract requirements, skills, and job details
2. **Data Gathering**: Optionally scrapes your websites and social profiles for additional context
3. **Resume Loading**: Loads your existing resume from the provided file
4. **Intelligent Matching**: Identifies skills and requirements that match the job posting
5. **Resume Generation**: Creates a targeted resume highlighting relevant experience and skills
6. **Output**: Saves the generated resume to the specified output path

## Output

The generated resume includes:
- Target position information
- Relevant skills matching the job posting
- Your professional background from existing resume
- Online presence (websites)
- Professional profiles (LinkedIn, GitHub, etc.)
- Job requirements to address
- Generation timestamp

## Environment Variables

Optional environment variables can be set in a `.env` file:

```bash
DEBUG=true              # Enable debug logging
HEADLESS=true          # Run browser in headless mode (default)
BROWSER_TIMEOUT=30000  # Browser timeout in milliseconds
```

## Requirements

- Node.js 14 or higher
- npm or yarn
- Chromium browser (installed via Playwright)

## Development

To contribute or modify the application:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Testing

The project includes two types of tests:

### Simple Test (No Browser Required)
Run basic tests using mock data:
```bash
npm test
```

This test validates the core resume generation logic without requiring browser installation.

### Integration Test (Requires Browsers)
Run full integration tests with real web scraping:
```bash
npm run test:integration
```

**Note:** Integration tests require Playwright browsers to be installed first.

## Troubleshooting

### Browser Installation Issues

If Playwright browser installation fails, try:
```bash
npx playwright install chromium --force
```

### Network Errors

Some websites may block automated scraping. The application will continue and generate a resume with available data.

## License

ISC

## Author

Created with ❤️ for job seekers everywhere
