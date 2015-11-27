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
    
}