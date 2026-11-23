const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..', '..');
const failedScenariosPath = path.join(projectRoot, 'reports', 'failed-scenarios.txt');
const failedScenarios = fs
  .readFileSync(failedScenariosPath, 'utf8')
  .split(/\r?\n/)
  .map((scenario) => scenario.trim())
  .filter(Boolean)
  .map((scenario) => scenario.replace(/\\/g, '/'));

if (failedScenarios.length === 0) {
  console.log('No failed scenarios recorded; nothing to rerun.');
  process.exit(0);
}

const cucumberCliPath = path.join(
  projectRoot,
  'node_modules',
  '@cucumber',
  'cucumber',
  'bin',
  'cucumber.js'
);
const args = [
  ...failedScenarios,
  '--require',
  'tests/features/support/*.js',
  '--format',
  'html:reports/cucumber-rerun-report.html',
  '--format',
  'json:reports/cucumber-rerun-report.json',
  '--parallel',
  '2'
];

const result = spawnSync(process.execPath, [cucumberCliPath, ...args], {
  cwd: projectRoot,
  stdio: 'inherit'
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status === null ? 1 : result.status;
