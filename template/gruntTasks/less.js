module.exports = {
  common: {
    options: {
      ieCompat: true,
      paths: ['./less/'],
      compress: true
    },
    files: {
      './styles/customStyles.css': ["./less/**/*.less"],
    }
      //[{
        //expand: true,
        //cwd: './less/',
        //src: ['./**/*.less'],
        //dest: './styles/',
        //ext: '.css'
      //}]
  }
};