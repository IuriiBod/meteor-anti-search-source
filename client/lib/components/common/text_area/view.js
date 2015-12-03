Template.textArea.events({
  'click .submit-textarea': function (event, tmpl) {
    tmpl.sendNewsfeed(event);
  },

  'keypress .message-input-post': function (event, tmpl) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      tmpl.sendNewsfeed(event);
    }
  }
});

Template.textArea.rendered = function () {
  $(".message-input-post").val("");

  this.sendNewsfeed = function (event) {
    event.preventDefault();
    var target = $(event.target);
    var textarea = target.is('textarea') ? target : target.siblings('.message-input-post');

    var text = textarea.val();
    textarea.val('');
    if (text) {
      FlowComponents.callAction('submit', text);
    }
  }
};