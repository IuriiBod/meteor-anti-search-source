Migrations.utils = {
  removeCollection: function (collName) {
    Areas.rawDatabase().dropCollection(collName, function () {
    });
  },

  removeUserWithRelatedStuff: function (userIds) {
    userIds = _.isArray(userIds) ? userIds : [userIds];

    let removeTargets = [
      {collection: LeaveRequests, property: 'userId'},
      {collection: Notifications, property: 'to'},
      {collection: Comments, property: 'createdBy'},
      {collection: NewsFeeds, property: 'createdBy'},
      {collection: Subscriptions, property: 'subscriber'},
      {collection: Meteor.users, property: '_id'}
    ];

    removeTargets.forEach(place => {
      place.collection.remove({[place.property]: {$in: userIds}});
    });
  }
};

Meteor.startup(function () {
  logger.warn('Database version: ', Migrations.getVersion());
  Migrations.migrateTo('latest');
});