Template.conversation.onCreated(function () {
  this.subscribe('messagesFor', this.data.id);

  this.conversation = Meteor.conversations.findOne(this.data.id);
  this.isParticipantsListOpened = new ReactiveVar(true);
  this.isInnerFlyoutAnimated = new ReactiveVar(false);

  if (this.conversation.participants().count()) {
    this.isParticipantsListOpened.set(false);
  }
});

Template.conversation.onRendered(function () {
  this.$('.subject-of-conversation').editable({
    type: 'text',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: (response, newValue) => {
      Meteor.call('addSubjectOfConversation', this.data.id, newValue);
    }
  });
});

Template.conversation.onDestroyed(function() {
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
  isInnerFlyoutAnimated () {
    return Template.instance().isInnerFlyoutAnimated.get();
  },
  hideParticipantsList () {
    const tmpl = Template.instance();
    return () => {
      tmpl.isParticipantsListOpened.set(false);
      tmpl.isInnerFlyoutAnimated.set(true);
    };
  },
  participantsListStr () {
    const conversation = Template.instance().conversation;
    const participants = conversation.participants().map((participant) => {
      return HospoHero.username(participant.userId);
    });
    let participantsListStr = '';

    if (participants.length) {
      participantsListStr = participants.slice(0, 2).join(', ');

      if (participants.length > 2) {
        participantsListStr += `, (+${participants.length - 2})`;
      }
    }

    return participantsListStr.length ? participantsListStr : 'No participants';
  },
  subjectOfConversation () {
    const conversation = Meteor.conversations.findOne(this.id);
    return conversation && conversation.subject  ? conversation.subject : 'Subject';
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
    tmpl.isInnerFlyoutAnimated.set(true);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    Meteor.call('removeCurrentUserFromConversations', tmpl.data.id);

    FlyoutManager.getInstanceByElement(event.target).close();
  }
});
