Template.conversationsList.events({
  'click .conversation': (event, tmpl) => {
    event.preventDefault();
    const conversationId = event.target.getAttribute('data-conversation-id');
    tmpl.data.onConversationSelected(conversationId);
  }
});
