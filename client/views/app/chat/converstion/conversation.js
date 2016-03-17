Template.conversation.onCreated(function() {
  this.subscribe('messagesFor', this.data.id);
  this.conversation = Meteor.conversations.findOne(this.data.id);
});

Template.conversation.helpers({
  messages () {
    const tmpl = Template.instance();
    return tmpl.conversation.messages(null, null, 'date', 1);
  },
  conversation () {
    return Template.instance().conversation;
  },
  isOwnMessage (ownerMessageId) {
    return ownerMessageId === Meteor.userId();
  }
});

Template.conversation.events({
  'click .send-message': (event, tmpl) => {
    event.preventDefault();
    const messageInput = tmpl.find('.message-input textarea');
    const message = messageInput.value;
    if (message.length) {
      tmpl.conversation.sendMessage(message);
      messageInput.value = '';
    }
  }
});
