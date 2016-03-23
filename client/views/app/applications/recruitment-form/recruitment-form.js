Template.recruitmentForm.helpers({
	emailPattern () {
		return HospoHero.regExp.toHtmlString(HospoHero.regExp.email);
	},
	phonePattern () {
		return HospoHero.regExp.toHtmlString(HospoHero.regExp.phone);
	},
	numbersPattern () {
		return HospoHero.regExp.toHtmlString(HospoHero.regExp.numbers);
	},
	positions(){
		return Positions.find();
	},
	isHasPosition(){
		return this.applicationDefinition.positionIds.length > 0;
	},
	availabilities () {
		return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	}
});

Template.recruitmentForm.onRendered(function () {
	this.$('.recruitment-form .dateOfBirth').datepicker({});
});

Template.recruitmentForm.events({
	'submit form'(event,tmpl){
		event.preventDefault();
		let details = getDetailsData(tmpl);
		let positionIds = getPositionsData(tmpl);
		let captchaUrl = $('#g-recaptcha-response').val();
		Meteor.call('addApplication', tmpl.data.organizationId,details, positionIds, captchaUrl, (err)=> {
			err ?  HospoHero.error(err) : $(event.target)[0].reset();
		});
	}
});

function getDetailsData(tmpl){
	let res= {};
	_.each(tmpl.data.applicationDefinition.schema, (value,field) => {
		if(!value) return;
		let val = tmpl.$('.recruitment-form .' + field).val();
		switch (field) {
			case 'availability' :{
				let availabilities = [];
				_.each(tmpl.$('.recruitment-form .availability'), (input)=> {
					if (input.checked) {
						availabilities.push(parseInt($(input).attr('data-number')));
					}
				});
				res.availability = availabilities;
				break;
			}
			case 'numberOfHours' :{
				res[field] = parseInt(val);
				break;
			}
			case 'dateOfBirth' :{
				res[field] = new Date(val);
				break;
			}
			default :	{
				res[field] = val;
			}
		}
	});
	return res;
}

function getPositionsData(tmpl){
	let positions = [];
	_.each(tmpl.data.applicationDefinition.positionIds, (positionId)=>{
		if(tmpl.$('.recruitment-form .positions[data-id="'+ positionId +'"]')[0].checked){
			positions.push(positionId);
		}
	});
	return positions;
}