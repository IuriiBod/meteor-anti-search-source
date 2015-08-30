Meteor.publish('posts', function() {
    var cursor = [];
    cursor.push(Posts.find({}, {sort: {"createdOn": -1}, limit: 20}));
    logger.info("Posts published");
    return cursor;
});