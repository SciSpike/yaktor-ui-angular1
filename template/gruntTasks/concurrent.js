module.exports ={
  options: {
    logConcurrentOutput: true
  },
  server: [
    'jade:server',
		'jade:modules',
    'less:common',
    'less:modules',
    'coffee:server',
    'copy:styles',
		'copy:fonts'
  ],
  liveTest: [
    'jade:liveTest',
    'less:liveTest',
    'coffee:liveTest',
    'copy:liveTest'
  ],
  test: [
    'jade',
    'coffee',
    'copy:styles'
  ],
  dist: [
    'coffee:dist',
    'less:common',
    'less:modules',
		'jade:server',
		'jade:modules',
    'copy:styles',
		'copy:fonts',
    'imagemin',
    'svgmin',
    'htmlmin'
  ]
}