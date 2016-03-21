Template.conversation.onCreated(function() {
  this.subscribe('messagesFor', this.data.id);

  this.conversation = Meteor.conversations.findOne(this.data.id);
  this.isParticipantsListShifted = new ReactiveVar(false);
  this.isParticipantsListOpened = new ReactiveVar(true);
  this.isParticipantsListClosedAtStart = new ReactiveVar(false);

  if (this.conversation.participants().count()) {
    this.isParticipantsListClosedAtStart.set(true);
    this.isParticipantsListOpened.set(false);
  }
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
  isParticipantsListClosedAtStart () {
    return Template.instance().isParticipantsListClosedAtStart.get();
  },
  hideParticipantsList () {
    const tmpl = Template.instance();
    return () => {
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
    tmpl.isParticipantsListShifted.set(true);
    tmpl.isParticipantsListOpened.set(true);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    Meteor.call('removeCurrentUserFromConversations', tmpl.data.id);

    FlyoutManager.getInstanceByElement(event.target).close();
  }
});
