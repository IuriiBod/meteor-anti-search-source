let canUserEditInterviews = (areaId = null) => {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit interviews');
};


Meteor.methods({
  crateInterview (interview) {
    check(interview, HospoHero.checkers.InterviewDocument);

    let areaId = HospoHero.getCurrentAreaId(this.userId);

    if (!canUserEditInterviews(areaId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    _.extend(interview, {
      createdAt: new Date(),
      createdBy: Meteor.userId(),
      relations: HospoHero.getRelationsObject(areaId)
    });

    return Interviews.insert(interview);
  },
  
  updateInterview (interview) {
    check(interview, HospoHero.checkers.InterviewDocument);
    let areaId = HospoHero.utils.getNestedProperty(interview, 'relations.areaId', false);

    if (!canUserEditInterviews(areaId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    return Interviews.update({_id: interview._id}, {$set: interview});
  }
});