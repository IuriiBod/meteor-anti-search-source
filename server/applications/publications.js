function hasPermission (organizationId,userId,permission) {
  let permissionChecker = new HospoHero.security.PermissionChecker(userId);
  if(!permissionChecker.hasPermissionInOrganization(organizationId, permission)){
    return false;
  }
  return true;
}

Meteor.publishComposite('applicationDefinitions', function () {
  let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);
  if(!hasPermission(organizationId,this.userId,'approve application definitions')){
    logger.error('Permission denied: publish [applicationDefinitions] ', {organizationId: organizationId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
  return {
    find () {
      return ApplicationDefinitions.find({organizationId: organizationId});
    },
    children: [
      {
        find (applicationDefinitionItem) {
          return Positions.find({ organizationId:applicationDefinitionItem.organizationId });
        }
      }
    ]
  };
});

Meteor.publishComposite('applicationDefinitionsByOrganization', function (organizationId) {
  check(organizationId, HospoHero.checkers.MongoId);

  // This Publication use in Recruitment Form. This Form available for unauthorized users,
  // so has no permission checkers.
  return {
    find () {
      return ApplicationDefinitions.find({organizationId: organizationId});
    },
    children: [
      {
        find (applicationDefinitionItem) {
          return Positions.find({ organizationId:applicationDefinitionItem.organizationId });
        }
      },
      {
        find (applicationDefinitionItem) {
          return Organizations.find({_id: applicationDefinitionItem.organizationId});
        }
      }
    ]
  };
});

Meteor.publish('applications', function () {
  let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);
  if(!hasPermission(organizationId,this.userId,'approve applications')){
    logger.error('Permission denied: publish [applications] ', {organizationId: organizationId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
  return Applications.find({'organizationId': organizationId});
});


Meteor.publishComposite('application', function (applicationId) {
  check(applicationId, HospoHero.checkers.MongoId);
  let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);
  if(!hasPermission(organizationId,this.userId,'approve applications')){
    logger.error('Permission denied: publish [application] ', {organizationId: organizationId, userId: this.userId});
    this.error(new Meteor.Error('Access denied. Not enough permissions.'));
  }
  return {
    find () {
      return Applications.find({_id: applicationId});
    },

    children: [
      {
        find (application) {
          return ApplicationDefinitions.find({organizationId: application.organizationId});
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