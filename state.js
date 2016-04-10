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
    return state[i][j] >= 1;
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
    
    over.set = function (st, i, j){};
    
    function set(st, i, j){
      over.set(st, i, j);
    }
    
    function setObj(st, i, j, obj){
      over.setObj(st, i, j, obj);
    }
    
    over.setObj = function (st, i, j, obj){
      apply(setter(st), i, j, obj);
    };
    
    function setter(st){
      return function (i, j){
        set(st, i, j);
      };
    }
    
    return {
      over: over,
      set: set, 
      setObj: setObj,
      setter: setter
    };
  }
  
  function makeSimpleState(rows, cols){
    if (udfp(rows))rows = 0;
    if (udfp(cols))cols = 0;
    var vars = {};
    vars.rows = rows;
    vars.cols = cols;
    
    function valid(i, j){
      return i >= 0 && j >= 0 && i < vars.rows && j < vars.cols;
    }
    
    var fes = fillemptysys();
    
    var over = fes.over;
    
    over.set = function (st, i, j){
      if (!valid(i, j))return;
      vars.state[i][j] = st;
    };
    
    var set = fes.set;
    var setObj = fes.setObj;
    var setter = fes.setter;
    
    function get(i, j){
      if (!valid(i, j))return false;
      return vars.state[i][j];
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
    
    function getSize(){
      return [vars.rows, vars.cols];
    }
    
    function clear(){
      setState(create(vars.rows, vars.cols, 0));
    }
    
    clear();
    
    return {
      vars: vars,
      over: over,
      
      valid: valid,
      set: set,
      get: get,
      setObj: setObj,
      setter: setter,
      getState: getState,
      setState: setState,
      size: size,
      getSize: getSize,
      clear: clear
    };
  }
  
  function makeState(rows, cols){
    var state = makeSimpleState(rows, cols);
    
    var vars = state.vars;
    var over = state.over;
    
    var onset;
    
    var valid = state.valid;
    
    over.set = function (st, i, j){
      if (!valid(i, j))return;
      if (vars.state[i][j] !== st){
        vars.state[i][j] = st;
        onset(st, i, j);
      }
    };
    
    var set = state.set;
    
    over.setState = function (newstate){
      for (var i = 0; i < vars.rows; i++){
        for (var j = 0; j < vars.cols; j++){
          if (vars.state[i][j] !== newstate[i][j]){
            set(newstate[i][j], i, j);
          }
        }
      }
    };
    
    function clearHandlers(){
      onset = function (st, i, j){};
    }
    
    clearHandlers();
    
    return {
      valid: state.valid,
      set: state.set,
      setObj: state.setObj,
      setter: state.setter,
      getState: state.getState,
      setState: state.setState,
      size: state.size,
      getSize: state.getSize,
      clear: state.clear,
      set onset(f){onset = f;},
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
