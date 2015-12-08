var component = FlowComponents.define('invitationsList', function (props) {
  this.set('accepted', false);
  this.organizationId = props.organizationId;
});

component.state.isAccepted = function () {
  return this.get('accepted');
};

component.state.invitations = function () {
  return Invitations.find({
    organizationId: this.organizationId,
    accepted: this.get('accepted')
  }).fetch();
};

component.action.changeAccepted = function (val) {
  this.set('accepted', val);
};

component.action.deleteInvitation = function (id) {
  Meteor.call('deleteInvitation', id, HospoHero.handleMethodResult());
};