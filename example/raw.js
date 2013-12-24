
var createSocketWithRequire = function(url) {
    var sjsc = require('sockjs-client-ws');
    
    var client = sjsc.create(url);
    
    Object.defineProperty(client, "onopen", {
      set: function(cb) {
        this.on("connection", cb);
      }
    });
    
    Object.defineProperty(client, "onmessage", {
      set: function(cb) {
        this.on("data", function(msg) {
          var e = {data:msg};
          cb(e);
        });
      }
    });
    client.send = client.write;
    
    return client;
}

var createSocketNoRequire = function(url) {
  return new SockJS(url);
}

var createSocket = (typeof require !== 'undefined') ? createSocketWithRequire : createSocketNoRequire;
var eventEmitter = (typeof require !== 'undefined') ? require("emitter-component") : emitter;

(function(global){
  global['SodaPurchase'] = global['SodaPurchase'] || {};
  
  // Create state matrix. Each key in the state matrix represents one state
  // of the application.
  global['SodaPurchase']['purchaser'] = {
    stateMatrix: {
      
      "hasMoney": {
        
        // Here are state from which hasMoney can transition
        "spendMoney": {
          
          "type": {
            
            "properties" : {
              "currency" : {
                "type":"string",
                "enum":["$", "¥", "£", "€"]
              },
              "amount" : {
                "minimum":.01, 
                "type": "number"
              },
              "machine" : {
                "$typeRef":"inventory.Machine",
                "type": "string"
              },
              "purchaser" : {
                "$typeRef":"inventory.User",
                "type": "string"
              }
            }
          }
        }
      },
      
      "hasNoMoney": {
      },
      
      "collectItem": {
        "isUnHappy": {},
        "isHappy": {}
      },
      
      "waitingForItem":{
      },
      
      "makeSelection": {
        "selection": {
          "type": {
            "properties" : {
              "item" : {
                "type":"string",
                "enum":["coke", "pepsi"]
              }
            }
          }
        },
        "getMoneyBack": {}
      },
      
      "usingMachine":{
      }
    },
    
    // What value does a terminal state have? Why do we need to specify this?
    terminalStates: {
      "hasNoMoney": true
    },
    
    socket: (function() {
      
      globalSockets = typeof globalSockets === "undefined" ? {} : globalSockets;
      globalConnections = typeof globalConnections === "undefined" ? {} : globalConnections;
      globalEmitter = typeof globalEmitter === "undefined" ? new eventEmitter() : globalEmitter;
      
      var thisSocket = {
        sockets: globalSockets,
        connections: globalConnections,
        emitType: {
          spendMoney: '',
          selection: '',
          getMoneyBack: null,
          isUnHappy: null,
          isHappy: null
        },
        emit:{
          // Emit this event once your client is ready.
          // If you are the instigator or you include a conversationId you will get a playback of the current (if any) "state:" event.
          // You may emit this event multiple times if desired.
          init: function(qId, data) {
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::init",
              data: data
            }));
          },
          spendMoney: function(qId, agentData, data) {
            var valid = tv4.validate(data, '');
            
            if (!valid) {
              console.log(tv4.error);
            }
            
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::spendMoney:" + agentData._id,
              data: data
            }));
          },
          selection: function(qId, agentData, data) {
            var valid = tv4.validate(data, '');
            if(!valid){
              console.log(tv4.error);
            }
            
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::selection:" + agentData._id,
              data:data
            }));
          },
          getMoneyBack: function(qId, agentData, data) {
            var valid = true;
            if(!valid){
              console.log(tv4.error);
            }
            
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::getMoneyBack:" + agentData._id,
              data:data
            }));
          },
          isUnHappy: function(qId, agentData, data) {
            var valid = true;
            if(!valid){
              console.log(tv4.error);
            }
            
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::isUnHappy:" + agentData._id,
              data: data
            }));
          },
          isHappy:function(qId,agentData,data){
            var valid = true;
            if(!valid){
              console.log(tv4.error);
            }
            
            thisSocket.sockets[qId].send(JSON.stringify({
              event: "SodaPurchase.purchaser::isHappy:" + agentData._id,
              data:data
            }));
          }
        },
        on:{
          //This will be emitted once the conversation is ready for use, even if no state event is emitted.
          "conversation:init":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::conversation-init:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          spendMoney:function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::spendMoney:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          selection:function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::selection:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          getMoneyBack:function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::getMoneyBack:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          isUnHappy:function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::isUnHappy:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          isHappy:function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser::isHappy:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:hasMoney":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:hasMoney:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:hasNoMoney":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:hasNoMoney:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:collectItem":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:collectItem:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:waitingForItem":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:waitingForItem:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:makeSelection":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:makeSelection:"+agentData._id,function(data){
              cb(data,qId);
            });
          },
          "state:usingMachine":function(qId,agentData,cb){
            globalEmitter.on("SodaPurchase.purchaser:state:usingMachine:"+agentData._id,function(data){
              cb(data,qId);
            });
          }
        },
        disconnect:function(qId){
          var socket = thisSocket.sockets[qId];
          delete thisSocket.sockets[qId];
          socket.close();
        },
        connectWithPrefix:function(urlPrefix, qId, isDebug, callback, reCallback) {
          var qId;
          var connected = thisSocket.connections[qId];
          if (connected) {
            return callback && callback(thisSocket.sockets[qId], null, qId);
          }
          var url = "/ws/" + qId;
          if(urlPrefix){
            url = urlPrefix + url;
          }
          isDebug && console.log("connecting with %s", qId);
          
          var mySocket = thisSocket.sockets[qId] = createSocket(url);
          mySocket.onopen=function(){
            isDebug && console.log("connected with %s",qId);
          };
          mySocket.onmessage = function(e){
            var msg = JSON.parse(e.data);
            globalEmitter.emit(msg.event,msg.data);
          };
          
          globalEmitter.on("SodaPurchase.purchaser:" + qId + ":connected", function(data) {
            isDebug && console.log("connected with %s",qId);
            var connected=thisSocket.connections[qId];
            if(!connected) {
              thisSocket.connections[qId]=true;
              callback(thisSocket.sockets[qId], data,qId);
            } else if (reCallback){
              reCallback(thisSocket.sockets[qId], data,qId);
            }
          });
        },
        connect:function(qId,isDebug,callback){
          return thisSocket.connectWithPrefix(null,qId,isDebug,callback);
        }
      };
      return thisSocket;
    })()
  };
  
})((typeof module !== 'undefined' && module.exports) ? exports : this);
