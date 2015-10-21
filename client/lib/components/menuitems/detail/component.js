var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Session.get("thisMenuItem");
});

component.state.menu = function() {
  this.menu = MenuItems.findOne(this.id);
  if(this.menu) {
    return this.menu;
  }
};

component.state.jobItems = function() {
  if(this.get('menu') && this.get('menu').jobItems) {
    var jobItems = this.get('menu').jobItems;
    return jobItems;
  } else {
    return [];
  }
};

component.state.ings = function() {
  if(this.get('menu') && this.get('menu').ingredients) {
    var ingredients = this.get('menu').ingredients;
    return ingredients;
  } else {
    return [];
  }
};