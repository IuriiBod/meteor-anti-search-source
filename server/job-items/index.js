Meteor.methods({
  'createJobItem': function (newJobItemInfo) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error(403, "User not permitted to create jobs");
    }

    check(newJobItemInfo, HospoHero.checkers.JobItemDocument);

    var defaultJobItemProperties = {
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject(),
      createdOn: new Date(),
      status: 'active'
    };

    var newJobItemInfo = _.extend(newJobItemInfo, defaultJobItemProperties);

    var createdJobItemId = JobItems.insert(newJobItemInfo);

    logger.info("JobItem inserted", {
      jobItemId: createdJobItemId
    });

    return createdJobItemId;
  },

  'editJobItem': function (newJobItemInfo) {
    if (!HospoHero.canUser('edit jobs', Meteor.userId())) {
      logger.error(403, "User not permitted to edit jobs");
    }
    check(newJobItemInfo, HospoHero.checkers.JobItemDocument);

    JobItems.update({_id: newJobItemInfo._id}, newJobItemInfo);

    logger.info("JobItem updated", {
      jobItemId: newJobItemInfo._id
    });

    return newJobItemInfo._id;
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

    var notificationSender = new NotificationSender(
      'Job item deleted',
      'job-item-deleted',
      {
        itemName: job.name,
        username: HospoHero.username(Meteor.userId())
        //linkToItem: Router.url(routeName, {_id: id}) TODO
      }
    );

    var subscriberIds = HospoHero.databaseUtils.getSubscriberIds('job', id);
    subscriberIds.forEach(function (subscription) {
      if (subscription.subscriber != Meteor.userId()) {
        notificationSender.sendNotification(subscription.subscriber);
      }
      subscription.itemIds = id;
      Meteor.call('subscribe', subscription, true);
    });

    JobItems.remove({'_id': id});
    logger.info("Job Item removed", {"id": id});
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
        console.log(item);
        return Meteor.call('duplicateIngredient', item.id, areaId, item.quantity);
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

    if (status == 'archived') {
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
