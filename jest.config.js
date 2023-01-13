module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "controls/**/*",
    "util/*",
    "bll/*",
    "dal/*",
    "routes/*",
  ],
  testTimeout: 90000,
};
