var tests = []
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
  console.log('Fail: "'+current_test.desc+'",');
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
}

function runTests () {
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


// describe('Tests should work', function () {
//   expect(1).toBe(1);
//   expect(2).toBe(2); 
//   expect(3).toBe(3);
//   expect(4).toBe(4); 
// });

// describe('Tests should fail', function () {
//   expect('').toEqual(0);
// });




var props = {
  bounds: {
    top: 0,
    left: 0,
    bottom: 1.001,
    right: 1.001,
  }
};

var Leaf = require('./Leaf.js');











describe('Leaf should require definition properties', function () {
  
  var leaf = Leaf();
  expect(typeof leaf).toBe('undefined');

  var leaf = Leaf({});
  expect(typeof leaf).toBe('undefined');

  var leaf = Leaf({ bounds: null });
  expect(typeof leaf).toBe('undefined');

});



describe('Leaf should be undefined if no bounds dimensions are passed', function () {

  var leaf = Leaf({
    bounds: {
      // top: 0,
      left: 0,
      bottom: 1,
      right: 1,
    }
  });
  expect(typeof leaf).toBe('undefined');

  var leaf = Leaf({
    bounds: {
      top: 0,
      // left: 0,
      bottom: 1,
      right: 1,
    }
  });
  expect(typeof leaf).toBe('undefined');

  var leaf = Leaf({
    bounds: {
      top: 0,
      left: 0,
      // bottom: 1,
      right: 1,
    }
  });
  expect(typeof leaf).toBe('undefined');


  var leaf = Leaf({
    bounds: {
      top: 0,
      left: 0,
      bottom: 1,
      // right: 1,
    }
  });
  expect(typeof leaf).toBe('undefined');

});



describe('Leaf should instantiate if bounds have top, left, bottom, right dimensions', function () {

  var leaf = Leaf({
    bounds: {
      top: 0,
      left: 0,
      bottom: 1,
      right: 1,
    }
  });
  
  expect(typeof leaf).toBe('object');
  expect(typeof leaf.bounds).toBe('object');
  expect(typeof leaf.bounds.top).toBe('number');
  expect(typeof leaf.bounds.left).toBe('number');
  expect(typeof leaf.bounds.bottom).toBe('number');
  expect(typeof leaf.bounds.right).toBe('number');

});






describe('New leaf should have no items and no leaves', function () {
  var leaf = Leaf(props);
  expect(leaf.items.length).toBe(0);
  expect(leaf.leaves.length).toBe(0);
});



describe('Adding an item should fail x, y, val/objectReference', function () {

  var leaf = Leaf(props);
  leaf.addItem({});
  expect(leaf.items.length).toBe(0);

  var leaf = Leaf(props);
  leaf.addItem({
    // x: 0,
    y: 0,
    val: 'A',
  });
  expect(leaf.items.length).toBe(0);

  var leaf = Leaf(props);
  leaf.addItem({
    x: 0,
    // y: 0,
    val: 'A',
  });
  expect(leaf.items.length).toBe(0);

  var leaf = Leaf(props);
  leaf.addItem({
    x: 0,
    y: 0,
    // val: 'A',
  });
  expect(leaf.items.length).toBe(0);

});



describe('Leaf should have 1 item after adding first item', function () {

  var leaf = Leaf(props);
  leaf.addItem({ x: 0, y: 0, val: 'A' });
  expect(leaf.items.length).toBe(1);

});



describe('Leaf should have 2 items after adding second item', function () {

  var leaf = Leaf(props);
  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  expect(leaf.items.length).toBe(2);

});



describe('Leaf should have 3 items after adding third item', function () {

  var leaf = Leaf(props);
  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  expect(leaf.items.length).toBe(3);

});



describe('Leaf should have 4 items after adding forth item', function () {

  var leaf = Leaf(props);
  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  leaf.addItem({ x: 0, y: 1, val: 'D' });
  expect(leaf.items.length).toBe(4);

});



describe('getItems should return 4 and 5 items respectively', function () {

  var leaf = Leaf(props);
  
  // Add 4 items
  for (var i=0; i< 4; i++) {
    leaf.addItem({
      x: Math.random(),
      y: Math.random(),
      val: i
    });
  }

  // Check we have 4 items
  expect(typeof leaf).toBe('object');
  expect(leaf.getItems().length).toBe(4)

  // Add one more item
  leaf.addItem({
    x: Math.random(),
    y: Math.random(),
    val: i
  });

  // check we have 5 items
  expect(leaf.getItems().length).toBe(5)
  
});



describe('Leaf should count 16,384 items after adding 16,384 items', function () {

  var leaf = Leaf(props);
  
  for (var i=0; i< 16384; i++) {
    leaf.addItem({
      x: Math.random(), // random from 0-1 
      y: Math.random(), // random from 0-1
      val: i
    });
  }

  expect(typeof leaf).toBe('object');
  expect(leaf.getItems().length).toBe(16384)

}, 400);



describe('Item should have reference to leaf', function () {

  var leaf = Leaf(props);
  
  leaf.addItem({ x: 0, y: 0, val: 'A' });
  
  var item = leaf.items[0];
  
  expect(typeof item.leaf).toBe('object');
  
  // Should see it's own reflection
  expect(item.leaf.items.length).toBe(1);

});


describe('Item\'s leaf reference should change when it\s leaf changes', function () {

  var leaf = Leaf(props);

  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  leaf.addItem({ x: 0, y: 1, val: 'D' });

  leaf.addItem({ x: 0.125, y: 0.125, val: 'E' });
  
  var item = leaf.leaves[0].items[0];
  
  expect(typeof item.leaf).toBe('object');
  
  // There shouldbe two items on this leaf
  expect(item.leaf.items.length).toBe(2);
  
  // The item itself should have no id
  expect(typeof item.id).toBe('undefined');

  // Check the the IDs on this leaf are the same
  expect(item.leaf.id).toEqual(item.leaf.items[0].leaf.id);
  expect(item.leaf.id).toEqual(item.leaf.items[1].leaf.id);

});



describe('getUnEmptyLeaves should return 4 leaves, each containing 1 item', function () {

  var leaf = Leaf(props);

  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  leaf.addItem({ x: 0, y: 1, val: 'D' });

  var unEmptyLeaves = leaf.getUnEmptyLeaves();
  
  expect(unEmptyLeaves.length).toEqual(1);

  // Expect the only unempty lead to have 4 items
  expect(unEmptyLeaves[0].items.length).toBe(4);

});






describe('getUnEmptyLeaves should return 4 leaves, each containing > 0 items', function () {

  var leaf = Leaf(props);

  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  leaf.addItem({ x: 0, y: 1, val: 'D' });

  leaf.addItem({ x: 0.125, y: 0.125, val: 'E' });

  var unEmptyLeaves = leaf.getUnEmptyLeaves();

  expect(unEmptyLeaves.length).toEqual(4);

  // Expect all the leaves to have more than 0 items
  unEmptyLeaves.forEach(function (subleaf) {
    expect(subleaf.items.length).toBeGreaterThan(0);
  });

});




describe('unEmptyLeaves.items length should match getItems.length', function () {

  var leaf = Leaf(props);

  leaf.addItem({ x: 0, y: 0, val: 'A' });
  leaf.addItem({ x: 1, y: 0, val: 'B' });
  leaf.addItem({ x: 1, y: 1, val: 'C' });
  leaf.addItem({ x: 0, y: 1, val: 'D' });

  leaf.addItem({ x: 0.125, y: 0.125, val: 'E' });
  leaf.addItem({ x: 0.126, y: 0.126, val: 'F' });
  leaf.addItem({ x: 0.127, y: 0.127, val: 'G' });

  leaf.addItem({ x: 0.1252, y: 0.1252, val: 'H' });
  leaf.addItem({ x: 0.1252, y: 0.1252, val: 'I' });
  leaf.addItem({ x: 0.1252, y: 0.1253, val: 'J' });

  leaf.addItem({ x: 0.12511, y: 0.12511, val: 'K' });
  leaf.addItem({ x: 0.12512, y: 0.12512, val: 'L' });
  leaf.addItem({ x: 0.12513, y: 0.12513, val: 'M' });
  
  var unEmptyLeaves = leaf.getUnEmptyLeaves();

  // We should have 11 unempty leaves with the above setup
  expect(unEmptyLeaves.length).toBe(7);
  
  var allItems = leaf.getItems();
  // We should have 13 items in the tree
  expect(allItems.length).toBe(13);

  var subleaf_items = [];
  unEmptyLeaves.forEach(function (subleaf) {
    
    // Every unempty leaf should have more than 1 item
    expect(subleaf.items.length).toBeGreaterThan(0);

    subleaf_items = subleaf_items.concat(subleaf.items);
  });

  // Sum of items in unempty leaves should equal sum of items using getItems()
  expect(subleaf_items.length).toEqual(allItems.length);

}, 400);




runTests();

// rosevelt work hard at work wirth doign (parks rec, work with people you love)

