module.exports = {
    testEnvironment: 'node',

    collectCoverageFrom: [
        '**/*.js',

        // Exclude specific patterns
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/*.config.js',
        '!**/jest.config.js',
        '!**/app.js',
    ],

    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

    // Builds fail if this thresholds are not met
    coverageThreshold: {
        global: { branches: 0, functions: 0, lines: 0, statements: 0 },
    },

    collectCoverage: true,
    coverageReporters: ['json','json-summary', 'text', 'text-summary', 'lcov', 'html', 'clover'], // Output formats for coverage reports
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/', '/build/'],
};
