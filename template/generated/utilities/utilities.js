angular.module('views', [])
	.factory('modifyData', function(){
		
		var regex = new RegExp("^[_]");
		
		var _removeObjUnderscore = function(data){
		    for (var key in data) {
		    	var test = regex.test(key);
		    	if(test){
		    		 delete data[key]; 
		    	}
		    }
		    return data;
		}
		
		var _removeArrObjUnderscore = function(array){
			for (var i=0; i<array.length; i++) {
		    	var test = regex.test(array[i].field);
		    	if(test){
		    		array.splice(i, 1);
		    	}
		    }
			return array;
		}
		
		return {
			removeObjUnderscore: _removeObjUnderscore,
			removeArrObjUnderscore: _removeArrObjUnderscore
		}
	});