angular.module('<%=appname%>')
.directive('customNavPanel', function($compile) {
    return{
        restrict: 'C',
        transclude: true,
        require: '^?navPanel',
        templateUrl: "./modules/footer/custom/footerTabs.html",
        link: function(scope, element, attrs, scidFooterController, $translate, $filter) {
          
        }
    }
});