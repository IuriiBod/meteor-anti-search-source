var component = FlowComponents.define('revelLinkMenuItem', function (props) {
  this.set('menuItem', props.menuItem);
});


component.state.revelName = function () {
  var menuItem = this.get('menuItem');
  return menuItem.revelName || menuItem.name;
};


component.action.updateRevelName = function (newRevelName) {
  var menuItem = this.get('menuItem');

  Meteor.call('updateMenuItemRevelName', menuItem._id, newRevelName, HospoHero.handleMethodResult());
};
