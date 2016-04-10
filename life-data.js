/***** Game of Life *****/

/* require tools */

(function (udf){
  if (typeof window !== 'undefined'){
    var $ = window.$;
  } else {
    var $ = require('../tools/tools.js');
  }
  
  var data = {
    "glider-gun-se": {
      "arr": [
        "                        *           ",
        "                      * *           ",
        "            **      **            **",
        "           *   *    **            **",
        "**        *     *   **              ",
        "**        *   * **    * *           ",
        "          *     *       *           ",
        "           *   *                    ",
        "            **                      "
      ]
    },
    "glider-se": {
      "arr": [
        "  *",
        "* *",
        " **"
      ],
      "center": [2, 2]
    }
  };
  
  var map = $.map;
  var cpy = $.cpy;
  var spl = $.spl;
  var head = $.head;
  var sli = $.sli;
  var apl = $.apl;
  var num = $.num;
  var err = $.err;
  var strp = $.strp;
  
  function convert(a){
    return map(function (obj){
      var o = cpy(obj);
      o.arr = convertArr(obj.arr);
      return o;
    }, a);
  }
  
  function convertArr(arr){
    return map(convertLine, arr);
  }
  
  function convertLine(line){
    var s = [];
    for (var i = 0; i < line.length; i++){
      if (line[i] !== ' ')s.push(1);
      else s.push(0);
    }
    return s;
  }
  
  var dataConv = convert(data);
  
  function getData(){
    return dataConv;
  }
  
  function clockwise(obj, n){
    if (udfp(n))n = 1;
    for (var i = n; i >= 1; i--){
      obj = clockwise1(obj);
    }
    return obj;
  }
  
  function clockwise1(obj){
    var arr = obj.arr;
    var origrows = arr.length;
    var origcols = arr[0].length;
    var o = {arr: clockwiseArr(arr)};
    if (!udfp(obj.center)){
      var p = obj.center;
      // this is the reverse of the line in clockwiseArr because
      // it is [newi, newj] = [p[1], origrows-1-p[0]]
      // while the other one is [oldi, oldj] = [origrows-1-j, i];
      o.center = [p[1], origrows-1-p[0]];
    }
    return o;
  }
  
  function clockwiseArr(arr){
    var origrows = arr.length;
    var origcols = arr[0].length;
    var r = [];
    for (var i = 0; i < origcols; i++){
      r[i] = [];
      for (var j = 0; j < origrows; j++){
        r[i][j] = arr[origrows-1-j][i];
      }
    }
    return r;
  }
  
  function flip(obj, hv){
    switch (hv){
    case "h": return fliph(obj);
    case "v": return flipv(obj);
    case "hv":
    case "vh": return fliph(flipv(obj));
    default: err(flip, "Unknown direction $1", hv);
    }
  }
  
  function fliph(obj){
    var arr = obj.arr;
    var origrows = arr.length;
    var origcols = arr[0].length;
    var o = {arr: fliphArr(arr)};
    if (!udfp(obj.center)){
      var p = obj.center;
      o.center = [p[0], origcols-1-p[1]];
    }
    return o;
  }
  
  function fliphArr(arr){
    var rows = [];
    for (var i = 0; i < arr.length; i++){
      var row = [];
      for (var j = arr[i].length-1; j >= 0; j--){
        row.push(arr[i][j]);
      }
      rows.push(row);
    }
    return rows;
  }
  
  function flipv(obj){
    var arr = obj.arr;
    var origrows = arr.length;
    var origcols = arr[0].length;
    var o = {arr: flipvArr(arr)};
    if (!udfp(obj.center)){
      var p = obj.center;
      o.center = [origrows-1-p[0], p[1]];
    }
    return o;
  }
  
  function flipvArr(arr){
    var rows = [];
    for (var i = arr.length-1; i >= 0; i--){
      rows.push(arr[i]);
    }
    return rows;
  }
  
  function applyTrans(obj, trans){
    var arr = spl(trans, "|");
    arr.forEach(function (a){
      obj = applyTrans1(obj, a);
    });
    return obj;
  }
  
  function applyTrans1(obj, a){
    var line = spl(a, "_");
    var fn = getFn(line[0]);
    if (strp(fn))return applyTrans(obj, fn);
    var args = head(obj, sli(line, 1));
    return apl(fn, args);
  }
  
  var fs = {
    "clockwise": function (obj, n){
      return clockwise(obj, num(n));
    },
    "flip": function (obj, hv){
      return flip(obj, hv);
    }
  };
  
  function getFn(f){
    if (!udfp(fs[f]))return fs[f];
    err(getFn, "Unknown function $1", f);
  }
  
  var o = {
    convert,
    convertArr,
    convertLine,
    getData,
    clockwise,
    applyTrans
  };
  
  if (typeof window !== 'undefined'){
    window.LD = o;
  }
  
  if (typeof exports !== 'undefined'){
    module.exports = o;
  }
  
})();
