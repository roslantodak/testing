// Font Awesome for social icons
var fa = document.createElement("script");
fa.src = "https://kit.fontawesome.com/4b8b6e8e2a.js";
fa.crossOrigin = "anonymous";
document.head.appendChild(fa);

// --- Visitor tracking with backend ---
fetch("https://ipapi.co/json/")
  .then(res => res.json())
  .then(data => {
    // Send visitor info to backend
    fetch("/save-visitor", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ip: data.ip,
        country: data.country_name,
        datetime: new Date().toISOString()
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        console.log("Visitor saved successfully");
        loadVisitors(); // Reload visitor list
      }
    })
    .catch(error => console.error("Error saving visitor:", error));
  })
  .catch(error => console.error("Error getting IP info:", error));

// --- Load and display visitor statistics ---
function loadVisitors() {
  fetch("/api/visitors")
    .then(res => res.json())
    .then(visitors => {
      const visitorList = document.getElementById("visitorList");
      
      if (visitors.length === 0) {
        visitorList.innerHTML = "<div class=\"no-visitors\">No visitors recorded yet.</div>";
        return;
      }
      
      let tableHTML = "<table class=\"visitor-table\">";
      tableHTML += "<thead><tr><th>IP Address</th><th>Country</th><th>Date & Time</th></tr></thead>";
      tableHTML += "<tbody>";
      
      visitors.forEach(visitor => {
        const date = new Date(visitor.datetime).toLocaleString();
        tableHTML += `<tr>
          <td>${visitor.ip}</td>
          <td>${visitor.country}</td>
          <td>${date}</td>
        </tr>`;
      });
      
      tableHTML += "</tbody></table>";
      visitorList.innerHTML = tableHTML;
    })
    .catch(error => {
      console.error("Error loading visitors:", error);
      document.getElementById("visitorList").innerHTML = 
        "<div class=\"no-visitors\">Error loading visitor data.</div>";
    });
}

// Load visitors when page loads
document.addEventListener("DOMContentLoaded", loadVisitors);
