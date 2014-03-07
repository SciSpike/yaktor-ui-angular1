
// Put files not handled in other tasks here
module.exports = {
  liveTest: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= dir.test %>',
      dest: '<%= dir.tmp %>',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        '**/*.html',
        '*.html',
        'images/{,*/}*.{gif,webp}',
        'styles/fonts/*'
      ]
    }]
  },
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= dir.app %>',
      dest: '<%= dir.dist %>',
      src: [
        '*.{ico,png,txt}',
        '.htaccess',
        '**/*.html',
        '*.html',
        'images/{,*/}*.{gif,webp}',
        'styles/fonts/*'
      ]
    }, {
      expand: true,
      cwd: '<%= dir.tmp %>/images',
      dest: '<%= dir.dist %>/images',
      src: [
        'generated/*'
      ]
    }, {
      expand: true,
      cwd: '<%= dir.tmp %>/modules/libs/',
      dest: '<%= dir.dist %>/modules/libs/',
      src: ['{,*/}*.html', '**/*.js', '{,*/}*.css']
    }]
  },
  styles: {
    expand: true,
    cwd: '<%= dir.app %>/styles',
    dest: '.tmp/styles/',
    src: '{,*/}*.css'
  },
	fonts: {
		expand: true,
		cwd: '<%= dir.app %>/styles',
		dest: '.tmp/styles/',
		src: 'fonts/*'
	}
};