/***** Game of Life *****/

/* require tools */

(function (udf){
  var udfp = $.udfp;
  
  var sli = $.sli;
  var apl = $.apl;
  var att = $.att;
  
  function makeSwitchState(){
    var state = udf;
    
    var onset, onsetstate, onstart, onstop, onspeed, onrefspeed, onsize, oncolor;
    
    function clearHandlers(){
      onset = function (i, j){};
      onsetstate = function (newstate){};
      onstart = function (){};
      onstop = function (){};
      onspeed = function (s){};
      onrefspeed = function (r){};
      onsize = function (r, c){};
      oncolor = function (c){};
    }
    
    clearHandlers();
    
    function switchState(newstate){
      newstate.onset = onset;
      newstate.onsetstate = onsetstate;
      newstate.onstart = onstart;
      newstate.onstop = onstop;
      newstate.onspeed = onspeed;
      newstate.onrefspeed = onrefspeed;
      newstate.onsize = onsize;
      newstate.oncolor = oncolor;
      
      if (!udfp(state))newstate.init(state.deinit());
      else newstate.init();
      
      state = newstate;
    }
    
    var o = {
      switchState: switchState,
      clearHandlers: clearHandlers,
      set onset(f){onset = f;},
      set onsetstate(f){onsetstate = f;},
      set onstart(f){onstart = f;},
      set onstop(f){onstop = f;},
      set onspeed(f){onspeed = f;},
      set onrefspeed(f){onrefspeed = f;},
      set onfillobj(f){onfillobj = f;},
      set onsize(f){onsize = f;},
      set oncolor(f){oncolor = f;}
    }
    
    function makePassFn(o, key){
      return function (){
        return apl(o()[key], arguments);
      };
    }
    
    function makePassObj(o){
      var obj = {};
      var keys = sli(arguments, 1);
      for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        obj[key] = makePassFn(o, key);
      }
      return obj;
    }
    
    att(o, makePassObj(function (){return state;}, 'valid', 'fill', 'empty', 'fillObj', 'filltf', 'filled', 'getState', 'setState', 'getSize', 'start', 'stop', 'startstop', 'started', 'speed', 'refresh', 'refspeed', 'getSpeed', 'getRefspeed', 'size', 'clear', 'step', 'color', 'getColor', 'init', 'deinit'));
    
    return o;
  }

  var o = {
    makeSwitchState: makeSwitchState
  };
  
  window.SS = o;
  
})();
