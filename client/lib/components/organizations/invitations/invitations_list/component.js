var component = FlowComponents.define('invitationsList', function(props) {
  this.set('accepted', false);
});

component.state.isAccepted = function() {
  return this.get('accepted');
};

component.state.invitations = function() {
  var accepted = this.get('accepted');
  return Invitations.find({ accepted: accepted }).fetch();
};

component.action.changeAccepted = function(val) {
  this.set('accepted', val);
};

component.action.deleteInvitation = function(id) {
  Meteor.call('deleteInvitation', id, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
};