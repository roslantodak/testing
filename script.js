// Font Awesome for social icons
var fa = document.createElement("script");
fa.src = "https://kit.fontawesome.com/4b8b6e8e2a.js";
fa.crossOrigin = "anonymous";
document.head.appendChild(fa);

// --- Supabase Config ---
const supabaseUrl = 'https://akiopcfdbgmbypxoszco.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraW9wY2ZkYmdtYnlweG9zemNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjI5MTgsImV4cCI6MjA2NzA5ODkxOH0.xLiGkvi8iNm2OLuxMhPVoGDdD-ec_Egl7KLYTo8jVUY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- Insert Visitor using ipinfo.io ---
fetch('https://ipinfo.io/json')
  .then(res => res.json())
  .then(data => {
    supabase
      .from('visitors')
      .insert([
        {
          ip: data.ip || '-',
          country_code: data.country || '-',
          datetime: new Date().toISOString()
        }
      ])
      .then(response => {
        loadVisitors(); // Refresh visitor list
      });
  });

// --- Helper: Convert country code to flag emoji ---
function countryCodeToFlagEmoji(code) {
  if (!code || code === '-') return '🏳️';
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

// --- Load and display visitor statistics ---
function loadVisitors() {
  supabase
    .from('visitors')
    .select('*')
    .order('datetime', { ascending: false })
    .then(({ data, error }) => {
      const visitorList = document.getElementById("visitorList");
      
      if (error || !data || data.length === 0) {
        visitorList.innerHTML = "<div class=\"no-visitors\">No visitors recorded yet.</div>";
        return;
      }
      
      let tableHTML = "<table class=\"visitor-table\">";
      tableHTML += "<thead><tr><th>IP Address</th><th>Country</th><th>Date & Time</th></tr></thead>";
      tableHTML += "<tbody>";
      
      data.forEach(visitor => {
        const date = new Date(visitor.datetime).toLocaleString();
        const flag = countryCodeToFlagEmoji(visitor.country_code);
        tableHTML += `<tr>
          <td>${visitor.ip || '-'}</td>
          <td style=\"font-size:1.5em;\">${flag}</td>
          <td>${date}</td>
        </tr>`;
      });
      
      tableHTML += "</tbody></table>";
      // Add total visitor count
      visitorList.innerHTML = `<div style=\"margin-bottom:10px;font-weight:bold;\">Total Visitors: ${data.length}</div>` + tableHTML;
    })
    .catch(error => {
      console.error("Error loading visitors:", error);
      document.getElementById("visitorList").innerHTML = 
        "<div class=\"no-visitors\">Error loading visitor data.</div>";
    });
}

// Load visitors when page loads
document.addEventListener("DOMContentLoaded", loadVisitors);
