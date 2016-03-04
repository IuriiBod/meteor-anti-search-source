Template.chatMessage.helpers({
  messages: () => {
    let tmpl = Template.instance();
    return tmpl.conversation.messages();
  }
});