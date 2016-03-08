Template.chat.onCreated(function() {
  this.currentConversationId = new ReactiveVar(null);
});

Template.chat.helpers({
  conversations () {
    return Meteor.conversations.find({_participants: Meteor.userId()}).fetch();
  },
  currentConversationId () {
    return Template.instance().currentConversationId.get();
  },
  setCurrentConversationId () {
    const tmpl = Template.instance();
    return (conversationId) => {
      tmpl.currentConversationId.set(conversationId);
    }
  },
  isConversationSelected () {
    return !!Template.instance().currentConversationId.get();
  }
});

Template.chat.events({
  'click .show-all-conversations': (event, tmpl) => {
    event.preventDefault();
    tmpl.currentConversationId.set(null);
  },
  'click .new-conversation': (event, tmpl) => {
    event.preventDefault();
    const newConversation = new Conversation().save();
    tmpl.currentConversationId.set(newConversation._id);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    const currentConversationId = tmpl.currentConversationId.get();
    Meteor.call('removeCurrentUserFromConversations', currentConversationId);

    //tmpl.currentConversationId.set(null);
  }
});
