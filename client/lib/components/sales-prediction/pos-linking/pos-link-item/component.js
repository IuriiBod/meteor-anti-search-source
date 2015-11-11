var component = FlowComponents.define('revelLinkMenuItem', function (props) {
  this.set('menuItem', props.menuItem);
  this.set('attachPosName', false);
});

component.state.posNames = function () {
  var menuItem = this.get('menuItem');
  return menuItem.posNames;
};

component.action.addPosName = function () {
  var attachPosName = this.get('attachPosName');
  this.set('attachPosName', !attachPosName);
};

