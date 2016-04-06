
QUnit.test('mkfn', function (assert){
  assert.diff(S.mkfn(0), 0);
  assert.same(S.mkfn(0)(), 0);
  var a = [1, 2, 3];
  assert.same(S.mkfn(a)(), a);
  var a = function (){};
  assert.same(S.mkfn(a), a);
});

QUnit.test('createarr', function (assert){
  assert.same(S.createarr(3, 2), [2, 2, 2], $.iso);
  assert.same(S.createarr(0, 2), [], $.iso);
  assert.same(S.createarr(1, 2), [2], $.iso);
  assert.diff(S.createarr(3, function (){return [];}), [[], [], []], $.iso);
  assert.same(S.createarr(3, function (){return [];}), [[], [], []], $.levelison(2));
  assert.same(S.createarr(0, function (){return [];}), [], $.iso);
});

QUnit.test('create', function (assert){
  assert.same(S.create(2, 3, 0), [
    [0, 0, 0],
    [0, 0, 0]
  ], $.levelison(2));
});

QUnit.test('pushn', function (assert){
  var a = [1, 2, 3];
  S.pushn(2, 0, a);
  assert.same(a, [1, 2, 3, 0, 0], $.iso);
});

QUnit.test('delnfromend', function (assert){
  var a = [1, 2, 3];
  S.delnfromend(2, a);
  assert.same(a, [1], $.iso);
  
  var a = [1, 2, 3];
  S.delnfromend(0, a);
  assert.same(a, [1, 2, 3], $.iso);
});

QUnit.test('changesizearr', function (assert){
  var a = [1, 2, 3];
  S.changesizearr(a, 5, 0);
  assert.same(a, [1, 2, 3, 0, 0], $.iso);
  
  var a = [1, 2, 3];
  S.changesizearr(a, 2, 0);
  assert.same(a, [1, 2], $.iso);
});

QUnit.test('changesize', function (assert){
  var a;
  function setup(){
    a = [
      [1, 2, 3],
      [5, 6, 7],
      [3, 4, 2]
    ];
  }
  
  setup();
  S.changesize(a, 3, 3, 0);
  assert.same(a, [
    [1, 2, 3],
    [5, 6, 7],
    [3, 4, 2]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 2, 3, 0);
  assert.same(a, [
    [1, 2, 3],
    [5, 6, 7]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 3, 2, 0);
  assert.same(a, [
    [1, 2],
    [5, 6],
    [3, 4]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 2, 2, 0);
  assert.same(a, [
    [1, 2],
    [5, 6]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 4, 3, 0);
  assert.same(a, [
    [1, 2, 3],
    [5, 6, 7],
    [3, 4, 2],
    [0, 0, 0]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 3, 4, 0);
  assert.same(a, [
    [1, 2, 3, 0],
    [5, 6, 7, 0],
    [3, 4, 2, 0]
  ], $.levelison(2));
  
  setup();
  S.changesize(a, 4, 4, 0);
  assert.same(a, [
    [1, 2, 3, 0],
    [5, 6, 7, 0],
    [3, 4, 2, 0],
    [0, 0, 0, 0]
  ], $.levelison(2));
});