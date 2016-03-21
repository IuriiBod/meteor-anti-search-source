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


Router.route('recruitmentForm', {
	path: '/recruitment-form/:_organizationId',
	template: 'recruitmentForm',
	waitOn: function () {
		return [
			Meteor.subscribe('applicationDefinitionsByOrganization',this.params._organizationId)
		];
	},
	data: function () {
		return {
			applicationDefinition:ApplicationDefinitions.findOne(),
			organizationId:this.params._organizationId
		};
	}
});