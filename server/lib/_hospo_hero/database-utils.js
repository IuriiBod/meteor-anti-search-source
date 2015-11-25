Namespace('HospoHero.databaseUtils', {
  getSubscriberIds: function (subscribedForCollection, itemId) {
    var subscriptionsQuery = {
      type: subscribedForCollection,
      'relations.areaId': HospoHero.getCurrentAreaId(Meteor.userId())
    };

    if (itemId) {
      subscribedForCollection.itemIds = itemId;
    }
    return Subscriptions.find(subscriptionsQuery);
  }
});