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
		return [
			{
				name:'Monday',
				day:1
			},
			{
				name:'Tuesday',
				day:2
			},
			{
				name:'Wednesday',
				day:3
			},
			{
				name:'Thursday',
				day:4
			},
			{
				name:'Friday',
				day:5
			},
			{
				name:'Saturday',
				day:6
			},
			{
				name:'Sunday',
				day:7
			}
		]
	}

});

Template.recruitmentForm.onRendered(function () {
	this.$('input[data-name="date-of-birth"]').datepicker({});
});

Template.recruitmentForm.events({
	'submit form'(event,tmpl){
		event.preventDefault();
		let deails = getDetailsData(tmpl);
		let positionIds = getPositionsData(tmpl);
		console.log('deails id ->',deails);
		console.log('position id ->',positionIds);
		Meteor.call('addApplication', tmpl.data.organizationId,deails, positionIds, (err)=> {
			if (err) {
				HospoHero.error(err);
			} else {
				$(event.target)[0].reset();
			}
		});
	}
})

function getDetailsData(tmpl){
	let res= {};
	let appDef = tmpl.data.applicationDefinition;
	if(appDef.schema.name){
		res.name = tmpl.$('input[data-name="name"]').val();
	}
	if(appDef.schema.email){
		res.email = tmpl.$('input[data-name="email"]').val();
	}
	if(appDef.schema.phone){
		res.phone = tmpl.$('input[data-name="phone"]').val();
	}
	if(appDef.schema.dateOfBirth){
		res.dateOfBirth = new Date(tmpl.$('input[data-name="date-of-birth"]').val());
	}
	if(appDef.schema.numberOfHours){
		res.namnumberOfHourse = parseInt(tmpl.$('input[data-name="number-of-hours"]').val());
	}
	if(appDef.schema.message){
		res.message = tmpl.$('textArea[data-name="message"]').val();
	}
	if(appDef.schema.availability){
		let availabilities = [];
			_.each(tmpl.$('input[data-name="availability"]'),(input)=>{
				if(input.checked){
					availabilities.push(parseInt($(input).attr('data-number')));
				}
			});
		res.availability = availabilities;
	}
	return res;
}

function getPositionsData(tmpl){
	let appDef =  tmpl.data.applicationDefinition;
	let positions = [];
	_.each(appDef.positionIds, (positionId)=>{
		if(tmpl.$('[data-name="positions"][data-id="'+ positionId +'"]')[0].checked){
			positions.push(positionId);
		}
	});
	return positions;
}