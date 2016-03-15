Template.chat.onCreated(function() {
  this.subscribe('conversations');
  this.currentConversationId = new ReactiveVar(null);
  this.currentParticipantsListFlyout = new ReactiveVar(null);

  this.autorun(() => {
    const conversationId = this.currentConversationId;
    const participantsListFlyout = this.currentParticipantsListFlyout;

    if (conversationId.get()) {
      participantsListFlyout.set(null);
    } else if (participantsListFlyout.get()) {
      participantsListFlyout.get().close();
    }
  });
});

Template.chat.helpers({
  isConversationSelected () {
    return !!Template.instance().currentConversationId.get();
  },
  isNoOtherParticipants () {
    const conversationId = Template.instance().currentConversationId.get();
    const conversation = Meteor.conversations.findOne(conversationId);
    const participants = conversation.participants().fetch();
    return !participants.length;
  },
  isParticipantsListOpen() {
    return !!Template.instance().currentParticipantsListFlyout.get();
  },
  currentConversationId () {
    return Template.instance().currentConversationId.get();
  },
  conversations () {
    return Meteor.conversations.find({_participants: Meteor.userId()});
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
  },
  'click .add-participant': (event, tmpl) => {
    event.preventDefault();

    const participantsListFlyout = FlyoutManager.open('participantsList', {
      conversationId: tmpl.currentConversationId.get(),
      onCloseFlyout: () => tmpl.currentParticipantsListFlyout.set(null)
    });

    tmpl.currentParticipantsListFlyout.set(participantsListFlyout);
  },
  'click .show-all-conversations': (event, tmpl) => {
    event.preventDefault();
    tmpl.currentConversationId.set(null);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    const currentConversationId = tmpl.currentConversationId.get();
    Meteor.call('removeCurrentUserFromConversations', currentConversationId);

    tmpl.currentConversationId.set(null);
  }
});
