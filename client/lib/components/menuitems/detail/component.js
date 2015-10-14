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
    jobItems = _.map(jobItems, function (jobItem) {
      return jobItem._id;
    });
    return JobItems.find({_id: {$in: jobItems}});
  } else {
    return [];
  }
};

component.state.ings = function() {
  if(this.get('menu') && this.get('menu').ingredients) {
    var ingredients = this.get('menu').ingredients;
    ingredients = _.map(ingredients, function (ingredient) {
      return ingredient._id;
    });
    return Ingredients.find({_id: {$in: ingredients}});
  } else {
    return [];
  }
};