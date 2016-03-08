Meteor.methods({
  removeCurrentUserFromConversations (conversationId) {
    check(conversationId, HospoHero.checkers.MongoId);

    Meteor.conversations.update({
      _id: conversationId
    }, {
      $pull: {_participants: this.userId}
    });
  }
});
