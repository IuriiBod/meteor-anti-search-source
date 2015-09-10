Meteor.methods({
  'createArea': function(area) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to create areas");
      throw new Meteor.Error(403, "User not permitted to create areas");
    }
    area.createdAt = Date.now();
    // Create area
    return Areas.insert(area);
  },
  'deleteArea': function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to delete areas");
      throw new Meteor.Error(403, "User not permitted to delete areas");
    }
    Areas.remove({_id: id});

    // TODO: Write the code to delete users which is related to area
  },

  'updateAreaName': function(id, val) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!isManagerOrAdmin(user)) {
      logger.error("User not permitted to edit area name");
      throw new Meteor.Error(403, "User not permitted to edit area name");
    }
    var count = Areas.find({name: val}).count();
    if(count == 0) {
      Areas.update({_id: id}, {$set: {name: val}});
    } else {
      throw new Meteor.Error("The area with name "+val+" already exists!");
    }
  }
});