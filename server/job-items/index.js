Meteor.methods({
  'createJobItem': function (info) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }

    check(info, Object);
    check(info.name, String);


    if (!info.type) {
      logger.error("Type field not found");
      throw new Meteor.Error(404, "Type field not found");
    }
    var exist = JobItems.findOne({
      "name": info.name,
      "relations.areaId": HospoHero.getCurrentAreaId()
    });
    if (exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var doc = {};
    doc.name = info.name;
    if (!info.activeTime) {
      logger.error("Time field not found");
      throw new Meteor.Error(404, "Time field not found");
    }
    doc.activeTime = parseInt(info.activeTime) * 60; //seconds
    doc.status = "active";
    var type = JobTypes.findOne(info.type);
    if (!type) {
      logger.error("Type not found");
      throw new Meteor.Error(404, "Type not found");
    }
    doc.type = info.type;

    if (info.wagePerHour) {
      doc.wagePerHour = info.wagePerHour;
    }

    if (type.name == "Prep") {
      if (info.shelfLife == info.shelfLife) {
        doc.shelfLife = parseFloat(info.shelfLife); //days
      }
      doc.recipe = info.recipe;
      if (info.portions == info.portions) {
        doc.portions = parseInt(info.portions);
      }
      doc.ingredients = [];
      if (info.ingredients) {
        if (info.ingredients.length > 0) {
          var ingIds = [];
          info.ingredients.forEach(function (item) {
            if (ingIds.indexOf(item._id) < 0) {
              ingIds.push(item._id);
              doc.ingredients.push(item);
            }
          });
        }
      }
    } else if (type.name == "Recurring") {
      doc.repeatAt = info.repeatAt;
      doc.description = info.description;
      doc.frequency = info.frequency;
      doc.startsOn = new Date(info.startsOn).getTime();
      doc.endsOn = info.endsOn;
      if (_.contains(["Every X Weeks", "Weekly"], info.frequency)) {
        doc.repeatOn = info.repeatOn;

        if (info.frequency === "Every X Weeks") {
          doc.step = parseInt(info.step);
        }
      }
      doc.section = info.section;
      doc.checklist = info.checklist;
    }

    doc.createdOn = Date.now();
    doc.createdBy = Meteor.userId();
    doc.relations = HospoHero.getRelationsObject();
    var id = JobItems.insert(doc);
    logger.info("Job Item inserted", {"jobId": id, 'type': type.name});

    var options = {
      type: 'job',
      title: doc.name + ' job has been created',
      actionType: 'create',
      ref: id
    };
    HospoHero.sendNotification(options);
    return id;
  },

  // TODO: I am crying...;(
  'editJobItem': function (id, info) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }

    check(id, HospoHero.checkers.MongoId);
    check(info, Object);

    var job = JobItems.findOne(id);
    if (!job) {
      logger.error("Job item does not exist", {"jobId": id});
      throw new Meteor.Error(404, "Job item does not exist");
    }

    if (Object.keys(info).length < 0) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }

    var jobType = JobTypes.findOne({_id: info.type});
    if (!jobType) {
      logger.error("Unknown job type");
      throw new Meteor.Error(404, "Unknown job type");
    }

    var query = {
      $set: {}
    };
    var updateDoc = {};
    var removeDoc = {};
    if (info.name) {
      if (info.name.trim() == "") {
        logger.error("Name field null");
        throw new Meteor.Error(404, "You can't add empty name for job");
      } else {
        if (info.name != job.name) {
          updateDoc.name = info.name;
        }
      }
    }

    if (info.type) {
      if (info.type != job.type) {
        updateDoc.type = info.type;
      }
    }

    if (info.activeTime && (info.activeTime == info.activeTime)) {
      if (info.activeTime > 0) {
        var activeTime = parseInt(info.activeTime) * 60;
        if (activeTime != job.activeTime) {
          updateDoc.activeTime = activeTime;
        }
      }
    }

    if (info.wagePerHour || (info.wagePerHour == info.wagePerHour)) {
      if (info.wagePerHour >= 0) {
        var wagePerHour = parseFloat(info.wagePerHour);
        if (wagePerHour != job.wagePerHour) {
          updateDoc.wagePerHour = wagePerHour;
        }
      }
    }
    var type = JobTypes.findOne(info.type);
    if (type.name == "Prep") {
      if ((info.shelfLife == info.shelfLife) && info.shelfLife >= 0) {
        var shelfLife = parseFloat(info.shelfLife);
        if (shelfLife != job.shelfLife) {
          updateDoc.shelfLife = shelfLife;
        }
      }

      if (info.recipe) {
        if (info.recipe != job.recipe) {
          updateDoc.recipe = info.recipe;
        }
      }

      if ((info.portions == info.portions) && info.portions >= 0) {
        var portions = parseFloat(info.portions);
        if (portions != job.portions) {
          updateDoc.portions = portions;
        }
      }

      updateDoc.ingredients = [];
      if (info.ingredients && (info.ingredients.length > 0)) {
        var ingIds = [];
        info.ingredients.forEach(function (item) {
          if (ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            updateDoc.ingredients.push(item);
          }
        });
      }

      removeDoc.repeatAt = "";
      removeDoc.repeatOn = "";
      removeDoc.frequency = "";
      removeDoc.endsOn = "";
      removeDoc.startsOn = "";
      removeDoc.section = "";
      removeDoc.description = "";
    } else if (type.name == "Recurring") {
      if (info.repeatAt) {
        if (info.repeatAt != job.repeatAt) {
          updateDoc.repeatAt = info.repeatAt;
        }
      }
      if (info.description) {
        if (info.description != job.description) {
          updateDoc.description = info.description;
        }
      }
      if (info.frequency) {
        if (info.frequency != job.frequency) {
          updateDoc.frequency = info.frequency;
        }
        if (_.contains(["Every X Weeks", "Weekly"], info.frequency)) {
          updateDoc.repeatOn = info.repeatOn;
          if (info.frequency === "Every X Weeks" && info.step) {
            updateDoc.step = info.step;
          }
        }
      }
      if (info.startsOn) {
        if (info.startsOn != new Date(job.startsOn).getTime()) {
          updateDoc.startsOn = new Date(info.startsOn).getTime();
        }
      }
      if (info.endsOn) {
        updateDoc.endsOn = info.endsOn;
      }
      if (info.section) {
        if (info.section != job.section) {
          updateDoc.section = info.section;
        }
      }
      if (info.checklist) {
        updateDoc.checklist = info.checklist;
      }
      removeDoc.shelfLife = "";
      removeDoc.portions = "";
      removeDoc.ingredients = "";
      removeDoc.recipe = "";
    }

    if (Object.keys(updateDoc).length > 0) {
      updateDoc['editedOn'] = Date.now();
      updateDoc['editedBy'] = Meteor.userId();
      query["$set"] = updateDoc;
      if (Object.keys(removeDoc).length > 0) {
        query["$unset"] = removeDoc;
      }
      logger.info("Job Item updated", {"JobItemId": id});
      var editJobId = JobItems.update({'_id': id}, query);

      var options = {
        type: 'job',
        title: job.name + ' job has been updated',
        ref: id
      };
      HospoHero.sendNotification(options);
      return editJobId;
    }
  },

  'deleteJobItem': function (id) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }

    check(id, HospoHero.checkers.MongoId);

    var job = JobItems.findOne(id);
    if (!job) {
      logger.error("Job Item not found", {"id": id});
      throw new Meteor.Error(404, "Job Item not found");
    }

    var existInMenuItems = MenuItems.findOne(
      {"jobItems": {$elemMatch: {"_id": id}}},
      {fields: {"jobItems": {$elemMatch: {"_id": id}}}}
    );

    if (existInMenuItems) {
      if (existInMenuItems.jobItems.length > 0) {
        logger.error("Item found in Menu Items, can't delete. Archiving job item");
        throw new Meteor.Error(404, "Delete not permitted");
      }
    }
    logger.info("Job Item removed", {"id": id});
    JobItems.remove({'_id': id});

    var options = {
      actionType: 'delete',
      type: 'job',
      title: job.name + ' job has been deleted',
    };
    HospoHero.sendNotification(options);
  },

  'addIngredientsToJob': function (id, ingredient, quantity) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }

    check(id, HospoHero.checkers.MongoId);

    var jobItem = JobItems.findOne(
      {"_id": id, "ingredients": {$elemMatch: {"_id": ingredient}}}
    );

    if (!jobItem) {
      logger.error("Job item or ingredient does not exist");
      throw new Meteor.Error(404, "Job item or ingredient does not exist");
    }

    var query = {
      $addToSet: {}
    };
    query['$addToSet']['ingredients'] = {"_id": ingredient, "quantity": quantity};
    JobItems.update({'_id': id}, query);
    logger.info("Ingredients added to job item", id);
  },

  duplicateJobItem: function (jobItemId, areaId, quantity) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to duplicate job items");
      throw new Meteor.Error(403, "User not permitted to duplicate job items");
    }

    check(jobItemId, HospoHero.checkers.MongoId);
    check(areaId, HospoHero.checkers.MongoId);

    if (!Areas.findOne(areaId)) {
      logger.error("Area not found!");
      throw new Meteor.Error("Area not found!");
    }

    var jobItem = JobItems.findOne({_id: jobItemId});

    if (!quantity || jobItem.relations.areaId != areaId) {
      jobItem = HospoHero.misc.omitAndExtend(jobItem, ['_id', 'editedOn', 'editedBy', 'relations'], areaId);

      jobItem.ingredients = HospoHero.misc.itemsMapperWithCallback(jobItem.ingredients, function (item) {
        return Meteor.call('duplicateIngredient', item._id, areaId, item.quantity);
      });

      jobItem.name = HospoHero.misc.copyingItemName(jobItem.name, JobItems, areaId);
      jobItemId = JobItems.insert(jobItem);

      logger.info("Duplicate job item added ", {_id: jobItemId});
    }

    return quantity === false ? jobItemId : {_id: jobItemId, quantity: quantity};
  },

  'archiveJobItem': function (id) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }

    check(id, HospoHero.checkers.MongoId);

    var job = JobItems.findOne({_id: id});
    var status = (job && job.status == "archived") ? "active" : "archived";

    if(status == 'archived') {
      var existInMenus = MenuItems.find({
        jobItems: {
          $elemMatch: {
            _id: id
          }
        }
      });

      if (existInMenus.count()) {
        var error = [];
        error.push("Can't archive item! Remove it form next menus:\n");

        existInMenus.forEach(function (item) {
          error.push('- ' + item.name + '\n');
        });

        logger.error(404, error.join(''));
        throw new Meteor.Error(404, error.join(''));
      }
    }

    JobItems.update({_id: id}, {$set: {status: status}});
    return status;
  }
});
