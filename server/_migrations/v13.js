Migrations.add({
  version: 13,
  name: "Change Subscriptions collection structure",
  up: function () {
    Subscriptions.remove({
      $and: [
        {_id: {$ne: 'joblist'}},
        {_id: {$ne: 'menulist'}}
      ]
    });

    var subscriptions = Subscriptions.find().fetch();
    var defaultArea = Areas.findOne({name: 'Default Area'});

    if (defaultArea) {
      subscriptions.forEach(function (subscription) {
        var newSubscriptionDocument = {
          type: subscription._id === 'joblist' ? 'job' : 'menu',
          itemIds: 'all',
          relations: {
            organizationId: defaultArea.organizationId,
            locationId: defaultArea.locationId,
            areaId: defaultArea._id
          }
        };

        if (subscription.subscribers.length > 0) {
          subscription.subscribers.forEach(function (subscriberId) {
            newSubscriptionDocument.subscriber = subscriberId;
            Subscriptions.insert(newSubscriptionDocument);
          });
        }

        Subscriptions.remove({_id: subscription._id});
      });
    } else {
      console.log('Error! Area with name "Default Area" does not exists!');
    }
  }
});