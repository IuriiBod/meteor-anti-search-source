Template.conversationsList.onCreated(function () {
  let usersIds = new Set();
  this.data.conversations.forEach(conversation => {
    conversation._participants.forEach((participant) => usersIds.add(participant));
  });
  this.subscribe('selectedUsersList', Array.from(usersIds));
});

Template.conversationsList.helpers({
  lastMessages () {
    let lastMessages = this.conversations.map((conversation) => {
      const lastMessage = conversation.lastMessage();
      if (lastMessage) {
        return lastMessage;
      }
    });

    return lastMessages.sort((firstMessage, secondMessage) => {
      return new Date(secondMessage.date) - new Date(firstMessage.date);
    });
  },
  timeAgoStr (date) {
    return `${moment(date).toNow()} ago`.substr(3);
  }
});

Template.conversationsList.events({
  'click .conversations-list-item': (event, tmpl) => {
    event.preventDefault();
    const conversationId = event.currentTarget.getAttribute('data-conversation-id');
    tmpl.data.onConversationSelected(conversationId);
  }
});
