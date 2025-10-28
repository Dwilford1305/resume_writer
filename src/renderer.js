// DOM Elements
const jobUrlInput = document.getElementById('jobUrl');
const resumePathInput = document.getElementById('resumePath');
const websitesInput = document.getElementById('websites');
const socialProfilesInput = document.getElementById('socialProfiles');
const outputPathInput = document.getElementById('outputPath');

const selectResumeBtn = document.getElementById('selectResumeBtn');
const selectOutputBtn = document.getElementById('selectOutputBtn');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');

const progressPanel = document.getElementById('progressPanel');
const resultPanel = document.getElementById('resultPanel');
const welcomePanel = document.getElementById('welcomePanel');
const progressMessages = document.getElementById('progressMessages');
const resultContent = document.getElementById('resultContent');

// Modal Elements
const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');

// Set default output path
outputPathInput.value = './output/resume.txt';

// Modal Functions
function showModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  customModal.classList.add('show');
}

function hideModal() {
  customModal.classList.remove('show');
}

// Event Listeners

// Modal OK button
modalOkBtn.addEventListener('click', hideModal);

// Close modal on background click
customModal.addEventListener('click', (e) => {
  if (e.target === customModal) {
    hideModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && customModal.classList.contains('show')) {
    hideModal();
  }
});

selectResumeBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectResumeFile();
  if (filePath) {
    resumePathInput.value = filePath;
  }
});

selectOutputBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectOutputFile();
  if (filePath) {
    outputPathInput.value = filePath;
  }
});

generateBtn.addEventListener('click', async () => {
  await generateResume();
});

clearBtn.addEventListener('click', () => {
  jobUrlInput.value = '';
  resumePathInput.value = '';
  websitesInput.value = '';
  socialProfilesInput.value = '';
  outputPathInput.value = './output/resume.txt';
  
  hideAllPanels();
  welcomePanel.style.display = 'block';
});

// Listen for progress updates
window.electronAPI.onGenerationProgress((message) => {
  addProgressMessage(message);
});

// Functions

function hideAllPanels() {
  progressPanel.style.display = 'none';
  resultPanel.style.display = 'none';
  welcomePanel.style.display = 'none';
}

function addProgressMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'progress-message';
  messageDiv.textContent = message;
  progressMessages.appendChild(messageDiv);
  
  // Auto-scroll to bottom
  progressMessages.scrollTop = progressMessages.scrollHeight;
}

function showProgress() {
  hideAllPanels();
  progressMessages.innerHTML = '';
  progressPanel.style.display = 'block';
}

function showResult(success, data) {
  progressPanel.style.display = 'none';
  resultPanel.style.display = 'block';
  
  if (success) {
    resultContent.innerHTML = `
      <div class="success-message">
        <h4>✅ ${data.message}</h4>
      </div>
      <div class="info-item">
        <strong>Output Path:</strong> ${data.outputPath}
      </div>
      ${data.jobData ? `
        <div class="info-item">
          <strong>Job Title:</strong> ${data.jobData.title || 'Not detected'}
        </div>
        <div class="info-item">
          <strong>Skills Found:</strong> ${data.jobData.skills?.length || 0}
        </div>
        <div class="info-item">
          <strong>Requirements:</strong> ${data.jobData.requirements?.length || 0}
        </div>
      ` : ''}
      <div style="margin-top: 20px;">
        <small>Your targeted resume has been saved. You can now review and customize it further.</small>
      </div>
    `;
  } else {
    resultContent.innerHTML = `
      <div class="error-message">
        <h4>❌ Generation Failed</h4>
        <p>${data.message || 'An unknown error occurred'}</p>
      </div>
    `;
  }
}

async function generateResume() {
  // Validate required fields
  if (!jobUrlInput.value.trim()) {
    showModal('Validation Error', 'Please enter a job posting URL');
    jobUrlInput.focus();
    return;
  }

  // Validate URL format
  try {
    new URL(jobUrlInput.value.trim());
  } catch (e) {
    showModal('Validation Error', 'Please enter a valid URL');
    jobUrlInput.focus();
    return;
  }

  // Parse URLs from text areas (one per line)
  const websites = websitesInput.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  const socialProfiles = socialProfilesInput.value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  // Prepare input data
  const inputData = {
    jobUrl: jobUrlInput.value.trim(),
    resumePath: resumePathInput.value.trim() || null,
    websites: websites,
    socialProfiles: socialProfiles,
    outputPath: outputPathInput.value.trim() || './output/resume.txt'
  };

  // Show progress
  showProgress();
  generateBtn.disabled = true;

  try {
    // Call the main process to generate resume
    const result = await window.electronAPI.generateResume(inputData);
    
    // Show result
    showResult(result.success, result);
  } catch (error) {
    showResult(false, { message: error.message || 'An unexpected error occurred' });
  } finally {
    generateBtn.disabled = false;
  }
}

// Handle Enter key in job URL input
jobUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    generateResume();
  }
});
