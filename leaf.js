var leafCount = 0
  , itemCount = 0
  ;

function isInBounds (item, bounds) {
  if (item.x >= bounds.left && 
      item.x < bounds.right &&
      item.y >= bounds.top &&
      item.y < bounds.bottom) {
  
    return true;
  }

  return false;
}


function shuffle (items, leaves) {
  items.forEach(function (subitem) {
    leaves.forEach(function (subleaf) {
      if (isInBounds(subitem, subleaf.bounds)) {
        subleaf.addItem(subitem);
        return false;
      }
    });
  });
}

// Not sure which performs better
// function shuffle (items, leaves) {
//   var subitem
//     , subleaf
//     , i = 0
//     , l = items.length
//     , j
//     ;

//   for (; i< l; i += 1) {
//     subitem = items[i];
//     j = 0;
//     for (; j< 4; j += 1) {
//       subleaf = leaves[j];
//       if (isInBounds(subitem, subleaf.bounds)) {
        
//         subleaf.addItem(subitem);
//         // return;
//       }
//     }
//   }
// }


function place (item, leaves) {
  var i=0
    , subleaf
    ;

  for (; i< 4; i += 1) {
    subleaf = leaves[i];
    if (isInBounds(item, subleaf.bounds)) {
      return subleaf.addItem(item);
    }
  }
}


function split (leaf) {

  var midX = leaf.bounds.left + (leaf.bounds.right  - leaf.bounds.left) / 2;
  var midY = leaf.bounds.top +  (leaf.bounds.bottom - leaf.bounds.top)  / 2;

  var subBoundsTopLeft = {
    top: leaf.bounds.top,
    left: leaf.bounds.left,
    right: midX,
    bottom: midY,
  };

  var subBoundsTopRight = {
    top: leaf.bounds.top,
    left: midX,
    right: leaf.bounds.right,
    bottom: midY,
  };

  var subBoundsBottomRight = {
    top: midY,
    left: midX,
    right: leaf.bounds.right,
    bottom: leaf.bounds.bottom,
  };

  var subBoundsBottomLeft = {
    top: midY,
    left: leaf.bounds.left,
    right: midX,
    bottom: leaf.bounds.bottom,
  };

  leaf.leaves.push(
    Leaf({bounds: subBoundsTopLeft    , depth: leaf.depth, parent: leaf }),
    Leaf({bounds: subBoundsTopRight   , depth: leaf.depth, parent: leaf }),
    Leaf({bounds: subBoundsBottomRight, depth: leaf.depth, parent: leaf }),
    Leaf({bounds: subBoundsBottomLeft , depth: leaf.depth, parent: leaf })
  );
}


function isInvalidLeaf (props) {
  if (typeof props == 'undefined') {
    return true;
  }

  if (!props.bounds) {
    return true;
  }

  if (props.hasOwnProperty('bounds')) {
    
    if (!props.bounds.hasOwnProperty('top')) {
      return true;
    }

    if (!props.bounds.hasOwnProperty('left')) {
      return true;
    }

    if (!props.bounds.hasOwnProperty('bottom')) {
      return true;
    }

    if (!props.bounds.hasOwnProperty('right')) {
      return true;
    }
  }

  return false;
}


function isInvalidItem (item) {
  if (!item) {
    return true;
  }

  if (typeof item == 'object') {
    
    if (!item.hasOwnProperty('x')) {
      return true;
    }

    if (!item.hasOwnProperty('y')) {
      return true;
    }

    if (!item.hasOwnProperty('val')) {
      return true;
    }
  }

  return false;
}





Leaf = function (props, extensions) {

  if (isInvalidLeaf(props)) {
    return undefined;
  }

  leafCount += 1;
  
  return {

    bounds: props.bounds,
    depth: props.depth + 1 || 0,
    
    uid: leafCount,
    leaves: [],
    items: [],
    parent: props.parent || {root: true},

    
    getItems: function () {
      if (this.items.length > 0) {
        return this.items;
      }

      if (this.leaves.length > 0) {
        return this.leaves[0].getItems()
          .concat(this.leaves[1].getItems())
          .concat(this.leaves[2].getItems())
          .concat(this.leaves[3].getItems());
      }

      return [];
    },

    getUnEmptyLeaves: function () {
      if (this.items.length > 0) {
        return [this];
      }

      if (this.leaves.length > 0) {
        return this.leaves[0].getUnEmptyLeaves()
          .concat(this.leaves[1].getUnEmptyLeaves())
          .concat(this.leaves[2].getUnEmptyLeaves())
          .concat(this.leaves[3].getUnEmptyLeaves());
      }

      return [];
    },

    addItem: function (item) {
        
      if (isInvalidItem(item)) {
        return undefined;
      }

      if (this.leaves.length > 0) {
        return place(item, this.leaves);
      }

      if (this.items.length < 4) {
        return Item(item, this);
      }

      if (this.items.length === 4) {
        split(this);
        shuffle(this.items, this.leaves);
        this.items = [];
        return place(item, this.leaves);
      }
    },

    collapse: function () {
      
      var subitems = this.getItems()
        , l=subitems.length
        , i=0
        ;
      
      this.leaves = [];

      for (; i< l; i++) {
        this.addItem(subitems[i]);
      }
    },

  };

}



function Item (item, leaf) {
  itemCount += 1;
  
  item.uid = itemCount;
  item.leaf = leaf;
  item.index = leaf.items.push(item) - 1;
  
  item.remove = function () {
    
    this.leaf.items.splice(this.index, 1);
    this.leaf.parent.collapse();
  }

  return item;
}



// Only export if in Node env.
if (typeof module !== 'undefined') {
  module.exports = Leaf;
}