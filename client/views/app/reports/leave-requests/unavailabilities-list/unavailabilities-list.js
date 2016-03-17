Template.unavailabilitiesList.onCreated(function () {
	this.page = new Blaze.ReactiveVar(1);
	this.query = {'unavailabilities.0': {'$exists': true}};
	const currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
	this.autorun(() => {
		this.subscribe('areaUnavailabilitiesList', currentAreaId,
			this.page.get() * this.data.temPerPage);
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
	'click [data-action="load-more"]': (e, t) => {
		e.preventDefault();
		var page = t.page.get();
		t.page.set(page + 1);
	}
});
