import { chromium } from '@playwright/test';

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    console.log(`PAGE EXCEPTION: ${err.message}`);
  });

  console.log("Navigating to admin...");
  await page.goto("http://localhost:3000/admin");

  // Login
  console.log("Logging in...");
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', "asadkathia10@gmail.com");
  await page.fill('input[name="password"]', "asadkathia18");
  await page.click('button[type="submit"]');

  await page.waitForURL('**/admin');
  console.log("Logged in successfully.");

  // Navigate to pages
  await page.goto("http://localhost:3000/admin/collections/pages");
  console.log("Waiting for Pages list...");
  
  // Find "services-convert" and click it
  await page.waitForSelector('text="services-convert"', { timeout: 10000 });
  await page.click('text="services-convert"');
  
  console.log("Waiting for the page editor to load...");
  await page.waitForURL('**/admin/collections/pages/*');
  
  // See if there are runtime errors on load
  await page.waitForTimeout(3000); 
  console.log("Editor loaded.");

  // We need to click a bound converted text node.
  // The editor should have an iframe (Live Preview)
  const previewIframe = await page.$('iframe[title="Live Preview"], iframe');
  if (!previewIframe) {
     console.log("No iframe found!");
  } else {
     console.log("Iframe found! Interacting with it...");
     const frame = await previewIframe.contentFrame();
     if (frame) {
         // wait for content to render
         await frame.waitForLoadState('networkidle');
         console.log("Iframe network idle.");
         
         // try finding a text node
         // Maybe click something like "hero title" or similar
         const title = await frame.$('h1, h2, [data-editor-node]');
         if (title) {
             console.log("Found an element in preview. Clicking it...");
             await title.click();
             
             // Wait for inspector in parent
             await page.waitForTimeout(2000);
             
             // Check if inspector shows anything (e.g. data-editor-node, or semantic tag, etc)
             const inspectorText = await page.evaluate(() => document.body.innerText);
             if (inspectorText.includes("Style") || inspectorText.includes("Tag") || inspectorText.includes("Path")) {
                 console.log("Inspector panel seems to show semantic/style controls.");
             } else {
                 console.log("Could not find style/tag info in inspector text. Maybe not selected?");
             }
         } else {
             console.log("Could not find editable node in iframe.");
         }
     }
  }

  // Reload editor page
  console.log("Reloading editor page to check persistence (without saving just testing reload)...");
  await page.reload();
  await page.waitForTimeout(3000);
  console.log("Reload successful. No crashes (hopefully).");
  
  await browser.close();
  console.log("DONE");
})().catch(e => {
  console.error("Test script failed", e);
  process.exit(1);
});
