var component = FlowComponents.define('menuItem', function(props) {
  this.menuitem = props.menuitem;
});

component.state.item = function() {
  return this.menuitem;
}

component.state.category = function() {
  if(this.menuitem.category) {
    var category = Categories.findOne(this.menuitem.category);
    if(category) {
      return category.name;      
    }
  }
}

component.state.isArchive = function() {
  var status = this.menuitem.status;
  if (status == "archived") {
    return true;
  } else {
    return false;
  }
}

component.state.isPermitted = function() {
  var user = Meteor.user();
  if(user && (user.isManager || user.isAdmin)) {
    return true;
  } else {
    return false;
  }
}
