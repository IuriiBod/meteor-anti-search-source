let canUpdateApplications = (organizationId) => {
  let permissionChecker = new HospoHero.security.PermissionChecker();
  return organizationId && permissionChecker.hasPermissionInOrganization(organizationId,'approve application definitions');
};

Meteor.methods({
  upsertsApplicationDefinition(applicationDefinitionDocument) {
    check(applicationDefinitionDocument, HospoHero.checkers.ApplicationDefinitionDocument);

    let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);

    if (!canUpdateApplications(organizationId)) {
      logger.error('Unexpected Err: Method [upsertsApplicationDefinition] User can\'t update Application Definition.',
        {organizationId: organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t update Application Definition');
    }

    delete applicationDefinitionDocument._id; //avoid exception about _id update.

    ApplicationDefinitions.update({organizationId:applicationDefinitionDocument.organizationId},
      {$set: applicationDefinitionDocument}, {upsert: true});
    logger.info('Upsert object into [ApplicationsDefinitions] collection',
      {organizationId: applicationDefinitionDocument.organizationId});
  },

  deleteApplicationDefinition(organizationId,applicationDefinitionId) {
    if (!canUpdateApplications(organizationId)) {
      logger.error('Unexpected Err: Method [deleteApplicationDefinition] User can\'t update Application Definition.',
        {organizationId: organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t delete Application Definition');
    }
    ApplicationDefinitions.remove({ _id: applicationDefinitionId });
    logger.info('Removed object from [ApplicationDefinitions] collection', {_id: applicationDefinitionId});
  },

  addNewPosition(name){
    check(name, String);

    let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);

    if (!canUpdateApplications(organizationId)) {
      logger.error('Unexpected Err: Method [addNewPosition] User can\'t update Application Definition.',
        {organizationId: organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t add new positions');
    }

    let positionId  =  Positions.insert({
      name: name,
      organizationId:organizationId
    });
    logger.info('Add new object into [Positions] collection', {_id: positionId});

    return positionId;
  },

  deletePosition(positionId){
    check(positionId, HospoHero.checkers.MongoId);

    let organizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(this.userId);

    if (!canUpdateApplications(organizationId)) {
      logger.error('Unexpected Err: Method [deletePosition] User can\'t update Application Definition.',
        {organizationId: organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t remove positions');
    }

    Positions.remove(positionId);
    logger.info('Removed object from [Positions] collection', {_id: positionId});
  }
});