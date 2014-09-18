
'use strict';

angular.module('<%=appname%>').service('SocketService', function ($rootScope, $state, serverLocation, $sessionStorage) {
  
  // // TODO: Create all socket connections here based on Jonathan's specs
  // 
  var service = {};
  // 
  // service.socket = new SockJS(serverLocation);
  // service.emitter = new Emitter();
  // 
  // service.onload = function(e) {
  //   console.log('dummy onload function');
  // }
  var inited={};
  service.init=function(sUrl,initData,data,cb){
    inited[sUrl]=inited[sUrl]||{};
    //Connect api short circuits if already connected
    require('socketApi').connectWithPrefix(serverLocation,sessionId, function(cb){
		var token = null;
		try {
			token = $sessionStorage.careToken.access_token;
		} catch(e){
			console.log(e);
		}
		
		cb(null,token);
	},true,function(){
      var ws = require(sUrl.replace(".","/").substr(1));
      if(!inited[sUrl][data._id]){
        inited[sUrl][data._id]=true;
        for(var onV in ws.socket.on){
          (function(on){
            if(/state:.*/.test(on)){
              ws.socket.on[on](
                  sessionId,initData,function(data){
                    console.log("Going to: %s", on);
                    cb(null,"."+on,data);
                  }
              )
            }
          })(onV);
        }
      }
      ws.socket.emit.init(sessionId,initData);
    })
  }
  service.doAction=function(sUrl,action,initData,data,cb){
    require(sUrl.replace(/:state.*/,"").replace(".","/").substr(1)).socket.emit[action](sessionId,initData,data||{},cb);
  }
  
  
  return service;
});