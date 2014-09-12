angular.module('<%- moduleName %>')

	.factory('<%- moduleName %>Services', ['$q', '$timeout', 'RestService', function($q, $timeout, RestService){
		<% for(element in actions.elements){
		var elementName = element.toLowerCase();%>
	    var _<%- elementName%><%- moduleName %> = function(data, id){
	    	var data = data;
			var response = $q.defer();
			$timeout(function(){//NEED TO KNOW ID
				<% if(element == 'GET'){%>
				RestService['FINDBYID']('<%- actions.url%>', null,id,function(err,data){
				<%}else{%>
				RestService['<%- element%>']('<%- actions.url%>', data,id,function(err,data){
				<%}%>
			          if(err){
			              console.log(err)
			              //$scope.alerts.push(err);
			          } else {
			           response.resolve(data);
			           //$scope.data['<%- element%>']=data;
			          }
			    });
			});
			return response.promise;
	    }
	    <% }%>
	    return {
	    	<% for(element in actions.elements){
	    	var elementName = element.toLowerCase();%>
	    	_<%- elementName%><%- moduleName %>: _<%- elementName%><%- moduleName %>,<% }%>
	    }
	}]);