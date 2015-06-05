
$scope.actionButtons = [{
	state: 'PUT',
	title: 'EDIT'
}];
function findData(data){
	<%- parentStateName %>Services.get<%- parentStateName%>({}, id).then(function(response) {
		$scope.directiveData = response;
	});
};
findData({});
$scope.testType = function(value){
	if(typeof value == 'string'){
		return true;
	}
	return false;
}