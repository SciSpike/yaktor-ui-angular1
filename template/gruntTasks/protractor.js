module.exports = {
  options: {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    keepAlive: true, // If false, the grunt process stops when the test fails.
    noColor: false, // If true, protractor will not use colors in its output.
    args: {
      // Arguments passed to the command
    }
  },
  test: {
    options: {
      configFile: "./test/protractor.conf.js", // Target-specific config file
      args: {}//, // Target-specific arguments
      //debug: true
    }
  }
};