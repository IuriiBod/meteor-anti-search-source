Template.conversationsList.onCreated(function () {
  let usersIds = new Set();
  this.data.conversations.forEach(conversation => {
    conversation._participants.forEach((participant) => usersIds.add(participant));
  });
  this.subscribe('selectedUsersList', Array.from(usersIds));
});

Template.conversationsList.helpers({
  timeAgoStr (date) {
    return moment(date).fromNow();
  },
  countOfNotRead (conversationId) {
    var user = Meteor.user();
    return user ? user.conversationsNotReadMessages(conversationId).count() : false;
  }
});

Template.conversationsList.events({
  'click .conversations-list-item': (event, tmpl) => {
    event.preventDefault();
    const conversationId = event.currentTarget.getAttribute('data-conversation-id');
    tmpl.data.onConversationSelected(conversationId);
  }
});
