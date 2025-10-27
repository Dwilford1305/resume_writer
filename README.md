# Resume Writer

An intelligent resume writing application that creates targeted resumes based on job postings. The app uses Playwright to scrape job posting details, your online presence, and combines them with your existing resume to generate a tailored resume for each position.

## Features

- 🎯 **Targeted Resume Generation**: Analyzes job postings to create resumes that match specific requirements
- 🌐 **Web Scraping**: Uses Playwright to gather data from job postings, personal websites, and social profiles
- 📄 **Multiple Input Formats**: Supports both JSON and plain text resume formats
- 🔍 **Skill Matching**: Automatically identifies and highlights relevant skills for the position
- 📊 **Comprehensive Output**: Generates structured resumes with sections tailored to job requirements

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

3. Install Playwright browsers:
```bash
npm run install-browsers
```

## Usage

### Basic Usage

Generate a resume for a specific job posting:

```bash
npm start generate --job-url "https://example.com/job-posting" --resume ./examples/resume.txt
```

### Advanced Usage

Include your websites and social profiles for more comprehensive data:

```bash
npm start generate \
  --job-url "https://example.com/job-posting" \
  --resume ./examples/resume.json \
  --websites "https://myportfolio.com" "https://myblog.com" \
  --social "https://linkedin.com/in/yourprofile" "https://github.com/yourusername" \
  --output ./output/my-targeted-resume.txt
```

### Command Line Options

- `-j, --job-url <url>` (required): URL of the job posting you're applying to
- `-r, --resume <path>`: Path to your current resume (JSON or text format)
- `-w, --websites <urls...>`: Your personal websites or portfolio URLs (space-separated)
- `-s, --social <profiles...>`: Your social profile URLs like LinkedIn, GitHub (space-separated)
- `-o, --output <path>`: Output file path (default: `./output/resume.txt`)

### Examples

Using the example resume files:

```bash
# Using JSON resume
npm start generate \
  --job-url "https://jobs.example.com/position" \
  --resume ./examples/resume.json

# Using text resume with websites
npm start generate \
  --job-url "https://jobs.example.com/position" \
  --resume ./examples/resume.txt \
  --websites "https://mysite.com"

# Complete example with all options
npm start generate \
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
