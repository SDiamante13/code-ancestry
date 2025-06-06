const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to http://localhost:3000...');
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the page
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('Response status:', response.status());
    
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a moment for any JS to execute
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check if styles are loaded
    const hasStyles = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      return computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
             computedStyle.color !== 'rgb(0, 0, 0)' ||
             document.head.querySelector('style') !== null ||
             document.head.querySelector('link[rel="stylesheet"]') !== null;
    });
    
    console.log('Styles appear to be loaded:', hasStyles);
    
    // Check for Next.js errors in the DOM
    const nextErrors = await page.evaluate(() => {
      const errorOverlay = document.querySelector('[data-nextjs-error-overlay]');
      const errorDialog = document.querySelector('[data-nextjs-dialog]');
      const errorText = document.querySelector('[data-nextjs-error-text]');
      
      if (errorOverlay || errorDialog || errorText) {
        return {
          hasError: true,
          errorText: errorText ? errorText.textContent : 'Error overlay detected'
        };
      }
      
      // Check for error text in body
      const bodyText = document.body.textContent;
      if (bodyText.includes('Error:') || bodyText.includes('Module not found') || bodyText.includes('Cannot resolve')) {
        return {
          hasError: true,
          errorText: bodyText.substring(0, 500)
        };
      }
      
      return { hasError: false };
    });
    
    if (nextErrors.hasError) {
      console.log('❌ Next.js errors detected:');
      console.log(nextErrors.errorText);
    } else {
      console.log('✅ No Next.js errors detected');
    }
    
    // Get page content
    const bodyText = await page.evaluate(() => document.body.textContent);
    console.log('Page content preview:', bodyText.substring(0, 200) + '...');
    
    // Check for specific elements
    const elements = await page.evaluate(() => {
      return {
        hasMainHeading: !!document.querySelector('h1'),
        hasNavigation: !!document.querySelector('nav') || !!document.querySelector('[role="navigation"]'),
        hasButtons: document.querySelectorAll('button').length,
        hasImages: document.querySelectorAll('img').length,
        hasLinks: document.querySelectorAll('a').length
      };
    });
    
    console.log('Page elements:', elements);
    
    // Take a screenshot
    await page.screenshot({ 
      path: '/Users/stevendiamante/personal/code-ancestry/ui-screenshot.png',
      fullPage: true 
    });
    console.log('Screenshot saved as ui-screenshot.png');
    
    // Log any console errors that occurred
    if (errors.length > 0) {
      console.log('❌ Console errors detected:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ No console errors detected');
    }
    
  } catch (error) {
    console.error('❌ Error loading page:', error.message);
  } finally {
    await browser.close();
  }
})();