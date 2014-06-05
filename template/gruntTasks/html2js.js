module.exports = {
	dist: {
		options: {
			//module: 'foo', // no bundle module for all the html2js templates
			base: './'
		},
		files: [
			{
				expand: true,
				src: ['./index.html'],
				ext: '.html.js'
			}
		]
	}
};