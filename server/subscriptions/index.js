Meteor.methods({
  /**
   * Subscribe or unsubscribe user from items
   *
   * @param {Object} subscription - The subscription parameters
   * @param {string} [subscription._id] - ID of subscription
   * @param {string} subscription.type - Type of subscription (menu|job)
   * @params {string} subscription.itemIds - 'all' or item ID
   * @params {string} subscription.subscriber - ID of subscriber
   * @params {Object} subscription.relations - HospoHero relations object
   * @param {boolean} unsubscribeTrigger - If true - unsubscribes user from itemIds. Otherwise - subscribes on it
   */
  subscribe: function (subscription, unsubscribeTrigger) {
    check(subscription, HospoHero.checkers.SubscriptionDocument);

    var userId = Meteor.userId();
    if (!HospoHero.getCurrentAreaId(userId)) {
      logger.error(403, 'User not permitted to subscribe on items');
    }

    // Find what do we want to change
    var itemIds;
    if(subscription.itemIds === 'all') {
      var type = subscription.type;

      var subscriptonCollections = {
        menu: MenuItems,
        job: JobItems
      };

      itemIds = subscriptonCollections[type].find({
        'relations.areaId': HospoHero.getCurrentAreaId(userId)
      }).map(function (item) {
        return item._id;
      });
    } else {
      itemIds = subscription.itemIds;
    }

    // Check existing of subscription
    var subscriptionExists = Subscriptions.findOne({
      subscriber: userId,
      type: subscription.type,
      'relations.areaId': HospoHero.getCurrentAreaId(userId)
    });

    if(!subscriptionExists) {
      if(_.isString(itemIds)) {
        itemIds = [itemIds];
      }
      subscription.itemIds = itemIds;
      Subscriptions.insert(subscription);
    } else {
      var updateQuery = {};

      if(unsubscribeTrigger) {
        updateQuery.$pull = {
          itemIds: itemIds
        };
      } else {
        if(_.isArray(itemIds)) {
          updateQuery.$addToSet = {
            itemIds: {
              $each: itemIds
            }
          };
        } else {
          updateQuery.$addToSet = {
            itemIds: itemIds
          };
        }
      }

      Subscriptions.update({ _id: subscriptionExists._id }, updateQuery);
    }

  }
});