Template.profileHeader.onCreated(function () {
  this.subscribe('areaUsersList', HospoHero.getCurrentAreaId());
});

Template.profileHeader.helpers({
  profiles () {
    return Meteor.users.find({
      _id: {$nin: [Meteor.userId(), Router.current().params._id]},
      'relations.areaIds': HospoHero.getCurrentAreaId()
    }, {
      sort: {'profile.firstname': 1}
    }).fetch();
  }
});
