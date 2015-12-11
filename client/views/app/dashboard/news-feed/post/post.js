//context: NewsFeed document
Template.newsFeedPost.helpers({
  comments: function () {
    return NewsFeeds.find({"reference": this._id}, {sort: {"createdOn": 1}});
  }
});