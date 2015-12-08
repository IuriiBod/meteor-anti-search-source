Template.training.onCreated(function() {
  this.set('userId', this.data.userId);
});

Template.training.helpers({
  sections: function () {
    return Sections.find({
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  },
  userSelectedSections: function(sectionId) {
    var userId = Template.instance().get('userId');

    return !!Meteor.users.findOne({
      _id: userId,
      'profile.sections': sectionId
    });
  }
});

Template.training.events({
  'click .section-checker': function (e) {
    var userId = Template.instance().get('userId');
    Meteor.call('toggleUserTrainingSection', userId, this._id, e.target.checked);
  }
});