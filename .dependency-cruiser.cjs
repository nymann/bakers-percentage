/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'domain-no-outward-deps',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/(application|adapters)' },
      comment: 'Domain must not depend on application or adapters',
    },
    {
      name: 'domain-no-framework',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: 'react' },
      comment: 'Domain must be framework-agnostic',
    },
    {
      name: 'application-no-adapter-deps',
      severity: 'error',
      from: { path: '^src/application' },
      to: { path: '^src/adapters' },
      comment: 'Application layer must not depend on adapters',
    },
    {
      name: 'design-system-pure',
      severity: 'error',
      from: { path: '^src/design-system' },
      to: { path: '^src/(domain|application|adapters)' },
      comment: 'Design system must not depend on business logic',
    },
    {
      name: 'driving-no-driven',
      severity: 'error',
      from: { path: '^src/adapters/driving', pathNot: '\\.test\\.' },
      to: { path: '^src/adapters/driven' },
      comment: 'Driving adapters must not import driven adapters directly',
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.app.json',
    },
  },
}
