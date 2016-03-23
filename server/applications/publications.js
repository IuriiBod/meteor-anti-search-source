Meteor.publishComposite('applicationDefinitions', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);

  if (!this.userId) {
    this.ready();
  } else {
    return {
      find () {
        let area = Areas.findOne({_id: areaId});
        return ApplicationDefinitions.find({'relations.organizationId': area.organizationId});
      },
      children: [
        {
          find (applicationDefinitionItem) {
            if (applicationDefinitionItem) {
              return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
            } else {
              this.ready();
            }
          }
        }
      ]
    };
  }
});

Meteor.publishComposite('applicationDefinitionsByOrganization', function (organizationId) {
  check(organizationId, HospoHero.checkers.MongoId);

  if (!this.userId) {
    this.ready();
  } else {
    return {
      find () {
        return ApplicationDefinitions.find({'relations.organizationId': organizationId});
      },
      children: [
        {
          find (applicationDefinitionItem) {
            if (applicationDefinitionItem) {
              return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
            } else {
              this.ready();
            }
          }
        }
      ]
    };
  }
});

Meteor.publish('applications', function (areaId) {
  if (!this.userId) {
    this.ready();
  } else {
    check(areaId, HospoHero.checkers.MongoId);

    let area = Areas.findOne({_id: areaId});
    return Applications.find({'relations.organizationId': area.organizationId});
  }
});