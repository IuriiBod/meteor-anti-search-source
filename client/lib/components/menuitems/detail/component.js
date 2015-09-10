var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Router.current().params._id;
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
  Session.set("goBackMenu", null);
};

