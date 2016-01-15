Meteor.methods({
  createComment: function (comment, refType, recipients) {
    if (!HospoHero.isInOrganization(Meteor.userId())) {
      logger.error('User can\'t leave comments');
      throw new Meteor.Error(403, 'User can\'t leave comments');
    }
    check(comment, HospoHero.checkers.CommentChecker);


    var getReferenceObject = function (referenceType, referenceId) {
      var typeCollectionRelations = {
        menu: MenuItems,
        job: JobItems,
        stockOrders: StocktakeMain,
        supplier: Suppliers,
        taskItem: TaskList
      };
      return typeCollectionRelations[referenceType].findOne({_id: referenceId});
    };

    var getLinkToReference = function (referenceType, referenceId) {
      var routesRelations = {
        menu: 'menuItemDetail',
        job: 'jobItemDetailed',
        stockOrders: 'stocktakeOrdering',
        supplier: 'supplierProfile',
        taskItem: 'taskList'
      };
      var routeName = routesRelations[referenceType];
      return referenceType === 'taskItem' ? Router.url(routeName, {_id: referenceId}) : Router.url(routeName);
    };

    var getItemName = function (reference, refType) {
      if (reference.name) {
        return reference.name;
      } else if (refType === 'taskItem') {
        return reference.title;
      } else if (refType === 'stockOrders') {
        return 'stocktake from ' + HospoHero.dateUtils.dateFormat(reference.date);
      } else {
        return '';
      }
    };


    var additionalCommentInfo = {
      createdOn: new Date(),
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject()
    };
    comment = _.extend(comment, additionalCommentInfo);

    var id = Comments.insert(comment);
    logger.info("Comment inserted", id);

    var reference = getReferenceObject(refType, comment.reference);
    var linkToItem = getLinkToReference(refType, comment.reference);
    var itemName = getItemName(reference, refType);

    var notificationSender = new NotificationSender(
      'New comment',
      'new-comment',
      {
        itemName: itemName,
        username: HospoHero.username(Meteor.userId()),
        linkToItem: linkToItem
      }
    );

    if (recipients.length) {
      recipients.forEach(function (recipient) {
        notificationSender.sendNotification(recipient ._id);
      });
    }
    return id;
  }
});