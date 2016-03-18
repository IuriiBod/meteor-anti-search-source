Router.route('applications', {
	path: '/applications',
	template: 'applicationsView',
	waitOn: function () {
			let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
			return [
					Meteor.subscribe('applicationDefinitions',currentAreaId)
			];
	},
	data: function () {
		return {

		};
	}
});
