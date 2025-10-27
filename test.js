#!/usr/bin/env node

/**
 * Integration test for resume writer
 * Tests the application with local example files
 */

import { ResumeWriter } from './src/resume-writer.js';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

console.log('🧪 Starting Resume Writer Integration Test\n');

async function runTest() {
  const resumeWriter = new ResumeWriter();
  
  try {
    // Use a file:// URL for the local sample job posting
    const sampleJobPath = resolve(process.cwd(), 'examples/sample-job.html');
    const jobUrl = `file://${sampleJobPath}`;
    const resumePath = resolve(process.cwd(), 'examples/resume.json');
    const outputPath = resolve(process.cwd(), 'output/test-resume.txt');
    
    console.log('Test Configuration:');
    console.log(`  Job URL: ${jobUrl}`);
    console.log(`  Resume: ${resumePath}`);
    console.log(`  Output: ${outputPath}\n`);
    
    // Verify files exist
    if (!existsSync(sampleJobPath)) {
      throw new Error(`Sample job file not found: ${sampleJobPath}`);
    }
    if (!existsSync(resumePath)) {
      throw new Error(`Resume file not found: ${resumePath}`);
    }
    
    console.log('✓ All input files exist\n');
    
    // Run the generator
    const inputData = {
      jobUrl,
      resumePath,
      websites: [],
      socialProfiles: []
    };
    
    const result = await resumeWriter.generate(inputData, outputPath);
    
    // Verify output
    if (!existsSync(outputPath)) {
      throw new Error('Output file was not created');
    }
    
    const content = readFileSync(outputPath, 'utf-8');
    console.log('\n' + '='.repeat(70));
    console.log('Generated Resume Preview (first 500 chars):');
    console.log('='.repeat(70));
    console.log(content.substring(0, 500) + '...');
    console.log('='.repeat(70));
    
    // Basic validations
    const checks = [
      { name: 'Contains target position', test: content.includes('TARGET POSITION') },
      { name: 'Contains skills section', test: content.includes('RELEVANT SKILLS') },
      { name: 'Contains professional background', test: content.includes('PROFESSIONAL BACKGROUND') },
      { name: 'Contains job requirements', test: content.includes('JOB REQUIREMENTS') },
      { name: 'Contains generation timestamp', test: content.includes('Generated on:') }
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

runTest();
