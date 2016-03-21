let ApplicationDocument = Match.Where(application => {
  check(application, {
    createdAt: Date,
    details: Object,
    relations: HospoHero.chackers.Relations,

    _id: HospoHero.checkers.OptionalMongoId,
    appProgress: Match.Optional([String])
  });

  return true;
});

//let a = {
//  createdAt: new Date(),
//  details: {
//    name: 'Vadym Vorobel',
//    email: 'test@test.com',
//    phone: '123456789',
//    dateOfBirth: new Date('1994-04-07'),
//    numberOfHours: 40,
//    availability: [1,2,3,4,5]
//  },
//  availabilities: [Number],
//  relations: HospoHero.getRelationsObject('Jeoa5mjds2ybBnne8')
//};
//
//Applications.insert(a);