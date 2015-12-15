//context: Post
Template.newsFeedLikeButton.helpers({
  likesCounterText: function () {
    if (_.isArray(this.likes)) {
      var likedByMe, likesCount;

      likedByMe = this.likes.indexOf(Meteor.userId()) >= 0;
      likesCount = this.likes.length;

      if (likedByMe) {
        likesCount--;
      }

      var likesCounterText = [];
      if (likedByMe) {
        likesCounterText.push('You');
        if (likesCount > 0) {
          likesCounterText.push('and');
        }
      }

      if (likesCount > 0) {
        likesCounterText.push(likesCount);
      }

      likesCounterText.push('like this');

      return likesCounterText.join(' ');
    } else {
      return '';
    }
  }
});

Template.newsFeedLikeButton.events({
  'click .like-post': function (event, tmpl) {
    var postId = tmpl.data._id;
    Meteor.call("updateNewsfeed", postId, Meteor.userId(), HospoHero.handleMethodResult());
  }
});
