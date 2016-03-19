/***** Game of Life *****/

/* require tools */

(function (udf){
  if (typeof module !== 'undefined'){
    var $ = require('./tools-ext.js');
    var S = require('./state.js');
  }
  
  var itrrefresh = $.itrrefresh;
  
  var createfrom = S.createfrom;
  var filled = S.filled;
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
    
    var onfill, onempty, onsetstate;
    
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
    
    sup.setState = over.setState;
    
    over.setState = function (newstate){
      sup.setState(newstate);
      if (!runner.started()){
        onsetstate(newstate);
      }
    };
    
    function clearHandlers(){
      onfill = function (i, j){};
      onempty = function (i, j){};
      onsetstate = function (newstate){};
    }
    
    clearHandlers();
    
    runner.onrefresh = function (){
       onsetstate(state.getState());
    };
    
    var onstop = function (){};
    
    runner.onstop = function (){
      runner.refresh();
      onstop();
    };
    
    function clear(){
      runner.stop();
      state.clear();
    }
    
    function step(){
      state.setState(next(state.getState()));
    }
    
    return {
      set onfill(f){onfill = f;},
      set onempty(f){onempty = f;},
      set onsetstate(f){onsetstate = f;},
      clearHandlers: clearHandlers,
      valie: state.valid,
      fill: state.fill,
      filled: state.filled,
      empty: state.empty,
      set: state.set,
      setNum: state.setNum,
      getState: state.getState,
      setState: state.setState,
      set onstart(f){runner.onstart = f;},
      set onstop(f){onstop = f;},
      start: runner.start,
      stop: runner.stop,
      startstop: runner.startstop,
      started: runner.started,
      speed: runner.speed,
      refresh: runner.refresh,
      refspeed: runner.refspeed,
      clear: clear,
      step: step
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
