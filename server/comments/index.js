Meteor.methods({
  'createComment': function(text, ref, refType, recipients) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!text) {
      logger.error("Text field not found");
      throw new Meteor.Error(404, "Text field not found");
    }
    if(!ref) {
      logger.error("Reference field not found");
      throw new Meteor.Error(404, "Reference field not found");
    }
    var doc = {
      text: text,
      createdOn: Date.now(),
      createdBy: Meteor.userId(),
      reference: ref,
      relations: HospoHero.getRelationsObject()
    };
    var id = Comments.insert(doc);
    logger.info("Comment inserted", id);

    var typeCollectionRelations = {
      menu: MenuItems,
      job: JobItems,
      workerJob: Jobs,
      supplier: Suppliers
    };
    var reference = typeCollectionRelations[refType].findOne({ _id: ref });

    if(recipients.length) {
      recipients = _.map(recipients, function(recipientName) {
        var user = Meteor.users.findOne({username: recipientName});
        return user ? user._id : null;
      });
    }

    var options = {
      title: 'New comment on ' + reference.name + ' by ' + HospoHero.username(Meteor.userId()),
      to: recipients,
      type: 'comment',
      commentId: id
    };

    HospoHero.sendNotification(options);

    return id;
  }
});