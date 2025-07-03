// Font Awesome for social icons
var fa = document.createElement('script');
fa.src = "https://kit.fontawesome.com/4b8b6e8e2a.js";
fa.crossOrigin = "anonymous";
document.head.appendChild(fa);

// --- Visitor tracking (requires backend) ---
fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => {
    // Send visitor info to backend (Node.js/Express required)
    fetch('/save-visitor', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        ip: data.ip,
        country: data.country_name,
        datetime: new Date().toISOString()
      })
    });
  });
// Note: You need a backend (e.g. Node.js/Express) to handle /save-visitor and write to visitors.json

// --- Load and display visitor statistics ---
function loadVisitors() {
  fetch('visitors.json')
    .then(res => res.json())
    .then(visitors => {
      const visitorList = document.getElementById('visitorList');
      
      if (visitors.length === 0) {
        visitorList.innerHTML = '<div class="no-visitors">No visitors recorded yet.</div>';
        return;
      }
      
      let tableHTML = '<table class="visitor-table">';
      tableHTML += '<thead><tr><th>IP Address</th><th>Country</th><th>Date & Time</th></tr></thead>';
      tableHTML += '<tbody>';
      
      visitors.forEach(visitor => {
        const date = new Date(visitor.datetime).toLocaleString();
        tableHTML += `<tr>
          <td>${visitor.ip}</td>
          <td>${visitor.country}</td>
          <td>${date}</td>
        </tr>`;
      });
      
      tableHTML += '</tbody></table>';
      visitorList.innerHTML = tableHTML;
    })
    .catch(error => {
      console.error('Error loading visitors:', error);
      document.getElementById('visitorList').innerHTML = 
        '<div class="no-visitors">Error loading visitor data.</div>';
    });
}

// Load visitors when page loads
document.addEventListener('DOMContentLoaded', loadVisitors); 