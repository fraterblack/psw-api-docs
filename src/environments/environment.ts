// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  environment: 'LOCAL',
  production: false,
  busy_loader_open_delay: 100,
  busy_loader_close_delay: 100,

  core_api: 'http://localhost:3001/api/core',
  timesheet_api: 'http://localhost:3002/api/timesheet',
  collector_api: 'http://localhost:3003/api/collector',
};
