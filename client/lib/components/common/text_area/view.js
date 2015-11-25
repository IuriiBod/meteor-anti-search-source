Template.textArea.events({
  'keypress .message-input-post': function (event) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(event.target).val();
      if (text) {
        FlowComponents.callAction('submit', text);
      }
    }
  }
});

Template.textArea.rendered = function () {
  $(".message-input-post").val("");
};