import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export class ResumeWriter {
  constructor() {
    this.browser = null;
  }

  /**
   * Generate a targeted resume based on job posting and applicant data
   */
  async generate(inputData, outputPath) {
    try {
      // Initialize browser
      await this.initBrowser();

      // Gather data from various sources
      const jobData = await this.scrapeJobPosting(inputData.jobUrl);
      const currentResume = inputData.resumePath ? this.loadResume(inputData.resumePath) : null;
      const websiteData = await this.scrapeWebsites(inputData.websites);
      const socialData = await this.scrapeSocialProfiles(inputData.socialProfiles);

      // Combine all data
      const applicantData = {
        currentResume,
        websites: websiteData,
        social: socialData
      };

      // Generate targeted resume
      const targetedResume = this.createTargetedResume(jobData, applicantData);

      // Save to file
      this.saveResume(targetedResume, outputPath);

      return {
        success: true,
        outputPath,
        jobData,
        applicantData
      };
    } finally {
      await this.closeBrowser();
    }
  }

  /**
   * Initialize Playwright browser
   */
  async initBrowser() {
    console.log('🌐 Initializing browser...');
    this.browser = await chromium.launch({
      headless: true
    });
  }

  /**
   * Close the browser
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Scrape job posting data
   */
  async scrapeJobPosting(url) {
    console.log(`📄 Scraping job posting from: ${url}`);
    
    const page = await this.browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Extract job information
      const jobData = await page.evaluate(() => {
        // Try to extract common job posting elements
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.textContent.trim() : '';
        };

        const getAllText = (selector) => {
          const els = document.querySelectorAll(selector);
          return Array.from(els).map(el => el.textContent.trim());
        };

        // Get the entire page text content
        const bodyText = document.body.innerText;

        return {
          title: document.title,
          url: window.location.href,
          bodyText: bodyText,
          // Try to extract structured data
          headings: getAllText('h1, h2, h3'),
          paragraphs: getAllText('p')
        };
      });

      // Extract key information from the job posting
      const extracted = this.extractJobRequirements(jobData);
      
      console.log(`  ✓ Job title: ${extracted.title || 'Not found'}`);
      console.log(`  ✓ Found ${extracted.requirements.length} requirement keywords`);
      
      return extracted;
    } catch (error) {
      console.error(`  ✗ Error scraping job posting: ${error.message}`);
      return {
        title: 'Unknown Position',
        url,
        requirements: [],
        skills: [],
        description: ''
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Extract job requirements from scraped data
   */
  extractJobRequirements(jobData) {
    const text = jobData.bodyText.toLowerCase();
    
    // Common skill keywords to look for
    const skillKeywords = [
      'javascript', 'python', 'java', 'react', 'node.js', 'nodejs', 'angular', 'vue',
      'typescript', 'c++', 'c#', 'ruby', 'php', 'go', 'rust', 'swift', 'kotlin',
      'sql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'azure',
      'gcp', 'git', 'ci/cd', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
      'machine learning', 'ai', 'data science', 'frontend', 'backend', 'full-stack',
      'devops', 'cloud', 'linux', 'testing', 'tdd', 'security'
    ];

    const foundSkills = skillKeywords.filter(skill => 
      text.includes(skill.toLowerCase())
    );

    // Extract requirements (simple heuristic)
    const requirements = [];
    const lines = jobData.bodyText.split('\n');
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (
        (lower.includes('required') || lower.includes('must have') || 
         lower.includes('experience') || lower.includes('knowledge')) &&
        line.length < 200
      ) {
        requirements.push(line.trim());
      }
    });

    return {
      title: jobData.title,
      url: jobData.url,
      requirements: requirements.slice(0, 10), // Limit to top 10
      skills: foundSkills,
      description: jobData.bodyText.substring(0, 1000) // First 1000 chars
    };
  }

  /**
   * Scrape personal websites
   */
  async scrapeWebsites(urls) {
    console.log(`🌍 Scraping ${urls.length} website(s)...`);
    
    const results = [];
    for (const url of urls) {
      const page = await this.browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const data = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            text: document.body.innerText.substring(0, 2000)
          };
        });
        
        results.push(data);
        console.log(`  ✓ Scraped: ${url}`);
      } catch (error) {
        console.error(`  ✗ Error scraping ${url}: ${error.message}`);
        results.push({ url, error: error.message });
      } finally {
        await page.close();
      }
    }
    
    return results;
  }

  /**
   * Scrape social profiles
   */
  async scrapeSocialProfiles(urls) {
    console.log(`👤 Scraping ${urls.length} social profile(s)...`);
    
    const results = [];
    for (const url of urls) {
      const page = await this.browser.newPage();
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        const data = await page.evaluate(() => {
          return {
            title: document.title,
            url: window.location.href,
            text: document.body.innerText.substring(0, 2000)
          };
        });
        
        results.push(data);
        console.log(`  ✓ Scraped: ${url}`);
      } catch (error) {
        console.error(`  ✗ Error scraping ${url}: ${error.message}`);
        results.push({ url, error: error.message });
      } finally {
        await page.close();
      }
    }
    
    return results;
  }

  /**
   * Load existing resume from file
   */
  loadResume(path) {
    console.log(`📂 Loading resume from: ${path}`);
    try {
      const content = readFileSync(path, 'utf-8');
      
      // Try to parse as JSON first
      try {
        const json = JSON.parse(content);
        console.log('  ✓ Loaded JSON resume');
        return json;
      } catch {
        // If not JSON, treat as plain text
        console.log('  ✓ Loaded text resume');
        return { text: content };
      }
    } catch (error) {
      console.error(`  ✗ Error loading resume: ${error.message}`);
      return null;
    }
  }

  /**
   * Create a targeted resume based on job requirements and applicant data
   */
  createTargetedResume(jobData, applicantData) {
    console.log('✍️  Creating targeted resume...');
    
    const sections = [];
    
    // Header
    sections.push('=' .repeat(60));
    sections.push('TARGETED RESUME');
    sections.push('=' .repeat(60));
    sections.push('');
    
    // Job Information
    sections.push('TARGET POSITION');
    sections.push('-'.repeat(60));
    sections.push(`Position: ${jobData.title}`);
    sections.push(`URL: ${jobData.url}`);
    sections.push('');
    
    // Key Skills Matching Job Requirements
    if (jobData.skills.length > 0) {
      sections.push('RELEVANT SKILLS FOR THIS POSITION');
      sections.push('-'.repeat(60));
      jobData.skills.forEach(skill => {
        sections.push(`• ${skill}`);
      });
      sections.push('');
    }
    
    // Current Resume Content
    if (applicantData.currentResume) {
      sections.push('PROFESSIONAL BACKGROUND');
      sections.push('-'.repeat(60));
      if (applicantData.currentResume.text) {
        sections.push(applicantData.currentResume.text);
      } else {
        // If structured resume data
        sections.push(JSON.stringify(applicantData.currentResume, null, 2));
      }
      sections.push('');
    }
    
    // Website Information
    if (applicantData.websites.length > 0) {
      sections.push('ONLINE PRESENCE');
      sections.push('-'.repeat(60));
      applicantData.websites.forEach(site => {
        if (!site.error) {
          sections.push(`Website: ${site.url}`);
          sections.push(`Title: ${site.title}`);
          sections.push('');
        }
      });
    }
    
    // Social Profiles
    if (applicantData.social.length > 0) {
      sections.push('PROFESSIONAL PROFILES');
      sections.push('-'.repeat(60));
      applicantData.social.forEach(profile => {
        if (!profile.error) {
          sections.push(`Profile: ${profile.url}`);
          sections.push('');
        }
      });
    }
    
    // Job Requirements Match
    if (jobData.requirements.length > 0) {
      sections.push('JOB REQUIREMENTS TO ADDRESS');
      sections.push('-'.repeat(60));
      jobData.requirements.forEach((req, idx) => {
        sections.push(`${idx + 1}. ${req}`);
      });
      sections.push('');
    }
    
    // Footer
    sections.push('');
    sections.push('-'.repeat(60));
    sections.push(`Generated on: ${new Date().toISOString()}`);
    sections.push('This resume has been tailored for the specific job posting.');
    sections.push('Please review and customize further as needed.');
    
    return sections.join('\n');
  }

  /**
   * Save resume to file
   */
  saveResume(content, outputPath) {
    console.log(`💾 Saving resume to: ${outputPath}`);
    
    // Ensure output directory exists
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(outputPath, content, 'utf-8');
    console.log('  ✓ Resume saved successfully');
  }
}
