angular.module('views')
	.config(['$facebookProvider', function($facebookProvider) {
    var appIds = {
      production: '1051888808185047',
      develop: '950055385065226',
      demo: '1568409140064495'
    };
		$facebookProvider.setAppId(appIds).setPermissions(['email', 'public_profile']);
	}])
	.run(['$rootScope', '$window', function($rootScope, $window) {
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "http://connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
		$rootScope.$on('fb.load', function() {
			$window.dispatchEvent(new Event('fb.load'));
		});
	}]);
