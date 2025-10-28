/**
 * Mock data provider for testing without browser
 */

export class MockDataProvider {
  /**
   * Mock job posting scraping
   */
  static async mockScrapeJobPosting(url) {
    console.log(`📄 [MOCK] Scraping job posting from: ${url}`);
    
    // Return mock data for testing
    return {
      title: 'Senior Full Stack Developer - Tech Corp',
      url: url,
      requirements: [
        '5+ years of experience in full-stack development',
        'Strong proficiency in JavaScript and TypeScript',
        'Experience with React and Node.js',
        'Knowledge of RESTful APIs and microservices architecture',
        'Experience with SQL and MongoDB databases',
        'Familiarity with Docker and Kubernetes',
        'Experience with AWS or other cloud platforms',
        'Strong understanding of CI/CD pipelines'
      ],
      skills: [
        'javascript',
        'typescript',
        'react',
        'node.js',
        'sql',
        'mongodb',
        'docker',
        'kubernetes',
        'aws',
        'ci/cd',
        'microservices'
      ],
      description: 'We are seeking an experienced Senior Full Stack Developer to join our growing team. This role will be responsible for developing and maintaining our web applications.'
    };
  }

  /**
   * Mock website scraping
   */
  static async mockScrapeWebsites(urls) {
    console.log(`🌍 [MOCK] Scraping ${urls.length} website(s)...`);
    
    return urls.map(url => ({
      title: 'Portfolio Website',
      url: url,
      text: 'Sample portfolio content showcasing projects and skills.'
    }));
  }

  /**
   * Mock social profile scraping
   */
  static async mockScrapeSocialProfiles(urls) {
    console.log(`👤 [MOCK] Scraping ${urls.length} social profile(s)...`);
    
    return urls.map(url => ({
      title: 'Professional Profile',
      url: url,
      text: 'Sample social profile content.'
    }));
  }
}
