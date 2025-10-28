#!/usr/bin/env node

import { Command } from 'commander';
import { ResumeWriter } from './resume-writer.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
);

program
  .name('resume-writer')
  .description('Generate targeted resumes based on job postings')
  .version(packageJson.version);

program
  .command('generate')
  .description('Generate a targeted resume for a job posting')
  .requiredOption('-j, --job-url <url>', 'URL of the job posting')
  .option('-r, --resume <path>', 'Path to your current resume (text or JSON)')
  .option('-w, --websites <urls...>', 'Your personal websites or portfolio URLs')
  .option('-s, --social <profiles...>', 'Your social profile URLs (LinkedIn, GitHub, etc.)')
  .option('-o, --output <path>', 'Output file path for the generated resume', './output/resume.txt')
  .action(async (options) => {
    try {
      console.log('🚀 Starting Resume Writer...\n');
      
      const resumeWriter = new ResumeWriter();
      
      // Validate inputs
      if (options.resume && !existsSync(options.resume)) {
        console.error(`❌ Error: Resume file not found at ${options.resume}`);
        process.exit(1);
      }
      
      // Prepare input data
      const inputData = {
        jobUrl: options.jobUrl,
        resumePath: options.resume,
        websites: options.websites || [],
        socialProfiles: options.social || []
      };
      
      console.log('📋 Configuration:');
      console.log(`  Job URL: ${inputData.jobUrl}`);
      console.log(`  Current Resume: ${inputData.resumePath || 'None provided'}`);
      console.log(`  Websites: ${inputData.websites.join(', ') || 'None provided'}`);
      console.log(`  Social Profiles: ${inputData.socialProfiles.join(', ') || 'None provided'}`);
      console.log(`  Output: ${options.output}\n`);
      
      // Generate the resume
      const result = await resumeWriter.generate(inputData, options.output);
      
      console.log('\n✅ Resume generated successfully!');
      console.log(`📄 Output saved to: ${result.outputPath}`);
      
    } catch (error) {
      console.error('❌ Error generating resume:', error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
