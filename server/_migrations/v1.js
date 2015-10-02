Migrations.add({
  version: 1,
  name: "Add organizations and roles to the project",
  up: function() {
    var admin;
    var organization;
    var organizationId;
    var location;
    var locationId;
    var area;
    var areaId;
    var users;
    var relationInsertQuery;
    var userUpdateQuery = {
      $unset: {
        isAdmin: "",
        isManager: "",
        isWorker: ""
      },
      $set: {
        roles: {}
      }
    };

    admin = Meteor.users.findOne({username: 'Tom'});

    if(!admin) {
      var id = Accounts.createUser({
        username: 'admin',
        email: 'admin@admin.com',
        password: 'qweqweqwe'
      });

      Meteor.users.update({_id: id}, {
        $set: {
          pinCode: '1111'
        }
      });

      // Find the admin user and make him an owner
      admin = Meteor.users.findOne({username: "admin"});
    }

    // Create default organization
    organization = {
      name: "Farm Cafe",
      owner: admin._id,
      createdAt: Date.now()
    };
    // Add an organization
    organizationId = Organizations.insert(organization);

    // Create default location
    location = {
      name: "Default location",
      address: "Melbourne",
      timezone: "+10",
      openingTime: "8:00",
      closingTime: "17:00",
      status: "Enabled",
      organizationId: organizationId,
      createdAt: Date.now()
    };
    // Add a location
    locationId = Locations.insert(location);

    // Create default area
    area = {
      name: "Default Area",
      status: "Enabled",
      locationId: locationId,
      organizationId: organizationId,
      createdAt: Date.now()
    };
    // Add an area
    areaId = Areas.insert(area);

    relationInsertQuery = {
      organizationId: organizationId,
      locationIds: [locationId],
      areaIds: [areaId]
    };

    // Find all users
    users = Meteor.users.find().fetch();
    if(users.length) {
      var ownerRole = Meteor.roles.findOne({name: 'Owner'});
      var managerRole = Meteor.roles.findOne({name: 'Manager'});
      var workerRole = Meteor.roles.findOne({name: 'Worker'});

      userUpdateQuery.$set.relations = relationInsertQuery;

      users.forEach(function(user) {
        if(user._id == admin._id) {
          userUpdateQuery.$set.roles[areaId] = ownerRole._id;
        } else if(user.isAdmin || user.isManager) {
          userUpdateQuery.$set.roles[areaId] = managerRole._id;
        } else {
          userUpdateQuery.$set.roles[areaId] = workerRole._id;
        }
        // Update users collection
        Meteor.users.update({_id: user._id}, userUpdateQuery);
      });
    }

    var collections = [
      Shifts,
      Sections,
      Jobs,
      Suppliers,
      Ingredients,
      JobItems,
      MenuItems,
      Comments,
      Posts,
      Categories,
      Notifications,
      GeneralAreas,
      SpecialAreas,
      StocktakeMain,
      Stocktakes,
      StockOrders,
      OrderReceipts
    ];

    relationInsertQuery = {
      organizationId: organizationId,
      locationId: locationId,
      areaId: areaId
    };

    collections.forEach(function(collection) {
      // Find all shifts
      var docs = collection.find().fetch();
      if(docs) {
        docs.forEach(function(doc) {
          // Create new relations
          collection.update({ _id: doc._id }, {$set: {relations: relationInsertQuery}});
        });
      }
    });
  }
});