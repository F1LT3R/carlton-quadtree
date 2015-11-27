var tests = []
  , begunTests = false
  , current_test = null
  , failures = 0
  ;

function expect (expect) {

  var assert = {
    expected: expect
  };

  current_test.asserts.push(assert);

  return {

    // Type check ===
    toBe: function (actual) {
      
      assert.actual = actual;
      assert.type = "toBe";
      
      if (expect === actual) {
        return pass(assert);
      }

      if (expect !== actual) {
        return fail(assert);
      }
    },

    // Truthy check ==
    toEqual: function (actual) {
      
      assert.actual = actual;
      assert.type = "toEqual";
      
      if (expect == actual) {
        return pass(assert);
      }

      if (expect != actual) {
        return fail(assert);
      }
    },

    toBeGreaterThan: function (actual) {
      
      assert.actual = actual;
      assert.type = "toBeGreaterThan";
      
      if (expect > actual) {
        return pass(assert);
      }

      if (expect <= actual) {
        return fail(assert);
      }
    },


  }
}

// hi
// :) love you

function pass () {
  // console.log('.');
  return true;
}

function fail (assert) {
  failures += 1;
  console.log('Fail: "'+(current_test.desc)+'",');
  console.log('\tExpected: '+('('+(typeof assert.expected)+') "'+assert.expected)+'" ' +
      assert.type+': '+('('+(typeof assert.actual)+') "'+assert.actual)+'"');
  return false;
}

function failTimeout (elapsed) {
  failures += 1;
  console.log('Fail: "'+current_test.desc+'",');
  console.log('\tTimeout expected: < '+current_test.timeout + ' ms, Actual: '+elapsed+' ms.');
  return false;
}

function describe (should, callback, ms) {
  tests.push({
    desc: should,
    spec: callback,
    asserts: [],
    timeout: ms
  });
  
  if (begunTests) {
    runTests();
  }
}


function runTests () {

  // overwrite describe for inner tests (maybe not a great idea)
  describe = function (should, callback, ms) {
    var start = + new Date();

    (function (spec) {
      spec();
    }) (callback);

    var now = + new Date()
      , elapsed = now - start
      ;
    
    if (ms) {
      if (elapsed > ms) {
        failTimeout(elapsed);
      }
    }    
  }

  var startTests = + new Date();

  tests.forEach(function (test) {
    current_test = test;

    var start = + new Date();

    (function (spec) {
        spec();
    }) (test.spec);

    var now = + new Date()
      , elapsed = now - start
      ;
    
    if (test.timeout) {
      if (elapsed > test.timeout) {
        failTimeout(elapsed);
      }
    }
  });

  var endTests = + new Date()
    , elapsed = endTests - startTests
    ;

  if (failures === 0) {
    console.log('All Tests pass in ' +(elapsed/1000) + ' seconds.');
  }

}


module.exports = {
  describe: describe,
  expect: expect,
  run: runTests,
};




// describe('Tests should work', function () {
//   expect(1).toBe(1);
//   expect(2).toBe(2); 
//   expect(3).toBe(3);
//   expect(4).toBe(4); 
// });

// describe('Tests should fail', function () {
//   expect('').toEqual(0);
// });
