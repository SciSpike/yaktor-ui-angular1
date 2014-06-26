module.exports = {
  common: {
    options: {
      ieCompat: true,
      paths: ['./less/'],
      compress: false,
      syncImport: true,
      sourceMap: true,
      sourceMapFilename: './styles/main.css.map',
      sourceMapURL: '/styles/main.css.map',
      sourceMapBasepath: '',
      sourceMapRootpath: ''
    },
    files: [
            {
              expand: true,
              cwd: './less/',
              src: ['engine-ui.less'],
              dest: './styles/',
              ext: '.css'
            },
            {
                expand: true,
                cwd: './less/custom/',
                src: ['master.less'],
                dest: './styles/',
                ext: '.css'
              }
          ]
    }
};