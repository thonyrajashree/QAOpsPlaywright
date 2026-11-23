# Azure Playwright Workspaces Setup Notes

These notes describe the Playwright Workspaces setup for this project and how to run tests in Azure from a Windows PowerShell terminal.

## What the setup does

- Test files stay in the local `tests` folder.
- `playwright.service.config.js` connects the Playwright runner to Azure-hosted browsers.
- Azure's Playwright Workspaces reporter uploads test results for viewing in the Azure portal.
- The HTML reporter also creates a local Playwright report.

## Project configuration

### `playwright.config.js`

- Sets `testDir` to `./tests`.
- Uses the HTML and Allure reporters for the standard local configuration.
- Uses the Chromium project.

### `playwright.service.config.js`

- Loads the base config from `playwright.config.js`.
- Uses `createAzurePlaywrightConfig` from `@azure/playwright`.
- Selects Linux service browsers with `ServiceOS.LINUX`.
- Uses `DefaultAzureCredential` from `@azure/identity` for Azure authentication.
- Configures the reporters as HTML and `@azure/playwright/reporter`.

The service config's reporter list replaces the base reporter list for service runs. Therefore, the service run uses HTML and Azure Playwright reporting, not the base Allure reporter.

## Workspace URL and PowerShell

The service needs `PLAYWRIGHT_SERVICE_URL` to identify the Playwright workspace. Copy the endpoint for your own workspace from its **Get Started** page. Its shape is:

```text
wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers
```

In the VS Code **PowerShell** terminal, set it like this:

```powershell
$env:PLAYWRIGHT_SERVICE_URL="wss://<region>.api.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/browsers"
```

The variable applies only to that terminal session. Set it again in each new terminal. If the workspace changes, replace the URL with the endpoint for the correct workspace.

The instructor's `export PLAYWRIGHT_SERVICE_URL=...` command is Bash syntax. In PowerShell, use `$env:PLAYWRIGHT_SERVICE_URL=...` instead.

## Azure sign-in

`DefaultAzureCredential` can use Azure CLI credentials. Sign in if needed:

```powershell
az login
```

If you are already signed in to the correct Azure account and subscription, you do not need to sign in again for every test run.

## Test account credentials

The UI/API test fixtures require these environment variables:

- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

Set them in the current PowerShell session before running credential-dependent tests:

```powershell
$env:TEST_USER_EMAIL = "your-test-account-email"
$env:TEST_USER_PASSWORD = "your-test-account-password"
```

Do not commit these values or put them in a checked-in `.env` file. The `.gitignore` excludes `.env` files, `state.json`, and the unused local `tests/utils/placeorderTestdata.json`. In GitHub Actions, add repository secrets with the same names. In Jenkins, store the values as credentials and bind them to environment variables for the test step.

## Storage and Azure report setup

Azure Workspaces observability stores reports and artifacts in an Azure Storage account.

Use the storage account configured for your workspace:

- **Storage account:** `<storage-account>`
- **Resource group:** `<resource-group>`

To link it to the Playwright workspace:

1. In the Azure portal, open **Azure App Testing** and select the Playwright workspace used by the test URL.
2. Go to **Settings → Capabilities**.
3. Enable **Observability**.
4. Select the intended storage account and select **Save**.
5. On the linked storage account, open **Access control (IAM)** and ensure each person running tests has **Storage Blob Data Contributor**.

A **Storage Blob Data Contributor** role assignment is needed for each test-running identity on the linked storage account. A role assignment does not itself link the account to the workspace or create a missing report container. Azure manages the report container; do not create an arbitrary container manually.

Microsoft notes that observability storage currently needs public-endpoint network access; private-endpoint-only storage accounts are not supported for artifact storage.

## Running tests in Azure

From the project root, in the same PowerShell terminal where the URL is set:

```powershell
npx playwright test --config=playwright.service.config.js
```

The base config points to `./tests`, so this runs all matching Playwright test files in that folder. To run one file only:

```powershell
npx playwright test --config=playwright.service.config.js tests/end-to-endPO.spec.js
```

The Azure portal test run seen during setup reported these two files as passed:

- `tests/end-to-endPO.spec.js` — `E2E - buy product using fixture`
- `tests/excelTest.spec.js` — `upload download excel validation`

## Viewing reports

- **Azure report:** Open the Playwright workspace in the Azure portal and select the new test run. The Azure reporter uploads run results.
- **Local HTML report:** After a test run, execute:

  ```powershell
  npm run report
  ```

  This runs `npx playwright show-report` and opens the local Playwright HTML report.

## Troubleshooting reminders

- **“The value for the PLAYWRIGHT_SERVICE_URL variable is not set correctly”**: Set the variable in the current PowerShell terminal and verify it points to the correct workspace endpoint.
- **Azure report page says “HTTP 404: The specified container does not exist”**: Check that Observability is enabled and that the correct storage account is linked under the workspace's **Settings → Capabilities**. Confirm that test runners have the storage role, then rerun tests after fixing the configuration. The existing run may not have artifacts if storage was not configured when it ran.
- A successful remote test run and a successful report upload are related but separate: tests can run while Azure report storage still needs configuration.

## Official documentation

- [Playwright Workspaces observability setup](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/quickstart-observability-with-playwright-workspaces)
- [Playwright Workspaces configuration](https://aka.ms/pww/docs/config)
