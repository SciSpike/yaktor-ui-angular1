angular.module('views')
.directive('engineUiFormInput', function($rootScope, $eventsCommon, $timeout, typeRefService, partialLookup, $modal) {
	return{
		restrict: 'C',
		template: '<div ng-include="getContentUrl()"></div>',
		scope: {
			directiveData: '=',
			key: '@'
		},
		controller: function($rootScope, $scope, $translate, defaultSettings, settingsInstances) {

			if($scope.directiveData.typeRef){
				if(!$scope.directiveData.endPoint){
					$scope.directiveData.endPoint = settingsInstances.getTypeRefsInstance('default');
				}
				var endPointData = $scope.directiveData.endPoint,
					typeRef = $scope.directiveData.typeRef;
				
				if(endPointData[typeRef]){
					
					$translate($scope.directiveData.ui.title).then(function (translatedTitle) {
						
						$scope.objectRef = translatedTitle.toLowerCase();
						var setTypeRefData = function(data){
							if(endPointData[typeRef].canPost){
								//create an initial data element for create new, be sure to always concat results to this.
								var initialData = [{
									_id: -1,
									title: "Create New " + translatedTitle,
									description: null,
									action: 'createNew',
									groupBy: ""
								}];
								$scope.directiveData.ui.data = initialData.concat(data);
							}else{
								$scope.directiveData.ui.data = data;
							}
						};
						//set endpoint in case we need to call on it elsewhere
						var endPoint = endPointData[typeRef].url;
						//NON-ASYNC
						typeRefService.getTypeRef(endPoint).then(function(response){
							setTypeRefData(response.results);
						});

						//ASYNC
						$scope.getLocation = function(val) {
							//add an initial data element for create new
							var data = {};
							data.title = "/"+val+".*/";
							typeRefService.getTypeRef(endPoint, data).then(function(response){
								setTypeRefData(response.results);
							});
						};

					});
				}else{
					$scope.directiveData.ui.type = 'string';
				}

			}
			$scope.directiveData.ui.type = defaultSettings.forms.elementTypes[$scope.directiveData.type];
			if($scope.directiveData.type == 'geo' || $scope.key == 'useCurrentLocation'){
				$rootScope.$on('maps.setCoords', function (e, data) {
					if($scope.key == 'useCurrentLocation' && data.reset == true){
						$scope.directiveData.answer = 'false';
					}
					if($scope.directiveData.type == 'geo'){
						$scope.directiveData.answer = [data.lat, data.lng];
					}
				});
			}
		},
		link: function(scope, element, attrs){
			
			var endPointData = scope.directiveData.endPoint,
				typeRef = scope.directiveData.typeRef;
			
			scope.getContentUrl = function() {
				if (scope.directiveData.ui.type) {
					return partialsBaseLocation + '/fragments/' + scope.directiveData.ui.type.toLowerCase() + '.html';
				} else {
					return "";
				}
			}
			scope.addArrayItem = function(){
				scope.directiveData.answer.push("");
			}
			scope.removeArrayItem = function(index){
				scope.directiveData.answer.splice(index, 1);
			}
			scope.booleanChange = function(data){
				if(scope.key == 'useCurrentLocation'){
					$rootScope.$emit('maps.useCurrent', {useCurrent: data});
				}
			}
			scope.checkSelection = function(item, model, index){
				if(item.action && endPointData[typeRef].canPost){
					scope[item.action](index);
				}
			};

			scope.createNew = function(index){
				
				var partialString = scope.objectRef,
					skope = $rootScope.$new(),
					arrayIndex = index;
				
				scope.$parent.actionableForm.$invalid = true;
				
				if(partialLookup[scope.objectRef]){
					partialString = partialLookup[scope.objectRef];
				}
				skope.abort = function(){
					modalInstance.dismiss();
				};
				skope.changeState = function(state, query, newItem){
					//ignore state and query here, this is just a a spoof to get what we need and avoid a goofy error
					if (newItem){
						typeRefService.getTypeRef($scope.directiveData.endPoint[$scope.directiveData.typeRef], {}).then(function(response){
							setTypeRefData(response.results);
							if(arrayIndex && arrayIndex != null){
								scope.directiveData.answer[arrayIndex] = newItem.title; //DON'T KNOW IF THIS WORKS
							}else{
								scope.directiveData.answer = newItem;
							}
							modalInstance.close();
						});
					}else{
						skope.abort();
					}
				}

				var modalInstance = $modal.open({
					size:"lg",
					templateUrl: 'partials/crud/' + partialString + '/POST.html',
					controller: partialString + 'POSTController',
					scope:skope
				});
			};
		}
	}
});