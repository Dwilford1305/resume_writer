#!/usr/bin/env node

/**
 * Basic GUI test - verifies that the Electron app can launch
 */

import { spawn } from 'child_process';
import { setTimeout as sleep } from 'timers/promises';

console.log('🧪 Running GUI Launch Test\n');

async function testGUILaunch() {
  try {
    console.log('Starting Electron app...');
    
    // Launch Electron in a subprocess
    const electronProcess = spawn('npx', ['electron', '.'], {
      cwd: process.cwd(),
      env: { ...process.env, DEBUG: 'false' }
    });

    let output = '';
    
    electronProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`[Electron stdout] ${data.toString().trim()}`);
    });

    electronProcess.stderr.on('data', (data) => {
      output += data.toString();
      console.log(`[Electron stderr] ${data.toString().trim()}`);
    });

    // Wait for app to start
    console.log('Waiting for app to initialize...');
    await sleep(5000);

    // Check if process is still running
    if (electronProcess.exitCode === null) {
      console.log('✅ Electron app launched successfully!');
      console.log('Note: This is a headless environment, so GUI cannot be displayed.');
      console.log('      The test verified that Electron can start without errors.\n');
      
      // Kill the process
      electronProcess.kill('SIGTERM');
      await sleep(1000);
      
      if (electronProcess.exitCode === null) {
        electronProcess.kill('SIGKILL');
      }
      
      console.log('✅ GUI Launch Test Passed');
      process.exit(0);
    } else {
      throw new Error(`Electron process exited with code ${electronProcess.exitCode}`);
    }
  } catch (error) {
    console.error('❌ GUI Launch Test Failed:', error.message);
    process.exit(1);
  }
}

testGUILaunch();
