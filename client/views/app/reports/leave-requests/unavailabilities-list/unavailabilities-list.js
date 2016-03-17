Template.unavailabilitiesList.onCreated(function () {
  this.page = new Blaze.ReactiveVar(1);
  this.query = {'unavailabilities.0': {'$exists': true}};
  const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
  this.autorun(() => {
    this.subscribe('areaUnavailabilitiesList', currentAreaId,
      this.page.get() * this.data.itemPerPage);
  });
});

Template.unavailabilitiesList.helpers({
  users: function () {
    return Meteor.users.find(Template.instance().query);
  },
  isHasMoreItems: function () {
    let page = Template.instance().page.get();
    return Meteor.users.find(Template.instance().query).count() /
      (page * this.itemPerPage) >= 1;
  }
});
Template.unavailabilitiesList.events({
  'click [data-action="load-more"]': (event, tmpl) => {
    event.preventDefault();

    var page = tmpl.page.get();
    tmpl.page.set(page + 1);
  }
});
