let canUserEditInterviews = (areaId = null) => {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInArea(areaId, 'edit interviews');
};


Meteor.methods({
  crateInterview (interview) {
    let areaId = HospoHero.getCurrentAreaId(this.userId);

    if (!canUserEditInterviews(areaId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }
    
    _.extend(interview, {
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
    
    check(interview, HospoHero.checkers.InterviewDocument);
    
    return Interviews.insert(interview);
  },
  
  updateInterview (interview) {
    let areaId = HospoHero.getCurrentAreaId(this.userId);

    if (!canUserEditInterviews(areaId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    check(interview, HospoHero.checkers.InterviewDocument);
    return Interviews.update({_id: interview._id}, {$set: interview});
  }
});