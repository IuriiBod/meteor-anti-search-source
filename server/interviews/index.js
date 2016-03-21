let canUserEditInterviews = (areaId = null) => {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit interviews');
};


Meteor.methods({
  updateInterview (interview) {
    let areaId = HospoHero.getCurrentAreaId(this.userId);

    if (!canUserEditInterviews(areaId, interview)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    check(interview, HospoHero.checkers.InterviewDocument);
    return Interviews.update({_id: interview._id}, {$set: interview});
  }
});