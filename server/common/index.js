Meteor.methods({
  'createCategory': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Category should have a name");
      return new Meteor.Error(404, "Category should have a name");
    }
    var exist = Categories.findOne({"name": name});
    if(exist) {
      logger.error('Category name should be unique', exist);
      throw new Meteor.Error(404, "Category name should be unique");
    }
    logger.info("New Category created", id);
    return Categories.insert({"name": name});
  },

  'createStatus': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Status should have a name");
      return new Meteor.Error(404, "Status should have a name");
    }
    var exist = Statuses.findOne({"name": name});
    if(exist) {
      logger.error('Status name should be unique', exist);
      throw new Meteor.Error(404, "Status name should be unique");
    }
    logger.info("New Status created", id);
    return Statuses.insert({"name": name.toLowerCase()});
  },

  'createSection': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Section should have a name");
      return new Meteor.Error(404, "Section should have a name");
    }
    var exist = Sections.findOne({"name": name});
    if(exist) {
      logger.error('Section name should be unique', exist);
      throw new Meteor.Error(404, "Section name should be unique");
    }
    var id = Sections.insert({"name": name});
    logger.info("New section added", id);
    return;
  },

  'deleteSection': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
   
    var exist = Sections.findOne(id);
    if(!exist) {
      logger.error('Section does not exist');
      throw new Meteor.Error(404, "Section does not exist");
    }
    var usedInJobItems = JobItems.findOne({"section": exist.name});
    if(usedInJobItems) {
      logger.error('Section exist in job items');
      throw new Meteor.Error(404, "Section exist in job items");
    }
    var usedInShifts = Shifts.findOne({"section": exist.name});
    if(usedInShifts) {
      logger.error('Section exist in shifts');
      throw new Meteor.Error(404, "Section exist in shifts");
    }
    Sections.remove(id);
    logger.info("Section removed", id);
    return;
  },

  'editSection': function(id, name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    var exist = Sections.findOne(id);
    if(!exist) {
      logger.error('Section does not exist');
      throw new Meteor.Error(404, "Section does not exist");
    }
    Sections.update({"_id": id}, {$set: {"name": name}});
    logger.info("Section name updated", id);
    return;
  },

  'createGeneralArea': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("General area should have a name");
      return new Meteor.Error(404, "General area should have a name");
    }
    var exist = GeneralAreas.findOne({"name": name});
    if(exist) {
      logger.error('General area name should be unique', exist);
      throw new Meteor.Error(404, "General area name should be unique");
    }
    var id = GeneralAreas.insert({"name": name, "specialAreas": [], "createdAt": Date.now()});
    logger.info("New General area created", id);
    return id;
  },

  'createSpecialArea': function(name, gareaId) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Special area should have a name");
      return new Meteor.Error(404, "Special area should have a name");
    }
    if(!gareaId) {
      logger.error("General area id not found");
      return new Meteor.Error(404, "General area id not found");
    }
    var gAreaExist = GeneralAreas.findOne(gareaId);
    if(!gAreaExist) {
      logger.error('General area does not exist', gareaId);
      throw new Meteor.Error(404, "General area does not exist");
    }
    var exist = SpecialAreas.findOne({"name": name});
    if(exist) {
      logger.error('Special area name should be unique', exist);
      throw new Meteor.Error(404, "Special area name should be unique");
    }
    var id = SpecialAreas.insert({"name": name, "generalArea": gareaId, "createdAt": Date.now()});
    GeneralAreas.update({"_id": gareaId}, {$addToSet: {"specialAreas": id}});
    logger.info("New Special area created", id);
    return id;
  },

});
