/***** State *****/

(function (udf){
  if (typeof window !== 'undefined'){
    var $ = window.$;
  } else {
    var $ = require('./tools-ext.js');
  }
  
  var udfp = $.udfp;
  var push = $.push;
  var fnp = $.fnp;
  
  function mkfn(v){
    if (fnp(v))return v;
    return function (){return v;};
  }
  
  function createarr(len, v){
    v = mkfn(v);
    var a = [];
    for (var i = 0; i < len; i++){
      a[i] = v();
    }
    return a;
  }
  
  function create(rows, cols, v){
    return createarr(rows, function (){return createarr(cols, v);});
  }
  
  function createfrom(state, v){
    var rows = state.length;
    var cols = (rows >= 1)?state[0].length:0;
    return create(rows, cols, v);
  }
  
  function pushn(n, x, a){
    x = mkfn(x);
    for (var i = n; i >= 1; i--){
      push(x(), a);
    }
  }
  
  function delnfromend(n, a){
    a.splice(a.length-n, n);
  }
  
  function changesizearr(a, l, v){
    if (l > a.length){
      pushn(l-a.length, v, a);
    } else if (l < a.length){
      delnfromend(a.length-l, a);
    }
  }
  
  function changesize(state, rows, cols, v){
    for (var i = 0; i < state.length; i++){
      changesizearr(state[i], cols, v);
    }
    changesizearr(state, rows, function (){return createarr(cols, v);});
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
  
  function fillemptysys(){
    var over = {};
    
    over.fill = function (i, j){};
    over.empty = function (i, j){};
    
    function fill(i, j){
      over.fill(i, j);
    }
    
    function empty(i, j){
      over.empty(i, j);
    }
    
    function fillObj(i, j, obj){
      over.fillObj(i, j, obj);
    }
    
    over.fillObj = function (i, j, obj){
      apply(fill, i, j, obj);
    };
    
    function set(tf, i, j){
      (tf?fill:empty)(i, j);
    }
    
    function setNum(st, i, j){
      set(st === 1, i, j);
    }
    
    return {
      over: over,
      fill: fill,
      empty: empty,
      fillObj: fillObj,
      set: set,
      setNum: setNum
    };
  }
  
  function makeSimpleState(rows, cols){
    var vars = {};
    vars.rows = rows;
    vars.cols = cols;
    
    function valid(i, j){
      return i >= 0 && j >= 0 && i < vars.rows && j < vars.cols;
    }
    
    var fes = fillemptysys();
    
    var over = fes.over;
    
    over.fill = function (i, j){
      if (!valid(i, j))return;
      vars.state[i][j] = 1;
    };
    
    over.empty = function (i, j){
      if (!valid(i, j))return;
      vars.state[i][j] = 0;
    };
    
    var fill = fes.fill;
    var empty = fes.empty;
    var fillObj = fes.fillObj;
    var set = fes.set;
    var setNum = fes.setNum;
    
    function filled(i, j){
      if (!valid(i, j))return false;
      return vars.state[i][j] === 1;
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
    
    function size(rows, cols){
      changesize(vars.state, rows, cols, 0);
      vars.rows = rows;
      vars.cols = cols;
    }
    
    function clear(){
      setState(create(vars.rows, vars.cols, 0));
    }
    
    clear();
    
    return {
      vars: vars,
      over: over,
      
      valid: valid,
      fill: fill,
      empty: empty,
      filled: filled,
      fillObj: fillObj,
      set: set,
      setNum: setNum,
      toggle: toggle,
      getState: getState,
      setState: setState,
      size: size,
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
      for (var i = 0; i < vars.rows; i++){
        for (var j = 0; j < vars.cols; j++){
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
      fillObj: state.fillObj,
      set: state.set,
      setNum: state.setNum,
      toggle: state.toggle,
      getState: state.getState,
      setState: state.setState,
      size: state.size,
      clear: state.clear,
      set onfill(f){onfill = f;},
      set onempty(f){onempty = f;},
      clearHandlers: clearHandlers
    };
  }
  
  var o = {
    mkfn: mkfn,
    createarr: createarr,
    pushn: pushn,
    delnfromend: delnfromend,
    changesizearr: changesizearr,
    changesize: changesize,
    create: create,
    createfrom: createfrom,
    valid: valid,
    filled: filled,
    apply: apply,
    fillemptysys: fillemptysys,
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
