Template.conversation.onCreated(function () {
  this.subscribe('messagesFor', this.data.id);

  this.conversation = Meteor.conversations.findOne(this.data.id);
  this.isParticipantsListOpened = new ReactiveVar(true);
  this.isInnerFlyoutAnimated = new ReactiveVar(false);

  if (this.conversation.participants().count()) {
    this.isParticipantsListOpened.set(false);
  }
  this.discussionAreaFirstHeight = null;
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

  this.discussionAreaFirstHeight = this.$('.chat-discussion').outerHeight();
  showLastMessage(this);

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
  countOfNotRead () {
    var user = Meteor.user();
    return user ? user.conversationsNotReadMessages(this.id).count() : false;
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
  },
  textAreaAutocompleteSettings () {
     return {
      limit: 10,
      position:'top',
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: ["profile.firstname", "profile.lastname"],
        filter: {
          "_id": {$nin: [Meteor.userId()]}
        },
        sort: true,
        template: Template.username,
        noMatchTemplate: Template.noMatchTemplate
      }]
    };
  }
});

Template.conversation.events({
  'click .add-participant': (event, tmpl) => {
    event.preventDefault();
    tmpl.isParticipantsListOpened.set(true);
    tmpl.isInnerFlyoutAnimated.set(true);
  },
  'click .leave-conversation': (event, tmpl) => {
    event.preventDefault();

    Meteor.call('removeCurrentUserFromConversations', tmpl.data.id);

    FlyoutManager.getInstanceByElement(event.target).close();
  },
  'keypress .message-area': function (event, tmpl) {
    if(event.which === 13 && !event.shiftKey){
      if (event.target.value.length) {
        tmpl.conversation.sendMessage(event.target.value);
        event.target.value = '';
        showLastMessage(tmpl);
      }
    }
  },
  'keyup .message-area': function (event, tmpl) {
     if(resizeTextArea(event, tmpl)){
       resizeChatDiscussionArea(event, tmpl)
     }
  }
});

function resizeTextArea(event, tmpl) {
  event.target.style.height = "5px";
  event.target.style.height = (event.target.scrollHeight)+"px";
  if(event.target.scrollHeight < pxToInt(tmpl.$(event.target).css('max-height'))) {
    tmpl.$(event.target).css('overflow-y','hidden');
    return true;
  }else {
    tmpl.$(event.target).css('overflow-y','scroll');
    return false;
  }
}

function resizeChatDiscussionArea(event, tmpl) {
  var discussionAreaHeight = tmpl.discussionAreaFirstHeight - event.target.scrollHeight;
  tmpl.$('.chat-discussion').height(discussionAreaHeight);
}

function pxToInt(string){
  return string ? parseInt(string.split('px')[0]) : 0
}

function showLastMessage(tmpl){
 const discussionClass = '.chat-discussion';
 tmpl.$(discussionClass).scrollTop(tmpl.$(discussionClass).prop("scrollHeight"));
}
