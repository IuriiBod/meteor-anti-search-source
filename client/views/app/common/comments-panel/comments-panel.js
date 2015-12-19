//context: id (MongoId), type (String)

Template.commentsPanel.helpers({
  commentsList: function () {
    return Comments.find({"reference": this.id}, {sort: {"createdOn": 1}});
  }
});