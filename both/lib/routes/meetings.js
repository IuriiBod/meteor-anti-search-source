Router.route('meetings', {
  path: '/meetings',
  template: 'meetingsList',
  waitOn () {
    let area = HospoHero.getCurrentArea(Meteor.userId());
    if (area) {
      return Meteor.subscribe('meetings', Meteor.userId(), area.locationId);
    }
  }
});

Router.route('meetingDetails', {
  path: '/meeting-details/:id',
  template: 'meetingDetails',
  waitOn () {
    return Meteor.subscribe('meeting', this.params.id, Meteor.userId());
  },

  data () {
    return {
      id: this.params.id
    }
  }
});