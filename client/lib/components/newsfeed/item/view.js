Template.newsFeedPost.rendered = function () {
  $(".message-input-comment").val("");
};

Template.newsFeedPost.helpers({
  likesCounterText: function (likesObject) {
    var likesCounterText = [];
    if (likesObject.likedByMe) {
      likesCounterText.push('You');
    }

    if (likesObject.likesCount) {
      if (likesObject.likedByMe) {
        likesCounterText.push('and');
      }
      likesCounterText.push(likesObject.likesCount);
    }
    likesCounterText.push('like this');

    return likesCounterText.join(' ');
  }
});

Template.newsFeedPost.events({
  'click .like-post': function (event) {
    event.preventDefault();
    FlowComponents.callAction("likePost");
  }
});