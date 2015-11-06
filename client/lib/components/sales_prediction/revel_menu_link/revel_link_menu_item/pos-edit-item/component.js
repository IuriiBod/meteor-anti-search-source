var component = FlowComponents.define('posEditItem', function (props) {
  this.name = props.name;
  this.item = props.item;
});

component.state.getName = function(){
  return this.name;
};

component.action.updatePosName = function (newPosName) {
  Meteor.call('editPosName', this.item._id, newPosName, this.name, HospoHero.handleMethodResult());
};

component.action.deletePosName = function () {
  Meteor.call('deletePosName', this.name, this.item._id);
};

