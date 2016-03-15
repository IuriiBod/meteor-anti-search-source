Template.chat.onCreated(function() {
  this.subscribe('conversations');
  this.currentConversationId = new ReactiveVar(null);
});

Template.chat.helpers({
  isConversationSelected () {
    return !!Template.instance().currentConversationId.get();
  },
  isNoOtherParticipants () {
    const conversationId = Template.instance().currentConversationId.get();
    const conversation = Meteor.conversations.findOne(conversationId);
    const participants = conversation.participants().fetch();
    return !participants.length;
  },
  currentConversationId () {
    return Template.instance().currentConversationId.get();
  },
  conversations () {
    return Meteor.conversations.find({_participants: Meteor.userId()});
  },
  changeConversation () {
    const tmpl = Template.instance();
    return (conversationId) => {
      tmpl.currentConversationId.set(conversationId);
    };
  }
});

Template.chat.events({
  'click .new-conversation': (event, tmpl) => {
    event.preventDefault();

    const newConversation = new Conversation().save();
    tmpl.currentConversationId.set(newConversation._id);
  },
  'click .add-participant': (event, tmpl) => {
    event.preventDefault();

    FlyoutManager.open('participantsList', {conversationId: tmpl.currentConversationId.get()});
  },
  'click .show-all-conversations': (event, tmpl) => {
    event.preventDefault();
    tmpl.currentConversationId.set(null);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    const currentConversationId = tmpl.currentConversationId.get();
    Meteor.call('removeCurrentUserFromConversations', currentConversationId);

    tmpl.currentConversationId.set(null);
  }
});
