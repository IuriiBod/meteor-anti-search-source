Template.positionsList.helpers({
  positions() {
    return Positions.find();
  },

  onPositionRemove () {
    return (positionId) => {
      Meteor.call('removePosition', positionId, HospoHero.handleMethodResult());
    };
  }
});

Template.positionsList.events({
  'submit form': function (event) {
    event.preventDefault();

    let positionName = event.target['position-name'].value;
    Meteor.call('addNewPosition', positionName, HospoHero.handleMethodResult(() => {
      event.target.reset();
    }));
  }
});