Template.conversation.onCreated(function() {
  this.subscribe('messagesFor', this.data.id);
  this.conversation = Meteor.conversations.findOne(this.data.id);
});

Template.conversation.helpers({
  messages: () => {
    let tmpl = Template.instance();
    return tmpl.conversation.messages(5, 0, 'date', -1);
  }
});

Template.conversation.events({
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
