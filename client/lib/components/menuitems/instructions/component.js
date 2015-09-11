var component = FlowComponents.define("menuInstructions", function(props) {
  this.id = props.id;
});

component.state.desc = function() {
  var menu = MenuItems.findOne(this.id);
  if(menu && menu.instructions) {
    return menu.instructions;
  } else {
    return "Add instructions here"
  }
}

component.state.initialHTML = function() {
  if(this.id) {
    var menu = MenuItems.findOne(this.id);

    if(menu) {
      return menu.instructions;
    } else {
      return "Add instructions here";
    }
  }
}


component.state.isPermitted = function() {
  return managerPlusAdminPermission();
}