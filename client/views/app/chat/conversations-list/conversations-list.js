Template.conversationsList.helpers({
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
