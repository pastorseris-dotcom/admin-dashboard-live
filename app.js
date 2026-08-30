// Data Storage
let dashboardData = {
    domains: [],
    links: [],
    clicks: [],
    totalClicks: 0,
    mobileClicks: 0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromLocalStorage();
    updateStats();
    startLiveDataFeed();
    renderDomains();
    renderLinks();
    renderTracking();
});

// Tab Switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Live Data Feed (Updates Every 5 Seconds)
function startLiveDataFeed() {
    setInterval(() => {
        const feed = document.getElementById('live-feed');
        const messages = [
            '✅ Domain monitored successfully',
            '🔗 New link added to tracking',
            '📊 Analytics data updated',
            '📱 Mobile click detected',
            '🌐 Server health check: OK',
            '🔄 Sync completed',
            '💾 Data backup completed'
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const timestamp = new Date().toLocaleTimeString('bn-BD');

        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <div class="feed-time">⏰ ${timestamp}</div>
            <div class="feed-content">${randomMessage}</div>
        `;

        feed.insertBefore(feedItem, feed.firstChild);

        // Keep only last 20 items
        while (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }

        // Update timestamp
        document.getElementById('last-update').textContent = `Last Update: ${timestamp}`;
    }, 5000);
}

// Add Domain
function addDomain() {
    const input = document.getElementById('domain-input');
    const domain = input.value.trim();

    if (!domain) {
        alert('Please enter a domain name');
        return;
    }

    if (dashboardData.domains.includes(domain)) {
        alert('Domain already exists');
        return;
    }

    dashboardData.domains.push(domain);
    input.value = '';
    renderDomains();
    updateStats();
    saveDataToLocalStorage();
}

// Render Domains
function renderDomains() {
    const list = document.getElementById('domains-list');
    list.innerHTML = '';

    dashboardData.domains.forEach((domain, index) => {
        const item = document.createElement('div');
        item.className = 'domain-item';
        item.innerHTML = `
            <div>
                <div class="domain-name">🌐 ${domain}</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span class="domain-status">Active</span>
                <button onclick="removeDomain(${index})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Remove</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Remove Domain
function removeDomain(index) {
    dashboardData.domains.splice(index, 1);
    renderDomains();
    updateStats();
    saveDataToLocalStorage();
}

// Add Link
function addLink() {
    const url = document.getElementById('link-url').value.trim();
    const comment = document.getElementById('link-comment').value.trim();
    const type = document.getElementById('link-type').value;

    if (!url) {
        alert('Please enter a link URL');
        return;
    }

    dashboardData.links.push({
        url: url,
        comment: comment,
        type: type,
        timestamp: new Date()
    });

    document.getElementById('link-url').value = '';
    document.getElementById('link-comment').value = '';
    document.getElementById('link-type').value = 'normal';

    renderLinks();
    updateStats();
    saveDataToLocalStorage();
}

// Render Links
function renderLinks() {
    const list = document.getElementById('links-list');
    list.innerHTML = '';

    dashboardData.links.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = `link-item ${link.type}`;
        item.innerHTML = `
            <div class="link-details">
                <a href="${link.url}" target="_blank" class="link-url" onclick="trackClick('${link.url}', '${link.type}')">🔗 ${link.url}</a>
                ${link.comment ? `<div class="link-comment">💬 ${link.comment}</div>` : ''}
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span class="link-type-badge ${link.type}">${link.type.toUpperCase()}</span>
                <button onclick="removeLink(${index})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Remove</button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Remove Link
function removeLink(index) {
    dashboardData.links.splice(index, 1);
    renderLinks();
    updateStats();
    saveDataToLocalStorage();
}

// Track Click
function trackClick(url, type) {
    const deviceType = /Mobile|Android|iPhone/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    const domain = new URL(url).hostname;

    dashboardData.clicks.push({
        url: url,
        type: type,
        deviceType: deviceType,
        domain: domain,
        timestamp: new Date(),
        ip: generateRandomIP()
    });

    dashboardData.totalClicks++;
    if (deviceType === 'Mobile') {
        dashboardData.mobileClicks++;
    }

    updateStats();
    renderTracking();
    saveDataToLocalStorage();
}

// Generate Random IP (for demo purposes)
function generateRandomIP() {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// Render Tracking
function renderTracking() {
    const tbody = document.getElementById('tracking-body');
    tbody.innerHTML = '';

    dashboardData.clicks.forEach(click => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${click.timestamp.toLocaleTimeString('bn-BD')}</td>
            <td><a href="${click.url}" target="_blank" style="color: #3498db;">Link</a></td>
            <td>${click.deviceType}</td>
            <td>${click.domain}</td>
            <td>${click.ip}</td>
        `;
        tbody.appendChild(row);
    });
}

// Clear Tracking
function clearTracking() {
    if (confirm('Are you sure you want to clear all tracking data?')) {
        dashboardData.clicks = [];
        dashboardData.totalClicks = 0;
        dashboardData.mobileClicks = 0;
        updateStats();
        renderTracking();
        saveDataToLocalStorage();
    }
}

// Export Tracking
function exportTracking() {
    const data = JSON.stringify(dashboardData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-dashboard-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Update Stats
function updateStats() {
    document.getElementById('total-clicks').textContent = dashboardData.totalClicks;
    document.getElementById('active-domains').textContent = dashboardData.domains.length;
    document.getElementById('total-links').textContent = dashboardData.links.length;
    document.getElementById('mobile-clicks').textContent = dashboardData.mobileClicks;

    // Update analytics
    updateAnalytics();
}

// Update Analytics
function updateAnalytics() {
    // Top Domains
    const domainCounts = {};
    dashboardData.clicks.forEach(click => {
        domainCounts[click.domain] = (domainCounts[click.domain] || 0) + 1;
    });

    const topDomainsDiv = document.getElementById('top-domains');
    topDomainsDiv.innerHTML = '';

    Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([domain, count]) => {
            const item = document.createElement('div');
            item.className = 'top-item';
            item.innerHTML = `
                <span class="top-domain">${domain}</span>
                <span class="top-count">${count}</span>
            `;
            topDomainsDiv.appendChild(item);
        });

    // Device Chart (Simple Bar Chart)
    const deviceCounts = { Mobile: 0, Desktop: 0 };
    dashboardData.clicks.forEach(click => {
        deviceCounts[click.deviceType]++;
    });

    drawSimpleChart(deviceCounts);
}

// Simple Chart Drawing
function drawSimpleChart(data) {
    const canvas = document.getElementById('device-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw simple bar chart
    const entries = Object.entries(data);
    const barWidth = width / (entries.length * 2);
    const maxValue = Math.max(...Object.values(data), 1);

    entries.forEach((entry, index) => {
        const [label, value] = entry;
        const x = 50 + index * width / entries.length;
        const barHeight = (value / maxValue) * (height - 80);

        // Draw bar
        ctx.fillStyle = index === 0 ? '#3498db' : '#27ae60';
        ctx.fillRect(x, height - 50 - barHeight, barWidth, barHeight);

        // Draw label
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x + barWidth / 2, height - 20);

        // Draw value
        ctx.fillText(value, x + barWidth / 2, height - 50 - barHeight - 10);
    });
}

// Local Storage
function saveDataToLocalStorage() {
    const dataToSave = {
        domains: dashboardData.domains,
        links: dashboardData.links,
        clicks: dashboardData.clicks.map(click => ({
            ...click,
            timestamp: click.timestamp.toISOString()
        })),
        totalClicks: dashboardData.totalClicks,
        mobileClicks: dashboardData.mobileClicks
    };
    localStorage.setItem('adminDashboardData', JSON.stringify(dataToSave));
}

function loadDataFromLocalStorage() {
    const saved = localStorage.getItem('adminDashboardData');
    if (saved) {
        const data = JSON.parse(saved);
        dashboardData.domains = data.domains || [];
        dashboardData.links = data.links || [];
        dashboardData.clicks = (data.clicks || []).map(click => ({
            ...click,
            timestamp: new Date(click.timestamp)
        }));
        dashboardData.totalClicks = data.totalClicks || 0;
        dashboardData.mobileClicks = data.mobileClicks || 0;
    }
}