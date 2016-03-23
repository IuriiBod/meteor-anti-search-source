let canUpdateApplications = (application) => {
  let permissionChecker = new HospoHero.security.PermissionChecker();
  return application && permissionChecker.hasPermissionInArea(application.relations.areaId, 'edit interviews');
};

Meteor.methods({
  updateApplicationDefinition(applicationId, changedSchema) {
    check(applicationId, HospoHero.checkers.NullableMongoId);
    check(changedSchema, HospoHero.checkers.ApplicationSchemaDocument);

    let applicationDefinition = ApplicationDefinitions.findOne({_id: applicationId});

    if (applicationDefinition && !canUpdateApplications(applicationDefinition)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    if (applicationDefinition) {
      _.extend(applicationDefinition.schema, changedSchema);
      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$set: applicationDefinition});
    } else {
      let newApplicationDefinition = {
        schema: changedSchema,
        relations: HospoHero.getRelationsObject(),
        positionIds: []
      };
      return ApplicationDefinitions.insert(newApplicationDefinition);
    }
  },

  addNewPosition(applicationId, name){
    check(applicationId, HospoHero.checkers.MongoId);
    check(name, String);

    let applicationDefinition = ApplicationDefinitions.findOne({_id: applicationId});

    if (!canUpdateApplications(applicationDefinition)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    if (applicationDefinition) {
      let positionId = Positions.insert({
        name: name,
        relations: HospoHero.getRelationsObject(applicationDefinition.relations.areaId)
      });

      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$addToSet: {positionIds: positionId}});
    } else {
      logger.error('Unexpected Err: method [addNewPosition] Has not created ApplicationDefinitions in this area', {areaId: areaId});
      throw new Meteor.Error('Unexpected Err. Not correct area.');
    }
  },

  removePosition(applicationId, positionId){
    check(applicationId, HospoHero.checkers.MongoId);
    check(positionId, HospoHero.checkers.MongoId);

    let applicationDefinition = ApplicationDefinitions.findOne({_id: applicationId});

    if (!canUpdateApplications(applicationDefinition)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    if (applicationDefinition) {
      Positions.remove(positionId);
      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$pull: {positionIds: positionId}});
    } else {
      logger.error('Unexpected Err: method [removePosition] Has not created ApplicationDefinitions in this area', {areaId: areaId});
      throw new Meteor.Error('Unexpected Err. Not correct area.');
    }
  },

  addApplication(organizationId, details, positions, captchaUrl) {
    check(organizationId, HospoHero.checkers.MongoId);
    check(positions, [HospoHero.checkers.MongoId]);

    // Captcha verify
    let verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaUrl);
    if(!verifyCaptchaResponse.data.success){
      logger.error('Captcha Err:' + verifyCaptchaResponse['error-codes']);
      throw new Meteor.Error('Captcha Err. Captcha not verified.');
    }

    let area = Areas.findOne({organizationId: organizationId});
    let appDef = ApplicationDefinitions.findOne({'relations.organizationId': area.organizationId});

    if (appDef) {
      let fieldTypes = {
        name: String,
        email: String,
        phone: String,
        availability: [Number],
        dateOfBirth: Date,
        numberOfHours: Number,
        message: String
      };

      _.each(appDef.schema, (value, field) => {
        if (value) {
          check(details[field], fieldTypes[field]);
        }
      });

      let application = {
        createdAt: new Date(),
        appProgress: 'New Application',
        positionIds: positions,
        relations: HospoHero.getRelationsObject(area._id),
        details: details
      };

      return Applications.insert(application);
    } else {
      logger.error('Unexpected Err: method [addApplication] Has not created ApplicationDefinitions in this area', {areaId: area._id});
      throw new Meteor.Error('Unexpected Err. Not correct area.');
    }
  }
});
