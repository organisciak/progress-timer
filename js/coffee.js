// Generated by CoffeeScript 1.4.0
var Sync;

Sync = (function() {

  function Sync(parent) {
    if (parent == null) {
      parent = 'body';
    }
    this.obj = $('<div class="footer syncWindow">HELLO WORLD</div>');
    this.obj.appendTo(parent);
  }

  Sync.prototype.save = function() {
    return this.obj.slideDown();
  };

  return Sync;

})();