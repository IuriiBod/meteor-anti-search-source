var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Session.get("thisMenuItem");
  subs.subscribe("menuItem", this.id);
  this.onRendered(this.onViewRendered);
});

component.state.menu = function() {
  this.menu = MenuItems.findOne(this.id);
  if(this.menu) {
    return this.menu;
  }
};

component.prototype.onViewRendered = function() {
  this.menu = MenuItems.findOne(this.id);
  var ings = this.menu.ingredients;
  var ids = [];
  if(ings.length > 0) {
    ings.forEach(function(ing) {
      if(ids.indexOf(ings._id) < 0) {
        ids.push(ing._id);
      }
    });
  }
  if(ids.length > 0) {
    subs.subscribe("ingredients", ids);
  }
  Session.set("goBackMenu", null);
};

