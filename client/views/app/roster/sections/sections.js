Template.sections.helpers({
  sections: function () {
    return Sections.find({
      'relations.areaId': HospoHero.getCurrentAreaId()
    });
  }
});

Template.sections.events({
  'submit form': function (event) {
    event.preventDefault();

    var name = HospoHero.misc.getValuesFromEvent(event, 'sectionName', true);
    if (name) {
      Meteor.call("createSection", name.sectionName, HospoHero.handleMethodResult(function () {
        event.target.sectionName.value = '';
      }));
    }
  }
});