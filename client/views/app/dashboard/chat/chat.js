Template.chat.onCreated(function() {
  this.subscribe('conversations');
  this.currentConversationId = new ReactiveVar(null);
});

Template.chat.helpers({
  conversations: () => {
    return Meteor.conversations.find();
  },
  currentConversationId: () => {
    return Template.instance().currentConversationId.get();
  },
  setCurrentConversationId: () => {
    let tmpl = Template.instance();
    return (conversationId) => {
      tmpl.currentConversationId.set(conversationId);
    }
  },
  isConversationSelected: () => {
    return !!Template.instance().currentConversationId.get();
  }
});

Template.chat.events({
  'click .send-message': (event, tmpl) => {
    event.preventDefault();
    let messageInput = tmpl.find('.message-input');
    let message = messageInput.value;
    if (message.length) {
      tmpl.conversation.sendMessage(message);
      messageInput.value = '';
    }
  }
});
