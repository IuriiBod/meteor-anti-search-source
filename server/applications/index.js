Meteor.methods({
	updateApplicationDefinition(areaId, schema){
		check(areaId, HospoHero.checkers.MongoId);
		check(schema.email, Boolean);
		check(schema.name, Boolean);
		check(schema.phone, Boolean);
		check(schema.dateOfBirth, Boolean);
		check(schema.numberOfHours, Boolean);
		check(schema.availability, Boolean);
		check(schema.message, Boolean);
		check(schema.files, Boolean);

		//todo: any security (permissions) checks here?

		let area = Areas.findOne({_id: areaId});
		let appDef = ApplicationDefinitions.findOne({'relations.organizationId': area.organizationId});

		if (appDef) {
			return ApplicationDefinitions.update({_id: appDef._id}, {$set: {schema: schema}});
		} else {
			let newAppDef = {
				schema: schema,
				relations: {
					organizationId: area.organizationId,
					locationId: area.locationId,
					areaId: area._id
				},
				positionIds: []
			};
			return ApplicationDefinitions.insert(newAppDef);
		}
	},
	addNewPosition(areaId, name){
		check(areaId, HospoHero.checkers.MongoId);
		check(name, String);

		let area = Areas.findOne({_id: areaId});
		let appDef = ApplicationDefinitions.findOne({'relations.organizationId': area.organizationId});

		if (appDef) {
			let positionId = Positions.insert({name: name});
			appDef.positionIds.push(positionId);
			return ApplicationDefinitions.update({_id: appDef._id}, {$set: {positionIds: appDef.positionIds}});
		} else {
			logger.error('Unexpected Err: method [addNewPosition] Has not created ApplicationDefinitions in this area', {areaId: areaId});
			this.error(new Meteor.Error('Unexpected Err. Not correct area.'));
		}
	},
	removePosition(areaId, positionId){
		check(areaId, HospoHero.checkers.MongoId);
		check(positionId, HospoHero.checkers.MongoId);

		let area = Areas.findOne({_id: areaId});
		let appDef = ApplicationDefinitions.findOne({'relations.organizationId': area.organizationId});

		if (appDef) {
			Positions.remove(positionId);
			return ApplicationDefinitions.update({_id: appDef._id}, {$pull: {positionIds: positionId}});
		} else {
			logger.error('Unexpected Err: method [removePosition] Has not created ApplicationDefinitions in this area', {areaId: areaId});
			this.error(new Meteor.Error('Unexpected Err. Not correct area.'));
		}
	},
	addApplication(organizationId,details,positions){
		check(organizationId, HospoHero.checkers.MongoId);
		check(positions, [HospoHero.checkers.MongoId]);

		let area = Areas.findOne({organizationId: organizationId});
		let appDef = ApplicationDefinitions.findOne({'relations.organizationId': area.organizationId});

		if (appDef) {
			check(details, {
				name :appDef.schema.name ? String : undefined,
				email :appDef.schema.email ? String : undefined,
				phone :appDef.schema.phone ? String : undefined,
				availability :appDef.schema.availability ? [Number] : undefined,
				dateOfBirth :appDef.schema.dateOfBirth ? Date : undefined,
				numberOfHours :appDef.schema.numberOfHours ? Number : undefined,
				message :appDef.schema.message ? String : undefined
			});

			let application = {
				_createdAt : new Date(),
				appProgress:[],
				positionIds:positions,
				relations:{
					organizationId: area.organizationId,
					locationId: area.locationId,
					areaId: area._id
				},
				details:details
			};
			return Applications.insert(application);
		} else {
			logger.error('Unexpected Err: method [addApplication] Has not created ApplicationDefinitions in this area', {areaId: area._id});
			this.error(new Meteor.Error('Unexpected Err. Not correct area.'));
		}
	}
});
