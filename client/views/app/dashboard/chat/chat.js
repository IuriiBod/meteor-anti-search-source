Template.chat.onCreated(function() {
  let self = this;
  self.subscribe('conversations', function onReady() {
    self.conversation = Meteor.conversations.findOne();
    if (!self.conversation) {
      self.conversation = new Conversation().save();
    }
    self.subscribe('messagesFor', self.conversation._id);
  });
});

Template.chat.helpers({
  messages: () => {
    let tmpl = Template.instance();
    return tmpl.conversation.messages();
  }
});

Template.chat.events({
  'click .send-message': (event, tmpl) => {
    event.preventDefault();
    let message = tmpl.find('.message-input').value;
    if (message.length) {
      tmpl.conversation.sendMessage(message);
    }
  }
});
