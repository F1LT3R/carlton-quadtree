
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
      }
    });
  });
}


function place (item, leaves) {
  leaves.forEach(function (subleaf) {
    if (isInBounds(item, subleaf.bounds)) {
      subleaf.addItem(item);
    }
  });
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
    Leaf({bounds: subBoundsTopLeft    , depth: leaf.depth }),
    Leaf({bounds: subBoundsTopRight   , depth: leaf.depth }),
    Leaf({bounds: subBoundsBottomRight, depth: leaf.depth }),
    Leaf({bounds: subBoundsBottomLeft , depth: leaf.depth })
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



var count = 0
  , maxItems = 4
  , maxLeaves = 4
  ;

Leaf = function (props) {

  if (isInvalidLeaf(props)) {
    return undefined;
  }

  count += 1;
  
  return {

    bounds: props.bounds,
    depth: props.depth + 1 || 0,
    
    uid: count,
    leaves: [],
    items: [],

    print: function () {
      
      function line (l) {
        var str = '';
        for (var i=0; i< l*3; i++) {
          str+=' ';
        }
        return str+'-';
      }

      function vals () {
        var str = '';
        if (this.items.length > 0) {
          this.items.forEach(function (subitem) {
            str += subitem.val
          });
        }
        return str;
      }

      console.log(line(this.depth) + '['+this.depth+':'+vals.call(this)+']');

      this.leaves.forEach(function (subleaf) {
        subleaf.print();
      });
    },
    
    
    getItems: function () {

      if (!this.items) {
        return;
      }

      if (this.items.length > 0) {
        return this.items;
      }

      if (this.leaves.length > 0) {
        
        var collect = []
          , i=0
          , subItems
          ;
        
        for (; i < 4; i++) {
          subItems = this.leaves[i].getItems();
          
          if (subItems && subItems.length > 0) {
            
            subItems.forEach(function (item) {
              collect.push(item);
            });

          }
        }

        return collect;
      }

    },

    getUnEmptyLeaves: function () {
      if (this.items.length > 0) {
        return [this];
      }

      if (this.leaves.length > 0) {
        return this.leaves[0].getUnEmptyLeaves()
            .concat(this.leaves[1].getUnEmptyLeaves())
            .concat(this.leaves[2].getUnEmptyLeaves())
            .concat(this.leaves[3].getUnEmptyLeaves())
          ;
      }

      return [];
    },

    addItem: function (item) {
        
      if (isInvalidItem(item)) {
        return undefined;
      }

      if (this.leaves.length > 0) {
        place(item, this.leaves);
        return;
      }

      if (this.items.length < 4) {
        item.leaf = this;
        this.items.push(item);
        return;
      }

      if (this.items.length === 4) {
        split(this);
        shuffle(this.items, this.leaves);
        this.items = [];
        place(item, this.leaves);
        return;
      }
    },
  }
}

module.exports = Leaf;