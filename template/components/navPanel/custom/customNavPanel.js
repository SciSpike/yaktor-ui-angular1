angular.module('<%=appname%>')
.directive('customNavPanel', function($compile) {
    return{
        restrict: 'C',
        transclude: true,
        require: '^?navPanel',
        templateUrl: "./components/footer/custom/footerTabs.html",
        link: function(scope, element, attrs, scidFooterController, $translate, $filter) {
          
        }
    }
});