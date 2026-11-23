# GitHub Actions Workflow Notes

This note explains `.github/workflows/playwright.yml` (**Playwright Tests (Azure)**), the automation recipe GitHub Actions uses to run this project's Playwright tests in Azure Playwright Workspaces.

## When it runs

The workflow is named **Playwright Tests** and runs when:

- Code is pushed to the `main` or `master` branch.
- A pull request targets `main` or `master`.
- A user manually starts the workflow with **workflow_dispatch**.

GitHub starts a fresh `ubuntu-latest` machine for each run. The job has a 60-minute timeout. The job is skipped for pull requests from forks because GitHub does not provide repository secrets to forked workflows.

## Workflow steps

1. **Check out the repository** with `actions/checkout`. This makes the pushed project files available to the runner.
2. **Sign in to Azure** with `azure/login@v2`, using the service-principal JSON stored as a GitHub secret.
3. **Set up Node.js LTS** with `actions/setup-node`.
4. **Install dependencies** with `npm ci`. This uses `package-lock.json` to install the locked package versions.
5. **Validate required settings** so missing test credentials or a workspace URL fail with a clear message.
6. **Run tests with Azure cloud browsers** using `npx playwright test --config=playwright.service.config.js`.
7. **Upload the local HTML report** from `playwright-report/` as an Actions artifact named `playwright-report`. The artifact is retained for 30 days. It is uploaded after a failed test too, unless the run was cancelled.

## Test credentials

The workflow requires these GitHub repository Actions secrets:

- `AZURE_CREDENTIALS`: the JSON output from Azure CLI when creating the service principal with `--json-auth`.
- `PLAYWRIGHT_SERVICE_URL`: the region-specific endpoint copied from the Playwright workspace.
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

Create them under **Repository Settings → Secrets and variables → Actions**. The test account values and service-principal JSON must not be committed to the repository or pasted into logs or chat. The service principal should have Contributor access scoped to the Playwright workspace; for Azure report artifacts, grant it Storage Blob Data Contributor on the linked storage account.

## What this workflow runs

The workflow uses `playwright.service.config.js`; the test runner runs on GitHub's Ubuntu machine, while the browser sessions run in Azure Playwright Workspaces. The HTML report is also uploaded as a GitHub Actions artifact.

This workflow does **not** currently:

- Run Cucumber scenarios.
- Use Jenkins or schedule timed builds.

Azure Playwright usage may incur test-minute charges. Jenkins and timed schedules can be added separately when required.
