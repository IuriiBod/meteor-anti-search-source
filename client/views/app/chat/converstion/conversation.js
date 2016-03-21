Template.conversation.onCreated(function() {
  this.subscribe('messagesFor', this.data.id);

  this.conversation = Meteor.conversations.findOne(this.data.id);
  this.isParticipantsListShifted = new ReactiveVar(false);
  this.isParticipantsListOpened = new ReactiveVar(true);
});

Template.conversation.onDestroyed(function() {
  const messages = this.conversation.messages();
  const participants = this.conversation.participants();
  if (!messages.count() && !participants.count()) {
    Meteor.call('removeOwnConversation', this.conversation._id);
  }

  this.data.onCloseConversation();
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
  },
  isParticipantsListOpened () {
    return Template.instance().isParticipantsListOpened.get();
  },
  isParticipantsListShifted () {
    return Template.instance().isParticipantsListShifted.get();
  },
  hideParticipantsList () {
    const tmpl = Template.instance();
    return () => {
      console.log("hide!");
      tmpl.isParticipantsListShifted.set(true);
      tmpl.isParticipantsListOpened.set(false);
    }
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
  },
  'click .add-participant': (event, tmpl) => {
    event.preventDefault();
    tmpl.isParticipantsListOpened.set(true);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    Meteor.call('removeCurrentUserFromConversations', tmpl.data.id);

    FlyoutManager.getInstanceByElement(event.target).close();
  }
});
