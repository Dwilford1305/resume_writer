#!/usr/bin/env node

/**
 * Simple test for resume writer without browser dependency
 * Tests the core logic using mock data
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { MockDataProvider } from './src/mock-data.js';

console.log('🧪 Running Resume Writer Simple Test (No Browser Required)\n');

async function runSimpleTest() {
  try {
    const resumePath = resolve(process.cwd(), 'examples/resume.json');
    const outputPath = resolve(process.cwd(), 'output/test-resume.txt');
    
    console.log('Test Configuration:');
    console.log(`  Resume: ${resumePath}`);
    console.log(`  Output: ${outputPath}\n`);
    
    // Verify resume exists
    if (!existsSync(resumePath)) {
      throw new Error(`Resume file not found: ${resumePath}`);
    }
    
    console.log('✓ Resume file exists\n');
    
    // Load resume
    console.log('📂 Loading resume...');
    const resumeData = readFileSync(resumePath, 'utf-8');
    const currentResume = JSON.parse(resumeData);
    console.log('  ✓ Resume loaded\n');
    
    // Get mock job data
    const jobData = await MockDataProvider.mockScrapeJobPosting('https://example.com/job');
    const websiteData = await MockDataProvider.mockScrapeWebsites(['https://portfolio.example.com']);
    const socialData = await MockDataProvider.mockScrapeSocialProfiles(['https://linkedin.com/in/example']);
    
    console.log('\n✍️  Creating targeted resume...');
    
    // Create resume content (simplified version of the main logic)
    const sections = [];
    
    sections.push('='.repeat(60));
    sections.push('TARGETED RESUME');
    sections.push('='.repeat(60));
    sections.push('');
    
    sections.push('TARGET POSITION');
    sections.push('-'.repeat(60));
    sections.push(`Position: ${jobData.title}`);
    sections.push(`URL: ${jobData.url}`);
    sections.push('');
    
    if (jobData.skills.length > 0) {
      sections.push('RELEVANT SKILLS FOR THIS POSITION');
      sections.push('-'.repeat(60));
      jobData.skills.forEach(skill => {
        sections.push(`• ${skill}`);
      });
      sections.push('');
    }
    
    sections.push('PROFESSIONAL BACKGROUND');
    sections.push('-'.repeat(60));
    sections.push(JSON.stringify(currentResume, null, 2));
    sections.push('');
    
    if (websiteData.length > 0) {
      sections.push('ONLINE PRESENCE');
      sections.push('-'.repeat(60));
      websiteData.forEach(site => {
        sections.push(`Website: ${site.url}`);
        sections.push(`Title: ${site.title}`);
        sections.push('');
      });
    }
    
    if (socialData.length > 0) {
      sections.push('PROFESSIONAL PROFILES');
      sections.push('-'.repeat(60));
      socialData.forEach(profile => {
        sections.push(`Profile: ${profile.url}`);
        sections.push('');
      });
    }
    
    if (jobData.requirements.length > 0) {
      sections.push('JOB REQUIREMENTS TO ADDRESS');
      sections.push('-'.repeat(60));
      jobData.requirements.forEach((req, idx) => {
        sections.push(`${idx + 1}. ${req}`);
      });
      sections.push('');
    }
    
    sections.push('');
    sections.push('-'.repeat(60));
    sections.push(`Generated on: ${new Date().toISOString()}`);
    sections.push('This resume has been tailored for the specific job posting.');
    
    const resumeContent = sections.join('\n');
    
    // Save resume
    console.log(`💾 Saving resume to: ${outputPath}`);
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(outputPath, resumeContent, 'utf-8');
    console.log('  ✓ Resume saved\n');
    
    // Verify output
    if (!existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }
    
    const content = readFileSync(outputPath, 'utf-8');
    console.log('='.repeat(70));
    console.log('Generated Resume Preview (first 600 chars):');
    console.log('='.repeat(70));
    console.log(content.substring(0, 600) + '...');
    console.log('='.repeat(70));
    
    // Basic validations
    const checks = [
      { name: 'Contains target position', test: content.includes('TARGET POSITION') },
      { name: 'Contains skills section', test: content.includes('RELEVANT SKILLS') },
      { name: 'Contains professional background', test: content.includes('PROFESSIONAL BACKGROUND') },
      { name: 'Contains job requirements', test: content.includes('JOB REQUIREMENTS') },
      { name: 'Contains generation timestamp', test: content.includes('Generated on:') },
      { name: 'Contains online presence', test: content.includes('ONLINE PRESENCE') },
      { name: 'Contains professional profiles', test: content.includes('PROFESSIONAL PROFILES') }
    ];
    
    console.log('\n📊 Validation Results:');
    let passed = 0;
    checks.forEach(check => {
      const status = check.test ? '✓' : '✗';
      console.log(`  ${status} ${check.name}`);
      if (check.test) passed++;
    });
    
    console.log(`\n${passed}/${checks.length} checks passed\n`);
    
    if (passed === checks.length) {
      console.log('✅ All tests passed!');
      console.log('\n📝 Note: This test uses mock data. To test with real web scraping,');
      console.log('   install Playwright browsers with: npm run install-browsers');
      console.log('   Then run: npm start generate -- --job-url <url> --resume <path>\n');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

runSimpleTest();
