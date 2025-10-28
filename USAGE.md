# Resume Writer Usage Guide

This guide provides detailed instructions on how to use the Resume Writer application.

## Choosing Your Interface

Resume Writer offers two interfaces:

### 🖥️ Graphical User Interface (GUI)
- **Recommended for most users**
- Easy-to-use visual interface
- Real-time progress updates
- File browsing dialogs
- No command line knowledge needed

Launch with: `npm start`

**For detailed GUI instructions, see [GUI_GUIDE.md](GUI_GUIDE.md)**

### 💻 Command Line Interface (CLI)
- For advanced users
- Scriptable and automatable
- Faster for repetitive tasks
- Better for remote/headless environments

Launch with: `npm run start:cli generate [options]`

**The rest of this guide covers CLI usage.**

---

## CLI Quick Start

### 1. Basic CLI Usage (No Additional Data)

Generate a resume using only your existing resume and a job posting URL:

```bash
npm run start:cli generate \
  --job-url "https://example.com/careers/position" \
  --resume ./examples/resume.txt
```

### 2. Advanced CLI Usage (With Online Presence)

Include your websites and social profiles for a more comprehensive resume:

```bash
npm run start:cli generate \
  --job-url "https://example.com/careers/position" \
  --resume ./examples/resume.json \
  --websites "https://myportfolio.com" \
  --social "https://linkedin.com/in/yourname" "https://github.com/yourname"
```

## CLI Command Reference

### Generate Command

```
npm run start:cli generate [options]
```

#### Required Options

- `-j, --job-url <url>` - URL of the job posting you're applying to

#### Optional Options

- `-r, --resume <path>` - Path to your current resume file (JSON or text). While technically optional, providing a resume is highly recommended for meaningful results.
- `-w, --websites <urls...>` - Space-separated list of personal website URLs
- `-s, --social <profiles...>` - Space-separated list of social profile URLs
- `-o, --output <path>` - Output file path (default: `./output/resume.txt`)

## Input File Formats

### Resume Files

The application accepts two formats:

#### JSON Format (Recommended)

Create a structured JSON file with your professional information:

```json
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "phone": "+1-234-567-8900",
  "location": "City, State",
  "summary": "Professional summary...",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "YYYY-MM",
      "endDate": "Present",
      "responsibilities": [
        "Responsibility 1",
        "Responsibility 2"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "school": "School Name",
      "location": "Location",
      "graduationDate": "YYYY"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"]
}
```

See `examples/resume.json` for a complete example.

#### Text Format

A plain text resume with any formatting you prefer:

```
YOUR NAME
Email | Phone | Location

SUMMARY
Your professional summary...

EXPERIENCE
Job Title | Company | Dates
• Responsibility 1
• Responsibility 2

EDUCATION
Degree | School | Year

SKILLS
Skill 1, Skill 2, Skill 3
```

See `examples/resume.txt` for an example.

## Real-World CLI Examples

### Example 1: Software Developer Position

```bash
npm run start:cli generate \
  --job-url "https://jobs.techcompany.com/senior-developer" \
  --resume ./my-resume.json \
  --websites "https://myportfolio.dev" \
  --social "https://github.com/myusername" \
  --output ./output/techcompany-resume.txt
```

### Example 2: Product Manager Role

```bash
npm run start:cli generate \
  --job-url "https://careers.startup.io/product-manager" \
  --resume ./my-resume.txt \
  --websites "https://myblog.com" "https://myprojects.com" \
  --social "https://linkedin.com/in/myprofile" \
  --output ./output/startup-pm-resume.txt
```

### Example 3: Minimal (Job URL Only)

```bash
npm run start:cli generate \
  --job-url "https://company.com/jobs/position-123"
```

## Understanding the Output

The generated resume includes:

1. **Target Position** - Information about the job you're applying to
2. **Relevant Skills** - Skills from the job posting that you should emphasize
3. **Professional Background** - Your current resume content
4. **Online Presence** - Information from your personal websites (if provided)
5. **Professional Profiles** - Your social profiles (if provided)
6. **Job Requirements** - Specific requirements from the job posting to address

## Tips for Best Results

### 1. Use Structured Resume Data

JSON format provides better structure and allows the application to understand your experience better.

### 2. Include All Relevant URLs

Add your GitHub, LinkedIn, portfolio, and any other professional online presence to give the application more context.

### 3. Keep Your Resume Updated

Make sure your input resume file is up-to-date with your latest experience and skills.

### 4. Review and Customize

The generated resume is a starting point. Always review and customize it further to ensure accuracy and impact.

### 5. Use for Multiple Applications (CLI)

Generate different targeted resumes for different positions:

```bash
# For Company A
npm run start:cli generate \
  --job-url "https://companyA.com/job" \
  --resume ./resume.json \
  --output ./output/companyA-resume.txt

# For Company B
npm run start:cli generate \
  --job-url "https://companyB.com/job" \
  --resume ./resume.json \
  --output ./output/companyB-resume.txt
```

**GUI Tip:** The GUI makes this even easier - just change the job URL and output path, then click Generate again!

## Troubleshooting

### Problem: "Browser not installed" Error

**Solution:** Run the browser installation command:
```bash
npm run install-browsers
```

### Problem: Cannot Access Job URL

**Solution:** Some websites block automated access. Try:
1. Make sure the URL is publicly accessible
2. Check if the site requires authentication
3. For testing core functionality without web scraping, use: `npm test` (Note: This validates the resume generation logic using mock data, not actual web scraping)

### Problem: Generated Resume Missing Information

**Solution:** 
1. Check that your input resume file is properly formatted
2. Ensure the job URL is accessible
3. Verify that website and social profile URLs are correct

## Advanced Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Enable debug logging
DEBUG=true

# Browser settings
HEADLESS=true
BROWSER_TIMEOUT=30000
```

### Custom Output Formatting

The application generates plain text output. To convert to other formats:

- **PDF**: Use a text-to-PDF converter or copy-paste into a document editor
- **Word**: Copy the text into Microsoft Word and format as needed
- **HTML**: Write a custom formatter (contribution welcome!)

## Getting Help

If you encounter issues:

1. **GUI Users:** Check the [GUI_GUIDE.md](GUI_GUIDE.md) for GUI-specific help
2. **CLI Users:** Check this usage guide for command-line help
3. Review the main [README.md](README.md)
4. Run tests to verify installation: `npm test`
5. Open an issue on GitHub with details about your problem

## Switching Between GUI and CLI

You can use both interfaces interchangeably:

- **GUI to CLI:** Same features, just different interface
- **CLI to GUI:** Run `npm start` instead of `npm run start:cli`
- **Files are compatible:** Resumes and output work the same way

Choose the interface that best fits your workflow!

## Contributing

Want to improve the Resume Writer? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

Ideas for contributions:
- Additional output formats (PDF, DOCX, HTML)
- Better skill matching algorithms
- Resume templates
- AI-powered content suggestions
- Support for more job sites
