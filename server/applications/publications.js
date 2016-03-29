Meteor.publishComposite('applicationDefinitions', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);
  return HospoHero.publication.isUser(this, () => {
    return {
      find () {
        let area = Areas.findOne({_id: areaId});
        return ApplicationDefinitions.find({'relations.organizationId': area.organizationId});
      },
      children: [
        {
          find (applicationDefinitionItem) {
             return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
          }
        }
      ]
    };
  });
});

Meteor.publishComposite('applicationDefinitionsByOrganization', function (organizationId) {
  check(organizationId, HospoHero.checkers.MongoId);
  return {
    find () {
      return ApplicationDefinitions.find({'relations.organizationId': organizationId});
    },
    children: [
      {
        find (applicationDefinitionItem) {
          return Positions.find({_id: {$in: applicationDefinitionItem.positionIds}});
        }
      },
      {
        find (applicationDefinitionItem) {
          return Organizations.find({_id: applicationDefinitionItem.relations.organizationId});
        }
      }
    ]
  };
});

Meteor.publish('applications', function (areaId) {
  check(areaId, HospoHero.checkers.MongoId);
  return HospoHero.publication.isUser(this, () => {
    let area = Areas.findOne({_id: areaId});
    return Applications.find({'relations.organizationId': area.organizationId});
  });
});


Meteor.publishComposite('application', function (applicationId) {
  check(applicationId, HospoHero.checkers.MongoId);
  return HospoHero.publication.isUser(this, () => {
    return {
      find () {
        return Applications.find({_id: applicationId});
      },

      children: [
        {
          find (application) {
            return ApplicationDefinitions.find({'relations.organizationId': application.relations.organizationId});
          }
        },
        {
          find (application) {
            return Positions.find({_id: {$in: application.positionIds}});
          }
        },
        {
          find (application) {
            return Files.find({referenceId: application._id});
          }
        },
        {
          find (application) {
            return Comments.find({reference: application._id});
          }
        },
        {
          find (application) {
            return TaskList.find({'reference.id': application._id});
          }
        },
        {
          find (application) {
            return RelatedItems.find({referenceId: application._id});
          }
        }
      ]
    };
  });
});