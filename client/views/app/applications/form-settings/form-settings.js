Template.applicationFormSettings.onCreated(function () {

});

Template.applicationFormSettings.helpers({
	positions(){
		return Positions.find();
	},
	schema(){
		return ApplicationDefinitions.findOne() ? ApplicationDefinitions.findOne().schema : false;
	},
	isDefined(){
		return ApplicationDefinitions.findOne() !== undefined;
	},
	organizationId(){
		let area = HospoHero.getCurrentArea(Meteor.userId());
		return area ? area.organizationId : '';
	},
	rootUrl(){
		return document.location.origin;
	}
});

Template.applicationFormSettings.events({
	'submit form[data-action="add-position"]'(event) {
		event.preventDefault();
		let name = $(event.target).find('input').val();
		let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
		Meteor.call('addNewPosition', currentAreaId, name, (err)=> {
			if (err) {
				HospoHero.error(err);
			} else {
				$(event.target)[0].reset();
			}
		});
	},
	'change input[data-action="update"]'(event, tmpl) {
		var schema = getData(tmpl);
		let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
		Meteor.call('updateApplicationDefinition', currentAreaId, schema, (err)=> {
			if (err) {
				HospoHero.error(err);
			}
		});
	},
	'click [data-action="remove-position"]'(event){
		let positionId = $(event.target).attr('data-id');
		let currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
		Meteor.call('removePosition', currentAreaId, positionId, (err)=> {
			if (err) {
				HospoHero.error(err);
			}
		});
	},
	'click [data-action="copy-to-clipboard"]'(event,tmpl){
		event.preventDefault();
		var $input = tmpl.$('input[data-target="link"]');
		$input.select();
		try {
			var successful = document.execCommand('copy');
			if(!successful){
				HospoHero.error('Browser permissions: unable to copy');
			}
		} catch (err) {
			HospoHero.error(err);
		}
	}
});

function getData(tmpl) {
	return {
		name: tmpl.$('input[data-name="name"]')[0].checked,
		email: tmpl.$('input[data-name="email"]')[0].checked,
		phone: tmpl.$('input[data-name="phone"]')[0].checked,
		dateOfBirth: tmpl.$('input[data-name="date-of-birth"]')[0].checked,
		numberOfHours: tmpl.$('input[data-name="number-of-hours"]')[0].checked,
		availability: tmpl.$('input[data-name="availability"]')[0].checked,
		message: tmpl.$('input[data-name="message"]')[0].checked,
		files: tmpl.$('input[data-name="files"]')[0].checked
	};
}
