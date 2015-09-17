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
    var role;
    var doc = {};


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

    // Find all users
    users = Meteor.users.find().fetch();
    if(users.length) {
      users.forEach(function(user) {
        if(user._id == admin._id) {
          role = 'owner';
        } else if(user.isAdmin || user.isManager) {
          role = 'manager';
        } else {
          role = 'worker';
        }

        doc.$unset = {
          isAdmin: null,
          isManager: null,
          isWorker: null
        };
        doc.$set = {};
        doc.$set.roles = {};
        doc.$set.roles[areaId] = role;
        Meteor.users.update({_id: user._id}, doc);
      });
    }
    console.log('Migration successfully completed');
  }
});