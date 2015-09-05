var component = FlowComponents.define('ingredientItemDetailed', function(props) {
  this.ingredient = props.ingredient;
});

component.state.item = function() {
  return this.ingredient;
};

component.state.isManagerOrAdmin = function() {
  var user = Meteor.user();
  if(user && (user.isManager || user.isAdmin)) {
    return true;
  } else {
    return false;
  }
}

component.state.isArchive = function() {
  if(this.ingredient.status == 'archived') {
    return true;
  } else {
    return false;
  }
}
