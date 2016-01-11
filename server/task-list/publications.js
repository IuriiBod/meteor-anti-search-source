Meteor.publishComposite('taskList', function (userId) {
  return {
    find: function () {
      var user = Meteor.users.findOne({_id: userId});
      var relations = user && user.relations;
      var query = {};

      if (relations.organizationId) {
        var sharingOptions = {
          user: {
            sharingIds: userId
          },
          organization: {
            sharingType: 'organization',
            sharingIds: relations.organizationId
          },
          location: {
            sharingType: 'location'
          },
          area: {
            sharingType: 'area'
          }
        };

        if (relations.locationIds) {
          sharingOptions.location.sharingIds = {$in: relations.locationIds};
        }
        if (relations.areaIds) {
          sharingOptions.area.sharingIds = {$in: relations.areaIds};
        }
        query.$or = _.values(sharingOptions);
      }

      return TaskList.find(query);
    },
    children: [
      {
        find: function (task) {
          var reference = task.reference;
          if (Object.keys(reference).length) {
            var references = {
              suppliers: Suppliers,
              menus: MenuItems,
              jobs: JobItems
            };

            var referenceCollection = references[reference.type];
            return referenceCollection.find({_id: reference.id});
          } else {
            this.ready();
          }
        }
      }
    ]
  }
});