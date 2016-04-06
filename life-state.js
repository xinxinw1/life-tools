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
        if (state[i][j] === 1){
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
    var n = neighbors(state, i, j);
    if (filled(state, i, j)){
      return (n == 2 || n == 3)?1:0;
    } else {
      return (n == 3)?1:0;
    }
  }
  
  function neighbors(state, i, j){
    var n = 0;
    if (filled(state, i-1, j-1))n++;
    if (filled(state, i-1, j))n++;
    if (filled(state, i-1, j+1))n++;
    if (filled(state, i, j-1))n++;
    if (filled(state, i, j+1))n++;
    if (filled(state, i+1, j-1))n++;
    if (filled(state, i+1, j))n++;
    if (filled(state, i+1, j+1))n++;
    return n;
  }
  
  function makeLifeState(rows, cols){
    var state = makeSimpleState(rows, cols);
    var runner = itrrefresh(step, 50, 1);
    
    var over = state.over;
    var sup = {};
    
    var onfill, onempty, onsetstate, onstart, onstop, onspeed, onrefspeed, onfillobj, onsize;
    
    sup.fill = over.fill;
    
    over.fill = function (i, j){
      sup.fill(i, j);
      if (!runner.started()){
        onfill(i, j);
      }
    };
    
    sup.empty = over.empty;
    
    over.empty = function (i, j){
      sup.empty(i, j);
      if (!runner.started()){
        onempty(i, j);
      }
    };
    
    sup.fillObj = over.fillObj;
    
    over.fillObj = function (i, j, obj){
      if (!runner.started() && onfillobj !== defonfillobj){
        S.apply(sup.fill, i, j, obj);
        onfillobj(i, j, obj);
      } else {
        sup.fillObj(i, j, obj);
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
    
    var defonfillobj = function (i, j, obj){};
    
    function clearHandlers(){
      onfill = function (i, j){};
      onempty = function (i, j){};
      onsetstate = function (newstate){};
      onstart = function (){};
      onstop = function (){};
      onspeed = function (s){};
      onrefspeed = function (r){};
      onfillobj = defonfillobj;
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
      fill: state.fill,
      filled: state.filled,
      empty: state.empty,
      fillObj: state.fillObj,
      set: state.set,
      setNum: state.setNum,
      getState: state.getState,
      setState: state.setState,
      getSize: state.getSize,
      set onfill(f){onfill = f;},
      set onempty(f){onempty = f;},
      set onsetstate(f){onsetstate = f;},
      set onstart(f){onstart = f;},
      set onstop(f){onstop = f;},
      set onspeed(f){onspeed = f;},
      set onrefspeed(f){onrefspeed = f;},
      set onfillobj(f){onfillobj = f;},
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
  };
  
  if (typeof window !== 'undefined'){
    window.LS = o;
  }
  
  if (typeof exports !== 'undefined'){
    module.exports = o;
  }
  
})();
