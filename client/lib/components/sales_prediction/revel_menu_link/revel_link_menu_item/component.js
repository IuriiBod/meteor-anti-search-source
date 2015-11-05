var component = FlowComponents.define('revelLinkMenuItem', function (props) {
  this.set('menuItem', props.menuItem);
});


component.state.posNames = function () {
  var menuItem = this.get('menuItem');
  return menuItem.posNames || [menuItem.name];
};


component.action.updatePosName = function (newPosName) {
  var menuItem = this.get('menuItem');
  Meteor.call('editMenuItem', menuItem._id, {posName: newPosName}, HospoHero.handleMethodResult());
};
