Meteor.publish('files', function (referenceId) {
  return Files.find({
    referenceId: referenceId
  });
});


Meteor.methods({
  addFile (fileDocument) {
    check(fileDocument, HospoHero.checkers.FileDocument);

    let defaultFile = {
      createdBy: Meteor.userId(),
      createdAt: new Date()
    };

    _.extend(fileDocument, defaultFile);
    Files.insert(fileDocument);
  }
});