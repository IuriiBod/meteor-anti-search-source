var component = FlowComponents.define('posEditItem', function (props) {
  this.name = props.name;
  this.item = props.item;
});

component.state.getName = function () {
  return this.name;
};

component.action.deletePosName = function () {
  Meteor.call('deletePosNameFromMenuItem', this.item._id, this.name, HospoHero.handleMethodResult());
};

