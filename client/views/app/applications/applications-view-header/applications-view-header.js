Template.applicationsViewHeader.events({
	'click a[data-action="open-form-settings"]'() {
		FlyoutManager.open('wrapperFlyout', {
			template: 'applicationFormSettings',
			title: "Recruitment Form",
			data: {}
		});
	}
});