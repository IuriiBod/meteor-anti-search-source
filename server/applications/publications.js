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


Meteor.publishComposite('application', function (applicationId) {
  if (!this.userId) {
    this.ready();
  } else {
    check(applicationId, HospoHero.checkers.MongoId);

    return {
      find () {
        return Applications.find({_id: applicationId});
      },

      children: [
        {
          find (application) {
            if (application) {
              return ApplicationDefinitions.find({'relations.organizationId': application.relations.organizationId});
            } else {
              this.ready();
            }
          }
        },
        {
          find (application) {
            if (application) {
              return Positions.find({_id: {$in: application.positionIds}});
            } else {
              this.ready();
            }
          }
        },
        {
          find (application) {
            if (application) {
              return Files.find({referenceId: application._id});
            } else {
              this.ready();
            }
          }
        },
        {
          find (application) {
            if (application) {
              return Comments.find({reference: application._id});
            } else {
              this.ready();
            }
          }
        },
        {
          find (application) {
            if (application) {
              return TaskList.find({'reference.id': application._id});
            } else {
              this.ready();
            }
          }
        },
        {
          find (application) {
            if (application) {
              return RelatedItems.find({referenceId: application._id});
            } else {
              this.ready();
            }
          }
        }
      ]
    };
  }
});