Migrations.add({
  version: 1,
  name: "Add organizations and roles to the project",
  up: function() {
    // Find the Tom and make him an admin
    var tom = Meteor.users.findOne({username: "Tom"});

    // Create default organization
    var organization = {
      name: "Farm Cafe",
      owner: tom._id,
      createdAt: Date.now()
    };
    // Add an organization


  }
});