Template.conversationsList.events({
  'click .conversation': (event, tmpl) => {
    event.preventDefault();
    let conversationId = event.target.getAttribute('data-conversation-id');
    tmpl.data.onConversationSelected(conversationId);
  }
});
