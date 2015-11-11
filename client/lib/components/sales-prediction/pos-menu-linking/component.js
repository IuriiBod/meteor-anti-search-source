var component = FlowComponents.define('posMenuLinking', function (props) {
  this.set('expanded', true);
});

component.state.menuItems = function () {
  return MenuItems.find({});
};


component.action.toggleExpanded = function () {
  this.set('expanded', !this.get('expanded'))
};