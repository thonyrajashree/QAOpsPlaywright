# Cucumber Study Notes

These notes summarize the Cucumber concepts covered so far and how they are used in this project.

## 1. What Cucumber does

Cucumber runs behavior scenarios written in Gherkin, a readable format using `Given`, `When`, and `Then`.

- `Given` describes the starting state or setup.
- `When` describes an action.
- `Then` describes the expected result.

For example, a login scenario can describe opening an application, entering credentials, and checking the resulting page or error.

## 2. The main parts of a Cucumber test

### Feature files

Files under `tests/features/` describe behavior in Gherkin:

- `Ecommerce.feature` covers adding a product to a cart and placing an order.
- `ErrorValidation.feature` covers invalid and valid login cases.

Feature files describe what the test should do, not the Playwright locator details.

### Step definitions

`tests/features/support/steps.js` maps Gherkin sentences to JavaScript functions. Those functions use Playwright and the page objects to perform actions and assertions.

For example, a step written with `{string}` parameters can receive values from the feature:

```gherkin
When I enter username "invalidUser" and password "invalidPassword"
```

```javascript
When(
  'I enter username {string} and password {string}',
  async function (username, password) {
    await this.poManager.getLoginPage().invalidLogin(username, password);
  }
);
```

Keep the Gherkin sentence and its step-definition expression consistent. Reuse an existing step definition when it expresses the same behavior.

### Hooks

`tests/features/support/hooks.js` runs setup and cleanup around scenarios:

- `Before` launches the browser and creates a context and page.
- `BeforeStep` logs steps for scenarios with the configured tags.
- `AfterStep` captures and attaches a screenshot when a step fails.
- `After` closes the context and browser.

Cucumber creates a separate World (`this`) for each scenario. This project stores the browser, page, and page-object manager on that World so steps in the same scenario can share them.

### Page objects

Page objects keep locators and browser actions out of the feature language. For example, `LoginPage` supports the two login sites used here:

- `goTo('practice')` opens the practice login application.
- `goTo('ecommerce')` opens the e-commerce client application.

The login flows have different locators and behavior, so the page object selects the appropriate behavior for the chosen application.

## 3. Parameterization and Scenario Outline

Parameterization lets one step definition accept different input values rather than hardcoding one set.

A `Scenario Outline` repeats the same scenario for every row in its `Examples` table. Placeholders such as `<username>` and `<password>` are replaced by the values in each row.

The invalid practice-login outline currently has two example rows, so it creates two scenario executions. Keep the reusable step definition parameterized with `{string}`; Cucumber supplies the row values to it.

Use an outline when the steps stay the same but the data changes. Use separate scenarios when the behavior or steps are meaningfully different.

## 4. Tags and selecting scenarios

Tags label and filter features or scenarios:

- `@ecommerce` identifies e-commerce scenarios.
- `@loginValidation` identifies login-validation scenarios.
- `@Regression` identifies the regression group.

Tags can be placed above a `Feature`, `Scenario`, or `Scenario Outline`. A feature-level tag is inherited by every scenario in that feature; a scenario-level tag only applies to that scenario. Multiple tags can be kept together.

**Current tagging detail:** `@loginValidation` is currently above `Feature: Login validations`, so it applies to every scenario in `ErrorValidation.feature`, including the e-commerce invalid-login scenario. As a result, `npm run cucumber:login` selects that scenario too. If the intent is to select only the practice-login cases, move `@loginValidation` from the feature to those specific scenarios.

## 5. Running scenarios in parallel

Cucumber parallelism is configured on the Cucumber command with `--parallel 2`, which permits up to two scenarios to execute at once.

Parallel scenarios should have isolated browser contexts and should not rely on shared mutable test data. Order-placement tests can affect the same account or server-side data, so consider that before increasing the worker count.

`--parallel 2` on a Cucumber command is separate from Playwright Test's worker configuration.

## 6. Reports, retries, and rerunning failures

These are related but different mechanisms:

- `--format html:...` creates a human-readable HTML report.
- `--format json:...` creates machine-readable test results.
- `--format rerun:...` writes locations of scenarios that still failed.
- `--retry 1` automatically gives a failed scenario one additional attempt during the same run.
- `npm run cucumber:rerun` is a separate command that reruns locations from `reports/failed-scenarios.txt`.

The regression run writes its remaining failures to `reports/failed-regression-scenarios.txt`. The current `cucumber:rerun` helper reads `reports/failed-scenarios.txt`, so it does not rerun the regression failure list.

Failed-step screenshots are also attached to the Cucumber result by the `AfterStep` hook.

## 7. Commands in this project

Run these from the project directory:

| Command | What it runs |
| --- | --- |
| `npm run cucumber` | All Cucumber feature files, with two workers and general HTML, JSON, and rerun outputs. |
| `npm run cucumber:ecommerce` | `Ecommerce.feature` scenarios tagged `@ecommerce`. |
| `npm run cucumber:login` | `ErrorValidation.feature` scenarios tagged `@loginValidation` (currently all its scenarios due to the feature-level tag). |
| `npm run cucumber:regression` | Scenarios tagged `@Regression`, with two workers, one automatic retry, and regression reports. |
| `npm run cucumber:rerun` | Scenarios listed in `reports/failed-scenarios.txt`. |
| `npm run regression` | Playwright Test cases matching `@Regression`; this does not run Cucumber feature files. |

The last two regression commands use different runners:

- `cucumber:regression` uses Cucumber and Gherkin `.feature` files.
- `regression` uses Playwright Test spec files.

The project's Cucumber regression run was verified with five scenarios and 26 passing steps. Reports are written under `reports/`.

In PowerShell, quote a grep tag when running Playwright directly, for example:

```powershell
npx playwright test --grep "@Regression"
```

Without quotes, PowerShell can interpret the `@` and Playwright may report that the `--grep` argument is missing.

## 8. What to remember

1. **Feature files describe behavior; step definitions implement the steps.**
2. **Hooks manage scenario setup, cleanup, and failure evidence.**
3. **Page objects contain UI locators and actions.**
4. **Scenario Outline plus Examples repeats a scenario with different data.**
5. **Tags group/select tests; feature-level tags apply to every scenario in that feature.**
6. **Parallel workers run scenarios concurrently; isolate state and test data.**
7. **Reports show results; retries happen automatically; rerun files support a later separate run.**
8. **Cucumber commands and Playwright Test commands are separate.**

Useful next Cucumber topics include Data Tables, configuration by environment, and running the suite in continuous integration.
