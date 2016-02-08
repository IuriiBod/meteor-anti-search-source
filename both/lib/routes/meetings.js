Router.route('meetings', {
  path: '/meetings/:filter?',
  template: 'meetingsList',
  waitOn () {
    let area = HospoHero.getCurrentArea(Meteor.userId());
    if (area) {
      return Meteor.subscribe('meetings', Meteor.userId(), area.locationId);
    }
  }
});