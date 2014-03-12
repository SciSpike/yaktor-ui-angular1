angular.module('<%=appname%>')
	.directive('ngPopover', function($compile) {
	    return{
	        restrict: 'C',
	        //replace: true,
	        template: "<span ng-click='toggleVisible($event)' class='glyphicon glyphicon-th-large'></span>",
	        link: function (scope, element, attrs) {
	    		var popoverData = $.parseJSON(attrs.popoverData);
	    		var ul = $("<ul>", {class: "scid-popover well"});
	    		$.each(popoverData, function( key, value ) {
	    			var li = $("<li>", {
	    				html: "<span ng-click='popoverLinkClick($event)'>" + value.title + "</span>"
	    			});
	    			ul.append(li);
	    		});
	    		element.append($compile(ul)(scope));
	    		
	    		scope.toggleVisible = function(e){
	    			var siblingList = $(e.currentTarget).next('ul');
	    			$('.scid-popover').each(function(index, el){
		    			if(el != siblingList[0]){
		    				$(el).hide();
		    			}
	    			});
	    			ul.toggle();
	    		}
	    		scope.popoverLinkClick = function(e){
	    			console.log('test');
	    			console.log(e);
	    		}
	        }
	    }
	});