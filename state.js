/***** State *****/

(function (udf){
  if (typeof module !== 'undefined'){
    var $ = require('../tools/tools.js');
  }
  
  var udfp = $.udfp;
  
  function create(rows, cols, v){
    var a = [];
    for (var i = 0; i < rows; i++){
      a[i] = [];
      for (var j = 0; j < cols; j++){
        a[i][j] = v;
      }
    }
    return a;
  }
  
  function createfrom(state, v){
    var rows = state.length;
    var cols = (rows >= 1)?state[0].length:0;
    return create(rows, cols, v);
  }
  
  function valid(state, i, j){
    return i >= 0 && j >= 0 && i < state.length && j < state[i].length;
  }
  
  function filled(state, i, j){
    if (!valid(state, i, j))return false;
    return state[i][j] === 1;
  }
  
  function apply(fill, i, j, obj){
    var arr = obj.arr;
    if (udfp(obj.center)){
      ci = Math.floor(arr.length/2);
      cj = Math.floor(arr[0].length/2);
    } else {
      ci = obj.center[0];
      cj = obj.center[1];
    }
    for (var r = 0; r < arr.length; r++){
      for (var c = 0; c < arr[r].length; c++){
        if (arr[r][c] === 1)fill(i+r-ci, j+c-cj);
      }
    }
  }
  
  function makeSimpleState(rows, cols){
    var vars = {}; var over = {};
    
    function valid(i, j){
      return i >= 0 && j >= 0 && i < rows && j < cols;
    }
    
    over.fill = function (i, j){
      if (!valid(i, j))return;
      vars.state[i][j] = 1;
    };
    
    over.empty = function (i, j){
      if (!valid(i, j))return;
      vars.state[i][j] = 0;
    };
    
    function fill(i, j){
      over.fill(i, j);
    }
    
    function empty(i, j){
      over.empty(i, j);
    }
    
    function filled(i, j){
      if (!valid(i, j))return false;
      return vars.state[i][j] === 1;
    }
    
    function set(tf, i, j){
      (tf?fill:empty)(i, j);
    }
    
    function setNum(st, i, j){
      set(st === 1, i, j);
    }
    
    function toggle(i, j){
      set(!filled(i, j), i, j);
    }
    
    function getState(){
      return vars.state;
    }
    
    over.setState = function (newstate){
      vars.state = newstate;
    };
    
    function setState(newstate){
      over.setState(newstate);
    }
    
    function clear(){
      setState(create(rows, cols, 0));
    }
    
    clear();
    
    return {
      vars: vars,
      over: over,
      
      valid: valid,
      fill: fill,
      empty: empty,
      filled: filled,
      set: set,
      setNum: setNum,
      toggle: toggle,
      getState: getState,
      setState: setState,
      clear: clear
    };
  }
  
  function makeState(rows, cols){
    var state = makeSimpleState(rows, cols);
    
    var vars = state.vars;
    var over = state.over;
    
    var onfill, onempty;
    
    var valid = state.valid;
    
    over.fill = function (i, j){
      if (!valid(i, j))return;
      if (vars.state[i][j] !== 1){
        vars.state[i][j] = 1;
        onfill(i, j);
      }
    };
    
    over.empty = function (i, j){
      if (!valid(i, j))return;
      if (vars.state[i][j] === 1){
        vars.state[i][j] = 0;
        onempty(i, j);
      }
    };
    
    var setNum = state.setNum;
    
    over.setState = function (newstate){
      for (var i = 0; i < rows; i++){
        for (var j = 0; j < cols; j++){
          if ((vars.state[i][j] === 1) !== (newstate[i][j] === 1)){
            setNum(newstate[i][j], i, j);
          }
        }
      }
    };
    
    function clearHandlers(){
      onfill = function (i, j){};
      onempty = function (i, j){};
    }
    
    clearHandlers();
    
    return {
      valid: state.valid,
      fill: state.fill,
      empty: state.empty,
      filled: state.filled,
      set: state.set,
      setNum: state.setNum,
      toggle: state.toggle,
      getState: state.getState,
      setState: state.setState,
      clear: state.clear,
      set onfill(f){onfill = f;},
      set onempty(f){onempty = f;},
      clearHandlers: clearHandlers
    };
  }
  
  var o = {
    create: create,
    createfrom: createfrom,
    valid: valid,
    filled: filled,
    apply: apply,
    makeSimpleState: makeSimpleState,
    makeState: makeState
  };
  
  if (typeof window !== 'undefined'){
    window.S = o;
  }
  
  if (typeof module !== 'undefined'){
    module.exports = o;
  }
  
})();
