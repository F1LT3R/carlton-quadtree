function isInBounds (item, bounds) {

  if (item.x >= bounds.left && 
      item.x < bounds.right &&
      item.y >= bounds.top &&
      item.y < bounds.bottom) {
  
    return true;
  }

  return false;
}



var count = 0
  , maxItems = 4
  , maxLeaves = 4
  ;

Leaf = function (props) {

  if (typeof props == 'undefined') {
    return undefined;
  }

  if (!props.bounds) {
    return undefined;
  }


  if (props.hasOwnProperty('bounds')) {
    
    if (!props.bounds.hasOwnProperty('top')) {
      return undefined;
    }

    if (!props.bounds.hasOwnProperty('left')) {
      return undefined;
    }

    if (!props.bounds.hasOwnProperty('bottom')) {
      return undefined;
    }

    if (!props.bounds.hasOwnProperty('right')) {
      return undefined;
    }
  }

  count +=1;
  
  return {

    bounds: props.bounds,
    depth: props.depth + 1 || 0,
    
    id: count,
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

    getUnEmptyLeaves: function (snowball) {

      if (!snowball) {
        var snowball = [];
      }

      if (this.items.length > 0) {
        return snowball.concat([this]);
      }

      if (this.leaves.length > 0) {
        return snowball
          .concat(this.leaves[0].getUnEmptyLeaves(snowball))
          .concat(this.leaves[1].getUnEmptyLeaves(snowball))
          .concat(this.leaves[2].getUnEmptyLeaves(snowball))
          .concat(this.leaves[3].getUnEmptyLeaves(snowball))
          ;
      }

      return snowball.concat([]);
    },

    addItem: function (item) {
      if (!item) {
        return undefined;
      }

      if (typeof item == 'object') {
        
        if (!item.hasOwnProperty('x')) {
          return undefined;
        }

        if (!item.hasOwnProperty('y')) {
          return undefined;
        }

        if (!item.hasOwnProperty('val')) {
          return undefined;
        }

      }

      if (this.leaves.length > 0) {
        this.place(item, this.leaves);
        return;
      }

      if (this.items.length < 4) {
        item.leaf = this;
        this.items.push(item);
        return;
      }

      if (this.items.length === 4) {
        this.split();
        this.shuffle(this.items, this.leaves);
        this.items = [];
        this.place(item, this.leaves);
        return;
      }
    },
    
    split: function () {
      var midX = this.bounds.left + (this.bounds.right - this.bounds.left) / 2;
      var midY = this.bounds.top + (this.bounds.bottom - this.bounds.top) / 2;

      var subBoundsTopLeft = {
        top: this.bounds.top,
        left: this.bounds.left,
        right: midX,
        bottom: midY,
      };

      var subBoundsTopRight = {
        top: this.bounds.top,
        left: midX,
        right: this.bounds.right,
        bottom: midY,
      };

      var subBoundsBottomRight = {
        top: midY,
        left: midX,
        right: this.bounds.right,
        bottom: this.bounds.bottom,
      };

      var subBoundsBottomLeft = {
        top: midY,
        left: this.bounds.left,
        right: midX,
        bottom: this.bounds.bottom,
      };

      this.leaves.push(
        Leaf({bounds: subBoundsTopLeft    , depth: this.depth }),
        Leaf({bounds: subBoundsTopRight   , depth: this.depth }),
        Leaf({bounds: subBoundsBottomRight, depth: this.depth }),
        Leaf({bounds: subBoundsBottomLeft , depth: this.depth })
      );
    },

    shuffle: function (items, leaves) {
      items.forEach(function (subitem) {
        leaves.forEach(function (subleaf) {
          if (isInBounds(subitem, subleaf.bounds)) {
            subleaf.addItem(subitem);
          }
        });
      });
    },

    place: function (item, leaves) {
      leaves.forEach(function (subleaf) {
        if (isInBounds(item, subleaf.bounds)) {
          subleaf.addItem(item);
        }
      });
    },

  }
}

module.exports = Leaf;