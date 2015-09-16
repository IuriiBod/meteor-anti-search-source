Template.newsFeedPost.rendered = function(){
  $(".message-input-comment").val("");
};

Template.newsFeedPost.events({
  'click .like-post': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("div").attr("data-id");
    FlowComponents.callAction("likePost", id);
  }
});