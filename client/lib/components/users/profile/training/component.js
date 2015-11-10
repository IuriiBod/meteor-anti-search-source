var component = FlowComponents.define("training", function(props) {
  this.userId = props.userId;
});

component.state.sections = function () {
  return Sections.find({
    'relations.areaId': HospoHero.getCurrentAreaId()
  });
};

component.state.userSelectedSections = function (sectionId) {
  return !!Meteor.users.findOne({
    _id: this.userId,
    sections: sectionId
  });
};

component.action.toggleUserTrainingSection = function (sectionId, isAddingSection) {
  Meteor.call('toggleUserTrainingSection', this.userId, sectionId, isAddingSection);
};