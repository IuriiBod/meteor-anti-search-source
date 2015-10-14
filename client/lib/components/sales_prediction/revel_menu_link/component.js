var component = FlowComponents.define('revelMenuLink', function (props) {

});

component.state.menuItems = function () {
  return MenuItems.find({});
};