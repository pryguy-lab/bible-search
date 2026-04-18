const refreshBtn = document.getElementById("refreshBtn");
const autoBtn = document.getElementById("autoBtn");
const statusText = document.getElementById("statusText");
const metaText = document.getElementById("metaText");
const counterRows = document.getElementById("counterRows");

let autoTimer = null;

function renderRows(items) {
  counterRows.textContent = "";

  if (!Array.isArray(items) || items.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.className = "empty";
    cell.textContent = "No active telemetry counters in this window.";
    row.appendChild(cell);
    counterRows.appendChild(row);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("tr");

    const ipCell = document.createElement("td");
    ipCell.textContent = String(item.ip || "unknown");

    const s4Cell = document.createElement("td");
    s4Cell.textContent = String(item.status4xx || 0);

    const s429Cell = document.createElement("td");
    s429Cell.textContent = String(item.status429 || 0);

    const remCell = document.createElement("td");
    remCell.textContent = String(item.remainingMs || 0);

    row.appendChild(ipCell);
    row.appendChild(s4Cell);
    row.appendChild(s429Cell);
    row.appendChild(remCell);

    counterRows.appendChild(row);
  });
}

function setStatus(text, ok) {
  statusText.textContent = text;
  statusText.className = `status ${ok ? "ok" : "bad"}`;
}

async function loadTelemetry() {
  try {
    const response = await fetch("/api/admin/telemetry", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        setStatus(
          "Unauthorized: reverse proxy did not inject x-admin-key.",
          false,
        );
        metaText.textContent =
          "Protect this page at the proxy and inject the secret header server-side only.";
        renderRows([]);
        return;
      }

      if (response.status === 503) {
        setStatus("Admin telemetry is disabled on this server.", false);
        metaText.textContent =
          "Set ADMIN_API_KEY to enable the endpoint, then configure proxy header injection.";
        renderRows([]);
        return;
      }

      setStatus(`Unable to load telemetry (HTTP ${response.status}).`, false);
      metaText.textContent = "Try again in a few seconds.";
      renderRows([]);
      return;
    }

    const payload = await response.json();
    setStatus("Telemetry loaded.", true);
    metaText.textContent = `Mode: ${payload.limiter?.mode || "unknown"}, Generated: ${payload.generatedAt || "n/a"}`;
    renderRows(payload.counters || []);
  } catch (error) {
    setStatus("Network error while loading telemetry.", false);
    metaText.textContent = "Check server availability and proxy configuration.";
    renderRows([]);
  }
}

function toggleAutoRefresh() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
    autoBtn.textContent = "Start Auto Refresh";
    return;
  }

  autoTimer = setInterval(() => {
    loadTelemetry();
  }, 15000);
  autoBtn.textContent = "Stop Auto Refresh";
}

refreshBtn.addEventListener("click", loadTelemetry);
autoBtn.addEventListener("click", toggleAutoRefresh);

loadTelemetry();
