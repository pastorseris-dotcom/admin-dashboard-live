# Nexus Admin Dashboard

A lightweight, responsive browser dashboard for organizing domains and links, viewing locally recorded link clicks, and exploring basic analytics.

> **Demo only:** This project does not connect to a server or collect real traffic. The activity feed is simulated, domain status is a display label, and IP addresses shown in the click log are randomly generated placeholders.

## Features

- **Overview:** click, domain, link, and mobile-click totals with a simulated activity feed.
- **Domains:** add and remove domain names. Domains are saved locally; they are not monitored or checked.
- **Links:** save HTTP/HTTPS links with a comment and a classification (normal, bad content, or spam).
- **Click tracking:** record a local event when a saved link is opened, including its URL, time, device category, domain, and a fabricated IP placeholder.
- **Analytics:** view a simple mobile-versus-desktop chart and the most-clicked domains.
- **Export and clear:** export dashboard data as JSON or clear the click log.
- **Responsive interface:** layouts adapt to desktop, tablet, and mobile screens.

## Run locally

The app has no runtime package dependencies. Clone the repository and serve the files from a local web server:

```bash
git clone https://github.com/pastorseris-dotcom/admin-dashboard-live.git
cd admin-dashboard-live
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser. You can also open `index.html` directly, but serving the project over HTTP provides a consistent browser origin for local storage.

## Use the dashboard

1. Add domain names in **Domains**. This only saves names in the dashboard; it does not verify ownership or availability.
2. Add an HTTP or HTTPS URL in **Links**, optionally including a comment and classification.
3. Open a saved link to add a click event to the local tracking log.
4. Visit **Tracking** to review or export events, or clear the click log.
5. Visit **Analytics** to see the device breakdown and top domains for locally recorded events.

Dashboard data persists in the current browser's `localStorage`, scoped to the site origin and browser profile. It is not synchronized across devices or users. Clearing browser site data removes it.

## Development and tests

Requires Node.js 20 or later for the test and validation scripts. The dashboard itself does not require Node.js.

```bash
npm run validate
npm test
```

The GitHub Actions workflow runs the validation and test scripts for pushes and pull requests targeting `main`.

## Security and privacy

- This is a front-end demonstration, **not a production admin system**. It has no authentication, authorization, server-side validation, or shared database.
- Do not use it to store secrets, personal information, or other sensitive data. Browser `localStorage` is not encrypted and can be read or changed by the user or by scripts running on the same origin.
- The click-log IP address is fabricated and must not be interpreted as a visitor's real IP. The app does not collect real IP addresses.
- The feed messages are generated locally and are not evidence of server health, backups, synchronization, or domain monitoring.
- Saved links are restricted to HTTP and HTTPS. Links that open in a new tab use `noopener noreferrer`.
- Before any real deployment, add server-side authentication and authorization, validate and persist data on a trusted backend, use HTTPS, and define an appropriate privacy and data-retention policy.

## Project files

- `index.html` — dashboard structure and accessible labels.
- `style.css` — responsive visual design.
- `app.js` — browser-side behavior and local storage.
- `test/project.test.js` — lightweight project integrity checks.
- `.github/workflows/deno.yml` — Node.js CI workflow.
