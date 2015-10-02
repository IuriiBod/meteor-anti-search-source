Meteor.methods({
  createCategory: function(name) {
    if(!HospoHero.isManager()) {
      logger.error("User not permitted to add categories");
      throw new Meteor.Error(403, "User not permitted to add categories");
    }
    if(!name) {
      logger.error("Category should have a name");
      return new Meteor.Error("Category should have a name");
    }
    var exist = Categories.findOne({
      name: name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if(exist) {
      logger.error('Category name should be unique', exist);
      throw new Meteor.Error("Category name should be unique");
    }
    var id = Categories.insert({
      name: name,
      relations: HospoHero.getRelationsObject()
    });
    logger.info("New Category created", id);
    return id;
  },

  createStatus: function(name) {
    if(!HospoHero.perms.canEditMenu()) {
      logger.error("User not permitted to add statuses");
      throw new Meteor.Error(403, "User not permitted to add statuses");
    }
    if(!name) {
      logger.error("Status should have a name");
      return new Meteor.Error(404, "Status should have a name");
    }
    var exist = Statuses.findOne({
      name: name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if(exist) {
      logger.error('Status name should be unique', exist);
      throw new Meteor.Error(404, "Status name should be unique");
    }
    var id = Statuses.insert({
      "name": name.toLowerCase(),
      relations: HospoHero.getRelationsObject()
    });
    logger.info("New Status created", id);
    return id;
  },

  createSection: function(name) {
    if(!HospoHero.perms.canEditRoster()) {
      logger.error("User not permitted to add sections");
      throw new Meteor.Error(403, "User not permitted to add sections");
    }
    if(!name) {
      logger.error("Section should have a name");
      return new Meteor.Error("Section should have a name");
    }
    var exist = Sections.findOne({
      "name": name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if(exist) {
      logger.error('Section name should be unique', exist);
      throw new Meteor.Error("Section name should be unique");
    }
    var id = Sections.insert({
      "name": name,
      relations: HospoHero.getRelationsObject()
    });
    logger.info("New section added", id);
  },

  deleteSection: function(id) {
    if(!HospoHero.perms.canEditRoster()) {
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
  },

  editSection: function(id, name) {
    if(!HospoHero.perms.canEditRoster()) {
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
  }
});
