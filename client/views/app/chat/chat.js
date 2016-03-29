Template.chat.onCreated(function() {
  this.subscribe('conversations');
  this.currentConversationId = new ReactiveVar(null);

  this.autorun(() => {
    const conversationId = this.currentConversationId.get();

    if (conversationId) {
      FlyoutManager.open('conversation', {
        id: conversationId,
        onCloseConversation: () => {
          this.currentConversationId.set(null);
        }
      });
    }
  });
});

Template.chat.helpers({
  isConversationSelected () {
    return !!Template.instance().currentConversationId.get();
  },
  conversations () {
    return Meteor.user().conversations(null, null, 'date', -1);
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
  }
});
