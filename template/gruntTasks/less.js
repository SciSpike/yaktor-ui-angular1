module.exports = {
  common: {
    options: {
      ieCompat: true,
      paths: ['./less/'],
      compress: false,
      syncImport: true
    },
    files: [
            {
              expand: true,
              cwd: './less/',
              src: ['custom/master.less', 'engine-ui.less'],
              dest: './styles/',
              ext: '.css'
            }
          ]
    }
};