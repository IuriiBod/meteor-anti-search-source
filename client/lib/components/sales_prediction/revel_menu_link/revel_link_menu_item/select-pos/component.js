var component = FlowComponents.define('selectPos', function (props) {
  this.set('menuItem', props.item);
});

component.state.allPos = function () {
  return PosMenuItems.find();
};

component.action.addNewPos = function (name) {
  var menuItem = this.get('menuItem');
  Meteor.call('addPosName', name, menuItem._id);
};