Template.positionsList.helpers({
  positions() {
    return Positions.find();
  },

  onPositionRemove () {
    let positionsListData = Template.parentData(1);
    let applicationId = positionsListData.applicationId;

    return (positionId) => {
      Meteor.call('removePosition', applicationId, positionId, HospoHero.handleMethodResult());
    };
  }
});

Template.positionsList.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    let positionName = event.target['position-name'].value;
    Meteor.call('addNewPosition', tmpl.data.applicationId, positionName, HospoHero.handleMethodResult(() => {
      event.target.reset();
    }));
  }
});