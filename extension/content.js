const DB_ID = "1d2babb7-b15e-4417-b1d0-bed78766cfa9";
const API_URL = `https://baget.ai/api/public/databases/${DB_ID}/rows`;

async function initPatternScout() {
  const currentUrl = window.location.href;
  
  try {
    const response = await fetch(API_URL);
    const rows = await response.json();
    
    // Filter patterns for current domain
    const sitePatterns = rows.filter(row => currentUrl.includes(row.site_url) || currentUrl.includes(row.site_name.toLowerCase().replace(/\s/g, '')));

    if (sitePatterns.length > 0) {
      console.log(`[PatternScout] Detected ${sitePatterns.length} patterns for this site.`);
      sitePatterns.forEach(pattern => applyHighlight(pattern));
    }
  } catch (error) {
    console.error("[PatternScout] Failed to fetch patterns:", error);
  }
}

function applyHighlight(pattern) {
  // Prototype logic: Look for common elements related to the pattern type
  // In a real version, we would use specific CSS selectors stored in the DB.
  let selector = "";
  
  if (pattern.pattern_type === "False Urgency") {
    selector = "[id*='timer'], [class*='timer'], [id*='countdown'], [class*='countdown']";
  } else if (pattern.pattern_type === "Sneak into Basket") {
    selector = "input[type='checkbox'], .addon-checkbox, #protection-plan";
  }

  if (selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add("ps-pattern-detected");
      
      // Create Tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "ps-integrity-tooltip";
      tooltip.innerHTML = `
        <strong>PatternScout Alert: ${pattern.pattern_type}</strong><br/>
        <span>Severity: ${pattern.severity}</span><br/>
        <p>${pattern.description}</p>
        <button class="ps-report-btn">Report to FTC</button>
      `;
      
      el.parentElement.style.position = "relative";
      el.appendChild(tooltip);
    });
  }
}

// Run on load
if (document.readyState === "complete") {
  initPatternScout();
} else {
  window.addEventListener("load", initPatternScout);
}
