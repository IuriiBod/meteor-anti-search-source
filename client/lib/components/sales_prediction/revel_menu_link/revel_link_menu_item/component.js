var component = FlowComponents.define('revelLinkMenuItem', function (props) {
  this.set('menuItem', props.menuItem);
});


component.state.posNames = function () {
  var menuItem = this.get('menuItem');
  return menuItem.posNames;
};

component.action.addPosName = function () {
  var menuItem = this.get('menuItem');
  Meteor.call('addPosName', "AddPosNameHere", menuItem._id);
};


