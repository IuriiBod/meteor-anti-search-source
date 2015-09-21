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
    var shifts;
    var menus;
    var jobs;
    var stocks;
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


    // Find the admin user and make him an admin
    admin = Meteor.users.findOne({username: "Tom"});

    if(!admin) {
      console.log('Can\'t find an administrate user');
      return false;
    }
    console.log('User found: ', admin);

    // Create default organization
    organization = {
      name: "Farm Cafe",
      owner: admin._id,
      createdAt: Date.now()
    };
    // Add an organization
    organizationId = Organizations.insert(organization);
    console.log('Organization created: ', organizationId);

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
    console.log('Location created: ', locationId);

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
    console.log('Area created: ', areaId);

    relationInsertQuery = {
      organizationId: organizationId,
      locationIds: [locationId],
      areaIds: [areaId]
    };

    // Find all users
    users = Meteor.users.find().fetch();
    if(users.length) {
      var adminRole = Meteor.roles.findOne({name: 'Admin'});
      var managerRole = Meteor.roles.findOne({name: 'Manager'});
      var workerRole = Meteor.roles.findOne({name: 'Worker'});
      userUpdateQuery.$set.relationIds = relationInsertQuery;
      users.forEach(function(user) {
        if(user._id == admin._id) {
          userUpdateQuery.$set.roles = adminRole._id;
        } else if(user.isAdmin || user.isManager) {
          userUpdateQuery.$set.roles[areaId] = managerRole._id;
        } else {
          userUpdateQuery.$set.roles[areaId] = workerRole._id;
        }
        // Update users collection
        Meteor.users.update({_id: user._id}, userUpdateQuery);
      });
    }
    console.log('Users have been updated');

    var collections = [
      Shifts,
      MenuItems,
      Ingredients,
      JobItems,
      Jobs,
      SalesForecast,
      ActualSales,
      Sales,
      SalesCalibration,
      ForecastCafe,
      Comments,
      Notifications,
      Categories,
      Sections,
      GeneralAreas,
      Posts,
      StocktakeMain,
      Stocktakes,
      CurrentStocks,
      StockOrders,
      OrderReceipts,
      Suppliers
    ];

    collections.forEach(function(collection) {
      // Find all shifts
      var docs = collection.find().fetch();
      if(docs) {
        docs.forEach(function(doc) {
          // Create new relations
          collection.update({ _id: doc._id }, {$set: {relationIds: relationInsertQuery}});
        });
      }
    });

    console.log('Migration successfully completed');
  }
});