Meteor.methods({
  createComment: function (comment, refType, recipients) {
    if (!HospoHero.getCurrentAreaId(this.userId)) {
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
        taskItem: TaskList,
        meeting: Meetings,
        noteItem: ManagerNotes,
        project: Projects,
        interview: Interviews,
        application: Applications

      };
      return typeCollectionRelations[referenceType].findOne({_id: referenceId});
    };

    var getLinkToReference = function (referenceType, referenceId) {
      var routesRelations = {
        menu: 'menuItemDetail',
        job: 'jobItemDetailed',
        stockOrders: 'stocktakeOrdering',
        supplier: 'supplierProfile',
        taskItem: 'taskList',
        meeting: 'meetingDetails',
        project: 'projectDerails',
        interview: 'interviewDetails'
      };
      var routeName = routesRelations[referenceType];
      return referenceType === 'taskItem' ? {
        route: routeName,
        params: {_id: referenceId}
      } : {route: routeName, params: {}};
    };

    var getItemName = function (reference, refType) {
      if (reference.name) {
        return reference.name;
      } else if (refType === 'taskItem') {
        return ' task ' + reference.title;
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
    var itemName = getItemName(reference, refType);

    var notificationSender = new NotificationSender(
      'New comment',
      'new-comment',
      {
        itemName: itemName,
        username: HospoHero.username(Meteor.userId()),
        itemLinkData: getLinkToReference(refType, comment.reference)
      }, {
        helpers: {
          linkToItem: function () {
            return NotificationSender.urlFor(this.itemLinkData.route, this.itemLinkData.params, this);
          }
        }
      }
    );

    if (recipients.length) {
      recipients.forEach(function (recipient) {
        notificationSender.sendNotification(recipient._id);
      });
    }
    return id;
  }
});