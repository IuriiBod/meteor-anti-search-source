Migrations.add({
  version: 48,
  name: "changed timestamps to date in Comments collection",
  up: function () {
    Comments.find().forEach(function (comment) {
      Comments.update({_id: comment._id}, {$set: {
        createdOn: new Date(comment.createdOn)
      }}, {multi: true});
    });
  }
});