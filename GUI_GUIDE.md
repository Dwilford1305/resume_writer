# Resume Writer GUI Guide

This guide explains how to use the Resume Writer graphical user interface (GUI).

## Launching the GUI

Start the application with:

```bash
npm start
```

The application window will open with a modern, user-friendly interface.

## Interface Overview

The GUI is divided into two main sections:

### Left Panel: Input Configuration
This is where you provide all the information needed to generate your resume.

### Right Panel: Status & Output
This shows the generation progress and results.

## Step-by-Step Guide

### 1. Enter Job Posting URL (Required)

- In the **Job Posting URL** field, paste the URL of the job you're applying to
- Example: `https://company.com/careers/senior-developer`
- This field is required - the application will analyze this job posting

### 2. Select Your Current Resume (Optional)

- Click the **Browse...** button next to "Current Resume"
- Select your resume file (can be `.json` or `.txt` format)
- See the examples folder for format references
- While optional, providing a resume gives much better results

### 3. Add Personal Websites (Optional)

- In the **Personal Websites** text area, add URLs of your portfolio, blog, or personal sites
- Enter one URL per line
- Example:
  ```
  https://myportfolio.com
  https://myblog.dev
  ```

### 4. Add Social Profiles (Optional)

- In the **Social Profiles** text area, add your professional social media URLs
- Enter one URL per line
- Example:
  ```
  https://linkedin.com/in/yourname
  https://github.com/yourusername
  ```

### 5. Choose Output Location (Optional)

- Click the **Browse...** button next to "Output File"
- Choose where you want to save the generated resume
- Default: `./output/resume.txt`

### 6. Generate the Resume

- Click the **Generate Resume** button
- The right panel will switch to show:
  - A spinner indicating work is in progress
  - Real-time progress messages as each step completes
  - Messages like "Scraping job posting...", "Creating targeted resume...", etc.

### 7. Review the Results

After generation completes, you'll see:

- ✅ Success message with the output file path
- Job information detected (title, skills found, requirements)
- A reminder to review and customize the generated resume

If there's an error:
- ❌ Error message explaining what went wrong
- You can fix the issue and try again

## Features

### File Browsing
- Use native file dialogs to select files
- Filters show only relevant file types
- No need to type file paths manually

### Real-Time Progress
- See exactly what the application is doing
- Progress messages update as each step completes
- Know when web scraping is happening

### Form Validation
- Required fields are marked with an asterisk (*)
- The app validates your input before starting
- Helpful error messages guide you

### Clear Form
- Click the **Clear Form** button to reset all fields
- Useful when generating multiple resumes

## Tips for Best Results

### 1. Use the JSON Resume Format
Create a structured resume file in JSON format (see `examples/resume.json`):
- Easier for the app to parse
- Better skill matching
- More comprehensive output

### 2. Include All Your URLs
The more information you provide:
- Your websites
- GitHub profile
- LinkedIn profile
- Personal blog

The better the application can tailor your resume.

### 3. Check the Job URL
- Make sure the URL is accessible
- Some sites may block automated access
- Try opening the URL in your browser first

### 4. Review the Generated Resume
The output is a starting point:
- Open the generated file and review it
- Customize and refine as needed
- Add specific examples and achievements
- Adjust formatting for your target format (PDF, DOCX, etc.)

## Keyboard Shortcuts

- **Enter** in the Job URL field: Starts generation
- **Tab**: Navigate between fields

## Common Issues

### "Job URL is required"
- You must enter a job posting URL before generating

### "Please enter a valid URL"
- Check that your URL starts with `http://` or `https://`
- Make sure there are no spaces or typos

### Generation Fails
- Check your internet connection
- Verify the job URL is accessible
- Some websites may block automated scraping
- Check the error message for specific details

### Browser Not Installed
- Run: `npm run install-browsers`
- This installs Chromium for web scraping

## Output Format

The generated resume is a text file (`.txt`) containing:

1. **Target Position** - The job you're applying to
2. **Relevant Skills** - Skills matching the job requirements
3. **Professional Background** - Your resume content
4. **Online Presence** - Information from your websites
5. **Professional Profiles** - Your social media presence
6. **Job Requirements** - Key requirements from the job posting

You can convert this to other formats:
- Copy into Microsoft Word or Google Docs
- Use online text-to-PDF converters
- Format in your preferred resume template

## Switching to CLI

If you prefer the command line, you can use:

```bash
npm run start:cli generate [options]
```

See the main [README.md](README.md) for CLI usage details.

Both GUI and CLI use the same underlying logic and produce identical results.

## Getting Help

If you encounter issues:

1. Check this guide
2. Review the main [README.md](README.md)
3. Check [USAGE.md](USAGE.md) for advanced usage
4. Open an issue on GitHub

## Feedback

We'd love to hear your feedback on the GUI:
- Feature requests
- Bug reports
- Usability suggestions
- Design improvements

Please open an issue on GitHub to share your thoughts!
