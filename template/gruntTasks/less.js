module.exports = {
  common: {
    options: {
      ieCompat: true,
      paths: ['./styles/less/'],
      compress: false,
      syncImport: true,
      sourceMap: true,
      sourceMapFilename: './styles/css/main.css.map',
      sourceMapURL: '/styles/css/main.css.map',
      sourceMapBasepath: '',
      sourceMapRootpath: ''
    },
    files: [
            {
              expand: true,
              cwd: './styles/less/',
              src: ['engine-ui.less'],
              dest: './styles/css/',
              ext: '.css'
            }]
    }
};