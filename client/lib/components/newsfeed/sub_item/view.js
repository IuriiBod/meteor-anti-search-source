Template.subNewsFeedPost.helpers({
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

Template.subNewsFeedPost.events({
  'click .like-sub-post': function(event) {
    event.preventDefault();
    FlowComponents.callAction("likePost");
  }
});