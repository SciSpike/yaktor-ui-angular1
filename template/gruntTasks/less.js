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
    files: [{
              expand: true,
              cwd: './clientConfig/themes/<%- theme%>/',
              src: ['index.less'],
              dest: './styles/css/',
              ext: '.css'
            }]
    }
};