Meteor.methods({
  removeCurrentUserFromConversations (conversationId) {
    //this needed, because standard client method for removing participant from conversation not working
    check(conversationId, HospoHero.checkers.MongoId);

    Meteor.conversations.update({
      _id: conversationId
    }, {
      $pull: {_participants: this.userId}
    });

    Meteor.conversations.remove({
      _id: conversationId,
      _participants: []
    });

    Meteor.participants.remove({
      conversationId: conversationId,
      userId: this.userId
    });
  },

  addSubjectOfConversation (conversationId, subject) {
    check(conversationId, HospoHero.checkers.MongoId);
    check(subject, String);

    Meteor.conversations.update({
      _id: conversationId
    }, {
      $set: {subject: subject}
    });
  }
});
