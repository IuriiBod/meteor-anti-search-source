Template.training.helpers({
  sections: function () {
    return Sections.find({
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },

  userTrainedSections: function () {
    var userId = Template.instance().data.userId;
    var user = Meteor.users.findOne({_id: userId});
    if (user && user.profile.sections) {
      return Sections.find({_id: {$in: user.profile.sections}});
    } else {
      return false;
    }
  },

  isSelectedSection: function (sectionId) {
    var userId = Template.instance().data.userId;
    return !!Meteor.users.findOne({
      _id: userId,
      'profile.sections': sectionId
    });
  }
});

Template.training.events({
  'click .section-checker': function (event, tmpl) {
    var userId = tmpl.data.userId;

    Meteor.call('toggleUserTrainingSection', userId, this._id, event.target.checked);
  }
});