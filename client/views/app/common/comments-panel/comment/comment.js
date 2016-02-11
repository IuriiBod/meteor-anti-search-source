//context: Comment
Template.comment.onRendered(function () {
  var list = $(".chat-discussion");
  list.scrollTop(list.property("scrollHeight") - list.height());
});