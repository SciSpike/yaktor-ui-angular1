
'use strict';

angular.module('{{appname}}').service('SocketService', function ($rootScope, $state,serverLocation) {
  
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
    //Connect api short circuits if already connected
    window.socketApi.connectWithPrefix(serverLocation,sessionId,true,function(){
      if(!inited[data._id]){
        inited[data._id]=true;
        for(var onV in window["ws://"+sUrl].socket.on){
          (function(on){
            if(/state:.*/.test(on)){
              window["ws://"+sUrl].socket.on[on](
                  sessionId,initData,function(){
                    console.log("Going to: %s", on);
                    cb(null,"."+on,null);
                  }
              )
            }
          })(onV);
        }
      }
      window["ws://"+sUrl].socket.emit.init(sessionId,initData);
    })
  }
  service.doAction=function(sUrl,action,initData,data,cb){
    window["ws://"+sUrl.replace(/:state.*/,"")].socket.emit[action](sessionId,initData,data||{});
  }
  
  
  return service;
});