Migrations.add({
    version: 13,
    name: "Change Subscriptions collection structure",
    up: function () {
      var subscriptions = Subscriptions.find().fetch();

      var defaultArea = Areas.findOne({name: 'Default Area'});
      if(defaultArea) {
        for(var i=0; i<subscriptions.length; i++) {
          var subscription = subscriptions[i];
          var newSubscriptionDocument = {
            relations: {
              organizationId: defaultArea.organizationId,
              locationId: defaultArea.locationId,
              areaId: defaultArea._id
            }
          };

          newSubscriptionDocument.subscribers = subscription.subscribers;

          if(subscription._id == 'joblist') {
            newSubscriptionDocument.type = 'job';
          } else if(subscription._id == 'menulist') {
            newSubscriptionDocument.type = 'menu';
          }

          Subscriptions.remove({ _id: subscription._id });

          if(newSubscriptionDocument.type) {
            Subscriptions.insert(newSubscriptionDocument);
          } else {
            continue;
          }
        }
      } else {
        console.log('Error! Area with name "Default Area" does not exists!');
      }
    }
});