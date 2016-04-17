/***** Game of Life *****/

/* require tools */

(function (udf){
  if (typeof window !== 'undefined'){
    var $ = window.$;
    var LS = window.LS;
  } else {
    var $ = require('../tools/tools.js');
    var LS = require('./life-state.js');
  }
  
  var makeLifeState = LS.makeLifeState;
  
  function makeColorState(rows, cols){
    var state = makeLifeState(rows, cols);
    
    var c = 1;
    
    function color(st){
      c = st;
      oncolor(st);
    }
    
    function getColor(){
      return c;
    }
    
    function fill(i, j){
      state.set(c, i, j);
    }
    
    function empty(i, j){
      state.set(0, i, j);
    }
    
    function fillObj(i, j, obj){
      state.setObj(c, i, j, obj);
    }
    
    function filltf(tf, i, j){
      state.set(tf?c:0, i, j);
    }
    
    function filled(i, j){
      return state.get(i, j) === c;
    }
    
    var oncolor;
    
    function clearHandlers(){
      state.clearHandlers();
      oncolor = function (c){};
    }
    
    clearHandlers();
    
    function init(o){
      state.init(o);
      if (!udfp(o) && !udfp(o.color)){
        color(o.color);
      }
    }
    
    function deinit(){
      var o = state.deinit();
      o.color = getColor();
      return o;
    }
    
    return {
      valid: state.valid,
      fill: fill,
      fillObj: fillObj,
      filltf: filltf,
      filled: filled,
      getState: state.getState,
      setState: state.setState,
      getSize: state.getSize,
      set onset(f){state.onset = f;},
      set onsetstate(f){state.onsetstate = f;},
      set onstart(f){state.onstart = f;},
      set onstop(f){state.onstop = f;},
      set onspeed(f){state.onspeed = f;},
      set onrefspeed(f){state.onrefspeed = f;},
      set onsetobj(f){state.onsetobj = f;},
      set onsize(f){state.onsize = f;},
      set oncolor(f){oncolor = f;},
      clearHandlers: clearHandlers,
      start: state.start,
      stop: state.stop,
      startstop: state.startstop,
      started: state.started,
      speed: state.speed,
      refresh: state.refresh,
      refspeed: state.refspeed,
      getSpeed: state.getSpeed,
      getRefspeed: state.getRefspeed,
      size: state.size,
      clear: state.clear,
      step: state.step,
      color: color,
      getColor: getColor,
      init: init,
      deinit: deinit
    };
  }
  
  var o = {
    makeColorState: makeColorState
  };
  
  if (typeof window !== 'undefined'){
    window.LC = o;
  }
  
  if (typeof exports !== 'undefined'){
    module.exports = o;
  }
  
})();
