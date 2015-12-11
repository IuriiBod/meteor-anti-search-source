Template.training.helpers({
  sections: function () {
    return Sections.find({
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },
  userSelectedSections: function(sectionId) {
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