Meteor.publishComposite('applicationDefinitions', function (areaId) {
	check(areaId, HospoHero.checkers.MongoId);

	//todo: any security (permissions) checks here?;

	//const permissionChecker = this.userId && new HospoHero.security.PermissionChecker(this.userId);
	//if (permissionChecker && permissionChecker.hasPermissionInArea(areaId, 'approve leave requests')) {
	let area = Areas.findOne({_id: areaId});

	return {
		find: function () {
			return ApplicationDefinitions.find({'relations.organizationId': area.organizationId});
		},
		children: [
			{
				find: function (applicationDefinitionItem) {
					if (applicationDefinitionItem) {
						return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
					} else {
						this.ready();
					}
				}
			}
		]
	};
	//} else {
	//	logger.error('Permission denied: publish [applicationDefinitions] ', {areaId: areaId, userId: this.userId});
	//	this.error(new Meteor.Error('Access denied. Not enough permissions.'));
	//}
});

Meteor.publishComposite('applicationDefinitionsByOrganization', function (organizationId) {
	check(organizationId, HospoHero.checkers.MongoId);

	return {
		find: function () {
			return ApplicationDefinitions.find({'relations.organizationId': organizationId});
		},
		children: [
			{
				find: function (applicationDefinitionItem) {
					if (applicationDefinitionItem) {
						return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
					} else {
						this.ready();
					}
				}
			}
		]
	};
});