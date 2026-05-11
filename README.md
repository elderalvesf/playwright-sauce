# qa-playwright-ts-pom

[![E2E Tests — Playwright](https://github.com/elderalvesf/qa-playwright-ts-pom/actions/workflows/ci.yml/badge.svg)](https://github.com/elderalvesf/qa-playwright-ts-pom/actions/workflows/ci.yml)

Professional E2E test automation framework using **Playwright v1.40+**, **TypeScript**, **Page Object Model**, and **Playwright Fixtures** — testing [SauceDemo](https://www.saucedemo.com) across Chromium, Firefox and WebKit.

> Part of a public QA portfolio series. [Projeto 1](https://github.com/elderalvesf/qa-webdriverio-js-pom) uses WebDriverIO + JavaScript on the same app — intentionally — to demonstrate the architectural and ergonomic differences between frameworks.

---

## Tech Stack

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Allure](https://img.shields.io/badge/Allure-FE5C5C?style=for-the-badge&logo=qameta&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

---

## Prerequisites

- Node.js 18+
- npm

---

## Getting Started

```bash
git clone https://github.com/elderalvesf/qa-playwright-ts-pom.git
cd qa-playwright-ts-pom
npm ci
npx playwright install
npm test
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm test` | Run all tests across all browsers |
| `npm run test:chromium` | Run tests in Chromium only |
| `npm run test:firefox` | Run tests in Firefox only |
| `npm run test:webkit` | Run tests in WebKit (Safari) only |
| `npm run test:login` | Run login test suite only |
| `npm run test:inventory` | Run inventory test suite only |
| `npm run test:cart` | Run cart test suite only |
| `npm run test:checkout` | Run checkout test suite only |
| `npm run test:headed` | Run tests with browser visible |
| `npm run report:pw` | Open Playwright HTML Report |
| `npm run report:allure` | Generate and open Allure Report |
| `npm run trace` | Open Playwright Trace Viewer |

---

## Browsers

Tests run across three browser engines natively:

| Browser | Engine |
|---|---|
| Chromium | Blink |
| Firefox | Gecko |
| WebKit | WebKit (Safari) |

---

## Test Coverage

| Suite | Test Cases |
|---|---|
| **Login** | Valid login, invalid password, locked user, empty fields, logout |
| **Inventory** | Product count, sort by price, sort by name, add to cart, remove from cart |
| **Cart** | Add product, verify quantity, remove product, continue shopping |
| **Checkout** | Full E2E flow, missing first/last name, missing zip, order summary |

---

## Reports

### Playwright HTML Report
```bash
npm run report:pw
```
Includes screenshots, videos and traces for every failed test. Zero configuration required.

### Allure Report
```bash
npm run report:allure
```
Generates a rich interactive report compatible with CI dashboards.

---

## Trace Viewer (Debug)

When a test fails on first retry, Playwright records a full trace (DOM snapshots, network calls, console logs, screenshots). Open it with:

```bash
npm run trace
# then select the .zip file inside test-results/
```

Or directly:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## Design Decisions

### Fixtures over `beforeEach`
Playwright Fixtures are the recommended pattern from the Playwright team. They provide:
- Native **dependency injection** — Page Objects arrive as typed parameters
- **Isolated** setup/teardown per test
- **Composable** — fixtures can depend on other fixtures
- **Scoped** — `test`, `worker`, or `suite` scope

Using bare `beforeEach` would underutilize Playwright and not demonstrate real framework knowledge.

### TypeScript
TypeScript is the industry standard for Playwright in 2025-2026. Autocomplete, type safety and compile-time error detection make the framework more robust and maintainable.

### Multi-browser via `projects`
Playwright runs Chromium, Firefox and WebKit natively through its `projects` API. No additional drivers or services needed — just `npx playwright install`.

---

## Framework vs WebDriverIO (Projeto 1)

| Aspect | WebDriverIO (Projeto 1) | Playwright (Projeto 2) |
|---|---|---|
| Language | JavaScript | TypeScript |
| Protocol | WebDriver (W3C) | CDP + WebSocket |
| Parallelism | Configured manually | Native, per file |
| Multi-browser | Via capabilities | Native via `projects` |
| Waits | Explicit `waitFor*` | Auto-wait in assertions |
| Fixtures | Mocha `beforeEach` | Playwright Fixtures (DI) |
| Debug | Logs + screenshots | Trace Viewer (visual timeline) |
| Speed | Slower (HTTP protocol) | Faster (direct communication) |

---

## Author

**Elder Freitas** — Senior QA Analyst at ArcTouch  
[linkedin.com/in/elderalvesf](https://linkedin.com/in/elderalvesf)
