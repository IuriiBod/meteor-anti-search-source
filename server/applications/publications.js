Meteor.publishComposite('applicationDefinitions', function (areaId) {
  return HospoHero.publication.isUser(this, () => {
    check(areaId, HospoHero.checkers.MongoId);
    return {
      find () {
        let area = Areas.findOne({_id: areaId});
        return ApplicationDefinitions.find({'relations.organizationId': area.organizationId});
      },
      children: [
        {
          find (applicationDefinitionItem) {
            return HospoHero.publication.isChild(this, applicationDefinitionItem,
              Positions.find({_id: {$in: applicationDefinitionItem.positionIds}}));
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
          return  HospoHero.publication.isChild(this, applicationDefinitionItem,
            Positions.find({_id: {$in: applicationDefinitionItem.positionIds}}));
        }
      },
      {
        find (applicationDefinitionItem) {
          return HospoHero.publication.isChild(this, applicationDefinitionItem,
            Organizations.find({_id: applicationDefinitionItem.relations.organizationId}));
        }
      }
    ]
  };
});

Meteor.publish('applications', function (areaId) {
  return HospoHero.publication.isUser(this, () => {
    check(areaId, HospoHero.checkers.MongoId);
    let area = Areas.findOne({_id: areaId});
    return Applications.find({'relations.organizationId': area.organizationId});
  });
});


Meteor.publishComposite('application', function (applicationId) {
  return HospoHero.publication.isUser(this, () => {
    check(applicationId, HospoHero.checkers.MongoId);

    return {
      find () {
        return Applications.find({_id: applicationId});
      },

      children: [
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
              ApplicationDefinitions.find({'relations.organizationId': application.relations.organizationId}));
          }
        },
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
              Positions.find({_id: {$in: application.positionIds}}));
          }
        },
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
              Files.find({referenceId: application._id}));
          }
        },
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
             Comments.find({reference: application._id}));
          }
        },
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
              TaskList.find({'reference.id': application._id}));
          }
        },
        {
          find (application) {
            return HospoHero.publication.isChild(this, application,
               RelatedItems.find({referenceId: application._id}));
          }
        }
      ]
    };
  })
});