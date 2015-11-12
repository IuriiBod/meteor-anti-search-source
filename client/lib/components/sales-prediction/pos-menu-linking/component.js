var component = FlowComponents.define('posMenuLinking', function (props) {
});

component.state.menuItems = function () {
  return MenuItems.find({});
};