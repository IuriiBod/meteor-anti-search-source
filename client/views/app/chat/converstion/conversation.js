Template.conversation.onCreated(function() {
  this.subscribe('messagesFor', this.data.id);
  this.conversation = Meteor.conversations.findOne(this.data.id);
});

Template.conversation.helpers({
  messages () {
    const tmpl = Template.instance();
    return tmpl.conversation.messages(10, 0, 'date', 1);
  },
  conversation () {
    return Template.instance().conversation;
  }
});

Template.conversation.events({
  'click .send-message': (event, tmpl) => {
    event.preventDefault();
    const messageInput = tmpl.find('.message-input');
    const message = messageInput.value;
    if (message.length) {
      tmpl.conversation.sendMessage(message);
      messageInput.value = '';
    }
  }
});
