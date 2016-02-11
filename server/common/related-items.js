Meteor.publishAuthorized('relatedItems', function (referenceId) {
  return RelatedItems.find({
    referenceId: referenceId
  });
});


Meteor.methods({
  createRelatedItem (relatedItemDocument) {
    check(relatedItemDocument, HospoHero.checkers.RelatedItemDocument);

    let defaultRelatedItem = {
      createdBy: Meteor.userId(),
      createdAt: new Date()
    };

    _.extend(relatedItemDocument, defaultRelatedItem);
    RelatedItems.insert(relatedItemDocument);
  }
});