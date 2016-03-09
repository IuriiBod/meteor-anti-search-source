Meteor.methods({
  removeCurrentUserFromConversations (conversationId) {
    //this needed, because standard client method for removing participant from conversation not working
    check(conversationId, HospoHero.checkers.MongoId);

    Meteor.conversations.update({
      _id: conversationId
    }, {
      $pull: {_participants: this.userId}
    });

    Meteor.participants.remove({
      conversationId: conversationId,
      userId: this.userId
    });
  }
});
