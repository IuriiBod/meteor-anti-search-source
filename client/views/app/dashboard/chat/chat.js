Template.chat.onCreated(function () {
  let conversation = new Conversation().save();
  this.conversationId = conversation._id;
  console.log(this.conversation);
});

Template.chat.helpers({
  messages: () => {
    let conversationId = Template.instance().conversationId;
    let conversation = Meteor.conversations.findOne({_id: conversationId});
    if (conversation) {
      return Meteor.conversations.findOne({_id: conversationId}).messages();
    }
  }
});

Template.chat.events({
  'click .send-message': (event, tmpl) => {
    event.preventDefault();
    let message = tmpl.find('.message-input').value;
    let conversation = Meteor.conversations.findOne({_id: tmpl.conversationId});
    if (message.length) {
      conversation.sendMessage(message);
    }
  }
});
