module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.build',
        '.tmp',
        '<%= dir.dist %>/*',
        '!<%= dir.dist %>/.git*'
      ]
    }]
  },
  server: '.tmp'
};