Template.training.events({
  'click .section-checker': function (e) {
    FlowComponents.callAction('toggleUserTrainingSection', this._id, e.target.checked);
  }
});