let canUserEditInterviews = (organizationId = null) => {
  let checker = new HospoHero.security.PermissionChecker();
  return checker.hasPermissionInOrganization(organizationId, 'edit interviews');
};


Meteor.methods({
  crateInterview (interview) {
    check(interview, HospoHero.checkers.InterviewDocument);

    if (!canUserEditInterviews(interview.organizationId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    _.extend(interview, {
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });

    return Interviews.insert(interview);
  },

  updateInterview (interview) {
    check(interview, HospoHero.checkers.InterviewDocument);
    if (!canUserEditInterviews(interview.organizationId)) {
      throw new Meteor.Error('You can\'t edit interviews');
    }

    return Interviews.update({_id: interview._id}, {$set: interview});
  }
});