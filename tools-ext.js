/***** Tools Ext *****/

(function (udf){
  if (typeof window !== 'undefined'){
    var $ = window.$;
  } else {
    var $ = require('../tools/tools-itr.js');
  }
  
  var udfp = $.udfp;
  
  
  $.att($, {
  });
  
  if ($.nodep){
    module.exports = $;
  }
})();