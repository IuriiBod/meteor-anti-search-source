Template.textArea.events({
  'click .submit-textarea, keypress .message-input-post': function (event) {
    if (event.type == 'click' || event.type == 'keypress' && (event.keyCode == 10 || event.keyCode == 13)) {
      var textarea = $(event.target).siblings('.message-input-post');

      event.preventDefault();
      var text = textarea.val();
      textarea.val('');
      if (text) {
        FlowComponents.callAction('submit', text);
      }
    }
  }
});

Template.textArea.rendered = function () {
  $(".message-input-post").val("");
};