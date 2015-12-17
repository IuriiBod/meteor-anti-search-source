//context: MenuItem
Template.menuItemDetailedMainView.helpers({
  ingredients: function () {
    return this.ingredients || [];
  }
});


component.state.menu = function () {
  this.menu = MenuItems.findOne(this.id);
  if (this.menu) {
    return this.menu;
  }
};

component.state.jobItems = function () {
  if (this.get('menu') && this.get('menu').jobItems) {
    var jobItems = this.get('menu').jobItems;
    return jobItems;
  } else {
    return [];
  }
};
