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
    addInitialFeedMessage();
});

function addInitialFeedMessage() {
    const feed = document.getElementById('live-feed');
    if (!feed || feed.children.length > 0) return;
    const item = document.createElement('div');
    item.className = 'feed-item';
    const time = document.createElement('div');
    time.className = 'feed-time';
    time.textContent = `⏰ ${new Date().toLocaleTimeString('bn-BD')}`;
    const content = document.createElement('div');
    content.className = 'feed-content';
    content.textContent = '✅ Dashboard is ready';
    item.append(time, content);
    feed.appendChild(item);
}

// Tab Switching
function switchTab(tabName, button) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-hidden', 'true');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (!selectedTab) return;
    selectedTab.classList.add('active');
    selectedTab.setAttribute('aria-hidden', 'false');

    // Add active class to clicked button
    if (button) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
    }
}

// Generate sample feed entries locally every five seconds.
function startLiveDataFeed() {
    setInterval(() => {
        const feed = document.getElementById('live-feed');
        const messages = [
            'Sample activity event generated',
            'Local dashboard preview is active',
            'Demo analytics event refreshed',
            'Sample link activity generated',
            'Demo feed is running locally'
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
        document.getElementById('last-update').textContent = `Demo event · ${timestamp}`;
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

function isValidWebUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

// Render Domains
function renderDomains() {
    const list = document.getElementById('domains-list');
    list.innerHTML = '';

    if (dashboardData.domains.length === 0) {
        showEmptyState(list, 'No domains added yet');
        return;
    }

    dashboardData.domains.forEach((domain, index) => {
        const item = document.createElement('div');
        item.className = 'domain-item';
        const details = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'domain-name';
        name.textContent = `🌐 ${domain}`;
        details.appendChild(name);

        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        const status = document.createElement('span');
        status.className = 'domain-status';
        status.textContent = 'Active';
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn btn-danger';
        removeButton.style.cssText = 'padding: 5px 10px; font-size: 12px;';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeDomain(index));
        actions.append(status, removeButton);
        item.append(details, actions);
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
    if (!isValidWebUrl(url)) {
        alert('Please enter a valid HTTP or HTTPS link');
        document.getElementById('link-url').focus();
        return;
    }
    if (!['normal', 'bad', 'spam'].includes(type)) {
        alert('Please select a valid link type');
        return;
    }

    dashboardData.links.push({
        url: new URL(url).href,
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

    if (dashboardData.links.length === 0) {
        showEmptyState(list, 'No links added yet');
        return;
    }

    dashboardData.links.forEach((link, index) => {
        const item = document.createElement('div');
        item.className = `link-item ${link.type}`;
        const details = document.createElement('div');
        details.className = 'link-details';
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.className = 'link-url';
        anchor.textContent = `🔗 ${link.url}`;
        anchor.addEventListener('click', () => trackClick(link.url, link.type));
        details.appendChild(anchor);
        if (link.comment) {
            const comment = document.createElement('div');
            comment.className = 'link-comment';
            comment.textContent = `💬 ${link.comment}`;
            details.appendChild(comment);
        }

        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        const badge = document.createElement('span');
        badge.className = `link-type-badge ${link.type}`;
        badge.textContent = link.type.toUpperCase();
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'btn btn-danger';
        removeButton.style.cssText = 'padding: 5px 10px; font-size: 12px;';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeLink(index));
        actions.append(badge, removeButton);
        item.append(details, actions);
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

function showEmptyState(container, message) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = message;
    container.appendChild(empty);
}

// Track Click
function trackClick(url, type) {
    if (!isValidWebUrl(url)) return;
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

    if (dashboardData.clicks.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5;
        cell.className = 'empty-state';
        cell.textContent = 'No tracking events yet';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    dashboardData.clicks.forEach(click => {
        const row = document.createElement('tr');
        const timestamp = document.createElement('td');
        timestamp.textContent = click.timestamp.toLocaleTimeString('bn-BD');
        const linkCell = document.createElement('td');
        const anchor = document.createElement('a');
        anchor.href = isValidWebUrl(click.url) ? click.url : '#';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.style.color = '#3498db';
        anchor.textContent = 'Link';
        linkCell.appendChild(anchor);
        const values = [click.deviceType, click.domain, click.ip];
        row.append(timestamp, linkCell);
        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
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
    try {
        const data = JSON.stringify(dashboardData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin-dashboard-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    } catch (error) {
        alert('Unable to export dashboard data.');
        console.error('Failed to export dashboard data:', error);
    }
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

    if (Object.keys(domainCounts).length === 0) {
        showEmptyState(topDomainsDiv, 'No domain clicks yet');
    }

    Object.entries(domainCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([domain, count]) => {
            const item = document.createElement('div');
            item.className = 'top-item';
            const domainName = document.createElement('span');
            domainName.className = 'top-domain';
            domainName.textContent = domain;
            const domainCount = document.createElement('span');
            domainCount.className = 'top-count';
            domainCount.textContent = count;
            item.append(domainName, domainCount);
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
    try {
        const dataToSave = {
            domains: dashboardData.domains,
            links: dashboardData.links,
            clicks: dashboardData.clicks.map(click => {
                const timestamp = click.timestamp instanceof Date
                    ? click.timestamp
                    : new Date(click.timestamp);
                return {
                    ...click,
                    timestamp: Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : timestamp.toISOString()
                };
            }),
            totalClicks: dashboardData.totalClicks,
            mobileClicks: dashboardData.mobileClicks
        };
        localStorage.setItem('adminDashboardData', JSON.stringify(dataToSave));
    } catch (error) {
        alert('Unable to save dashboard data in this browser.');
        console.error('Failed to save dashboard data:', error);
    }
}

function loadDataFromLocalStorage() {
    try {
        const saved = localStorage.getItem('adminDashboardData');
        if (!saved) return;

        const data = JSON.parse(saved);
        dashboardData.domains = Array.isArray(data.domains)
            ? data.domains.filter(domain => typeof domain === 'string')
            : [];
        dashboardData.links = Array.isArray(data.links)
            ? data.links.filter(link =>
                link &&
                typeof link.url === 'string' &&
                isValidWebUrl(link.url) &&
                ['normal', 'bad', 'spam'].includes(link.type)
            ).map(link => ({
                ...link,
                url: new URL(link.url).href,
                comment: typeof link.comment === 'string' ? link.comment : ''
            }))
            : [];
        dashboardData.clicks = Array.isArray(data.clicks)
            ? data.clicks.map(click => {
                const timestamp = new Date(click?.timestamp);
                return {
                    ...click,
                    timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp
                };
            }).filter(click => isValidWebUrl(click.url))
            : [];
        dashboardData.totalClicks = Number.isFinite(data.totalClicks)
            ? data.totalClicks
            : dashboardData.clicks.length;
        dashboardData.mobileClicks = Number.isFinite(data.mobileClicks)
            ? data.mobileClicks
            : dashboardData.clicks.filter(click => click.deviceType === 'Mobile').length;
    } catch (error) {
        console.error('Saved dashboard data is invalid and was reset:', error);
        try {
            localStorage.removeItem('adminDashboardData');
        } catch (storageError) {
            console.error('Failed to clear invalid dashboard data:', storageError);
        }
        dashboardData = {
            domains: [],
            links: [],
            clicks: [],
            totalClicks: 0,
            mobileClicks: 0
        };
    }
}