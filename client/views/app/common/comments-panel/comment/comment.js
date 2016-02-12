//context: Comment
Template.comment.onRendered(function () {
  var list = $(".chat-discussion");
  list.scrollTop(list.prop("scrollHeight") - list.height());
});