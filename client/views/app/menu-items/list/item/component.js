var component = FlowComponents.define('menuItem', function (props) {
  this.menuitem = props.menuitem;
});

component.state.item = function () {
  return this.menuitem;
};

component.state.isArchive = function () {
  return this.menuitem.isArchived;
};
