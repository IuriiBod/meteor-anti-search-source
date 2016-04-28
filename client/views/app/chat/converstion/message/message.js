Template.conversationMessage.helpers({
  isOwnMessage (ownerMessageId) {
    return ownerMessageId === Meteor.userId();
  },
  isNotReadYet(){
    return (this.userId !== Meteor.userId() && !this.isReadBy(Meteor.userId()));
  }
});

Template.conversationMessage.events({
  'mouseover .message'(event,tmpl){
    if(!tmpl.data.isReadBy(Meteor.userId())) {
      Meteor.call('setMessageAsRead', tmpl.data._id, HospoHero.handleMethodResult());
    }
  }
});