let ApplicationDocumentDetails = {
  name: String,  // field is required
  email: String, // field is required
  availability: [Number],
  dateOfBirth: Date,
  files: Match.Optional([Match.Where(id => {
    check(id, String);
    return /[0-9a-zA-Z]{17}/.test(id);
  })]), // MongoId
  message: String,
  numberOfHours: Number,
  phone:String
};

let ApplicationDocument = Match.Where(application => {
  check(application, {
    _id: HospoHero.checkers.MongoId,
    createdAt: Date,
    positionIds: [HospoHero.checkers.MongoId],
    organizationId:HospoHero.checkers.MongoId,

    // these two strings can be dynamically changed.
    // We don't know exactly, what structure they will have
    appProgress: [String],
    details: Object
  });

  return true;
});

Namespace('HospoHero.checkers', {
  ApplicationDocument: ApplicationDocument,
  ApplicationDocumentDetails:ApplicationDocumentDetails
});