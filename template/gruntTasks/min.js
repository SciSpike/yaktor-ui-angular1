module.exports = {};

module.exports.useminPrepare = {
  html: '<%= dir.tmp %>/index.html',
  options: {
    dest: '<%= dir.dist %>/index.html'
  }
};

module.exports.usemin = {
  html: ['<%= dir.dist %>/{,*/}*.html'],
  css: ['<%= dir.dist %>/styles/{,*/}*.css'],
  options: {
    dirs: ['<%= dir.dist %>']
  }
};

module.exports.imagemin = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= dir.app %>/images',
      src: '{,*/}*.{png,jpg,jpeg}',
      dest: '<%= dir.dist %>/images'
    }]
  }
};

module.exports.svgmin = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= dir.app %>/images',
      src: '{,*/}*.svg',
      dest: '<%= dir.dist %>/images'
    }]
  }
}

module.exports.cssmin = {
  // By default, your `index.html` <!-- Usemin Block --> will take care of
  // minification. This option is pre-configured if you do not wish to use
  // Usemin blocks.
  // dist: {
  //   files: {
  //     '<%= dir.dist %>/styles/main.css': [
  //       '.tmp/styles/{,*/}*.css',
  //       '<%= dir.app %>/styles/{,*/}*.css'
  //     ]
  //   }
  // }
}

module.exports.htmlmin = {
  dist: {
    options: {
      /*removeCommentsFromCDATA: true,
       // https://github.com/yeoman/grunt-usemin/issues/44
       //collapseWhitespace: true,
       collapseBooleanAttributes: true,
       removeAttributeQuotes: true,
       removeRedundantAttributes: true,
       useShortDoctype: true,
       removeEmptyAttributes: true,
       removeOptionalTags: true*/
    },
    files: [{
      expand: true,
      cwd: '<%= dir.app %>',
      src: ['*.html', 'views/*.html', 'modules/**/views/*.html'],
      dest: '<%= dir.dist %>'
    },
      {
        expand: true,
        cwd: '<%= dir.tmp %>',
        src: ['*.html', 'views/*.html', 'modules/**/views/*.html'],
        dest: '<%= dir.dist %>'
      }
    ]
  }
};

module.exports.ngmin = {
  dist: {
    files: [{
      expand: true,
      cwd: '<%= dir.app %>/modules/',
      src: '**/*.js',
      dest: '<%= dir.build %>/modules/'
    }]
  }
};

module.exports.uglify = {
  dist: {
    files:[{
      '<%= dir.dist %>/modules/core/scripts/CPQPlus.js': [
        '<%= dir.dist %>/modules/core/scripts/CPQPlus.js'
      ]
    },{
      '<%= dir.dist %>/modules/core/scripts/libs.js': [
        '<%= dir.dist %>/modules/core/scripts/libs.js'
      ]
    }]
  }
};

module.exports.cdnify = {
  dist: {
    html: ['<%= dir.dist %>/*.html']
  }
}