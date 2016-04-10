/***** Game of Life *****/

/* require tools */

(function (udf){
  if (typeof window !== 'undefined'){
    var $ = window.$;
    var S = window.S;
  } else {
    var $ = require('../tools/tools.js');
    var S = require('./state.js');
  }
  
  var itrrefresh = $.itrrefresh;
  
  var createfrom = S.createfrom;
  var filled = S.filled;
  var apply = S.apply;
  var makeSimpleState = S.makeSimpleState;
  
  function next(state){
    //console.log("here");
    var newstate = createfrom(state, -1);
    for (var i = 0; i < state.length; i++){
      for (var j = 0; j < state[i].length; j++){
        if (state[i][j] >= 1){
          fillNewstateCircle(newstate, state, i, j);
        }
      }
    }
    return newstate;
  }
  
  function fillNewstateCircle(newstate, state, i, j){
    for (var k = i-1; k <= i+1; k++){
      if (k < 0 || k >= state.length)continue;
      for (var l = j-1; l <= j+1; l++){
        if (l < 0 || l >= state[k].length)continue;
        if (newstate[k][l] === -1){
          newstate[k][l] = next1(state, k, l);
        }
      }
    }
  }
  
  function next1(state, i, j){
    var obj = neighbors(state, i, j);
    var n = obj.n;
    if (filled(state, i, j)){
      return (n == 2 || n == 3)?state[i][j]:0;
    } else {
      if (n !== 3)return 0;
      var colors = obj.colors;
      for (var i in colors){
        if (colors[i] >= 2)return i;
      }
      return 1;
    }
  }
  
  function neighbors(state, i, j){
    var obj = {
      n: 0,
      colors: {}
    };
    procNeighbor(obj, state, i-1, j-1);
    procNeighbor(obj, state, i-1, j);
    procNeighbor(obj, state, i-1, j+1);
    procNeighbor(obj, state, i, j-1);
    procNeighbor(obj, state, i, j+1);
    procNeighbor(obj, state, i+1, j-1);
    procNeighbor(obj, state, i+1, j);
    procNeighbor(obj, state, i+1, j+1);
    return obj;
  }
  
  function procNeighbor(obj, state, i, j){
    if (filled(state, i, j)){
      var value = state[i][j];
      obj.n++;
      if (udfp(obj.colors[value]))obj.colors[value] = 1;
      else obj.colors[value]++;
    }
  }
  
  function makeLifeState(rows, cols){
    var state = makeSimpleState(rows, cols);
    var runner = itrrefresh(step, 50, 1);
    
    var over = state.over;
    var sup = {};
    
    var onset, onsetstate, onstart, onstop, onspeed, onrefspeed, onsetobj, onsize;
    
    sup.set = over.set;
    
    over.set = function (st, i, j){
      sup.set(st, i, j);
      if (!runner.started()){
        onset(st, i, j);
      }
    };
    
    sup.setObj = over.setObj;
    
    over.setObj = function (st, i, j, obj){
      if (!runner.started() && onsetobj !== defonsetobj){
        S.apply(function (i, j){sup.set(st, i, j);}, i, j, obj);
        onsetobj(st, i, j, obj);
      } else {
        sup.setObj(st, i, j, obj);
      }
    };
    
    sup.setState = over.setState;
    
    over.setState = function (newstate){
      sup.setState(newstate);
      if (!runner.started()){
        onsetstate(newstate);
      }
    };
    
    function size(r, c){
      state.size(r, c);
      onsize(r, c);
    }
    
    runner.onrefresh = function (){
       onsetstate(state.getState());
    };
    
    runner.onstart = function (){
      onstart();
    };
    
    runner.onstop = function (){
      runner.refresh();
      onstop();
    };
    
    function speed(s){
      runner.speed(s);
      onspeed(s);
    }
    
    function refspeed(r){
      runner.refspeed(r);
      onrefspeed(r);
    }
    
    var defonsetobj = function (i, j, obj){};
    
    function clearHandlers(){
      onset = function (i, j){};
      onsetstate = function (newstate){};
      onstart = function (){};
      onstop = function (){};
      onspeed = function (s){};
      onrefspeed = function (r){};
      onsetobj = defonsetobj;
      onsize = function (r, c){};
    }
    
    clearHandlers();
    
    function init(o){
      if (!udfp(o)){
        state.size(o.size[0], o.size[1]);
        state.setState(o.state);
        runner.speed(o.speed);
        runner.refspeed(o.refspeed);
      }
    }
    
    function deinit(){
      runner.stop();
      clearHandlers();
      return {
        state: state.getState(),
        speed: runner.getSpeed(),
        refspeed: runner.getRefspeed(),
        size: state.getSize()
      };
    }
    
    function clear(){
      runner.stop();
      state.clear();
    }
    
    function step(){
      state.setState(next(state.getState()));
    }
    
    return {
      valid: state.valid,
      set: state.set,
      get: state.get,
      setObj: state.setObj,
      getState: state.getState,
      setState: state.setState,
      getSize: state.getSize,
      set onset(f){onset = f;},
      set onsetstate(f){onsetstate = f;},
      set onstart(f){onstart = f;},
      set onstop(f){onstop = f;},
      set onspeed(f){onspeed = f;},
      set onrefspeed(f){onrefspeed = f;},
      set onsetobj(f){onsetobj = f;},
      set onsize(f){onsize = f;},
      clearHandlers: clearHandlers,
      start: runner.start,
      stop: runner.stop,
      startstop: runner.startstop,
      started: runner.started,
      speed: speed,
      refresh: runner.refresh,
      refspeed: refspeed,
      getSpeed: runner.getSpeed,
      getRefspeed: runner.getRefspeed,
      size: size,
      clear: clear,
      step: step,
      init: init,
      deinit: deinit
    };
  }
  
  var o = {
    next: next,
    makeLifeState: makeLifeState,
    neighbors: neighbors
  };
  
  if (typeof window !== 'undefined'){
    window.LS = o;
  }
  
  if (typeof exports !== 'undefined'){
    module.exports = o;
  }
  
})();
