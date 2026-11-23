# QAOps Playwright Automation

An end-to-end automation practice project using Playwright Test, page objects, fixtures, API helpers, Cucumber, and Azure Playwright Workspaces.

## What this project demonstrates

- UI tests organized with the Page Object Model.
- Reusable Playwright fixtures and API helpers.
- Excel download, update, upload, and validation.
- Cucumber feature scenarios and step definitions.
- Local Playwright execution and Azure Playwright Workspaces configuration.
- GitHub Actions cloud-browser CI on pushes, same-repository pull requests, and manual dispatches.

## Requirements

- Node.js LTS and npm.
- Test-account credentials for the demo application.
- For Azure runs only: an Azure Playwright workspace, Azure CLI sign-in or another supported Microsoft Entra credential, and the workspace endpoint.

## Install

Run these commands from the repository root:

```sh
npm ci
```

Set the demo test-account credentials in your shell. For PowerShell:

```powershell
$env:TEST_USER_EMAIL = "your-test-account-email"
$env:TEST_USER_PASSWORD = "your-test-account-password"
```

For Bash:

```bash
export TEST_USER_EMAIL="your-test-account-email"
export TEST_USER_PASSWORD="your-test-account-password"
```

Never commit real credentials or browser authentication state. The fixtures fail with a clear error if required environment variables are missing.

## Run tests locally

Run the Playwright suite:

```sh
npx playwright test
```

Run one Playwright spec:

```sh
npx playwright test tests/end-to-endPO.spec.js
```

Run Cucumber scenarios:

```sh
npm run cucumber
```

## Run with Azure Playwright Workspaces

Copy the endpoint from your Playwright workspace's **Get Started** page. In PowerShell:

```powershell
$env:PLAYWRIGHT_SERVICE_URL = "wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers"
az login
npx playwright test --config=playwright.service.config.js
```

Replace the placeholder endpoint with your own workspace URL. The workspace must allow your identity to run tests. For Azure report artifacts, enable Observability and link a storage account to the workspace. See [Azure Playwright setup notes](./Azure-Playwright-Setup-Notes.md).

## Reports

- Playwright HTML report: `npm run report`
- Cucumber HTML and JSON reports: created under `reports/`
- Azure test-run report: open the run in the Azure portal when using the service reporter

Reports, browser state, and local credential files are excluded from Git.

## CI

The [GitHub Actions workflow](./.github/workflows/playwright.yml) runs tests using Azure Playwright Workspaces. Add these repository Actions secrets before running it:

- `AZURE_CREDENTIALS`: the JSON credentials output for the Azure service principal used by the workflow.
- `PLAYWRIGHT_SERVICE_URL`: the endpoint URL for your Playwright workspace.
- `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`: credentials for the demo application's test account.

The Azure identity needs Contributor access on the Playwright workspace. If Azure report observability is enabled, it also needs Storage Blob Data Contributor on the linked storage account. The workflow is configured to run a cloud test job on pushes, manual dispatches, and same-repository pull requests. Azure Playwright usage may incur charges.

Jenkins execution and scheduled runs are not configured in this repository yet.

## Project layout

```text
tests/
  PageObject/             Page objects
  features/               Cucumber features and step definitions
  scripts/                Test utilities
  utils/                  Fixtures, API helpers, and test utilities
playwright.config.js      Local Playwright configuration
playwright.service.config.js
                          Azure Playwright Workspaces configuration
```
