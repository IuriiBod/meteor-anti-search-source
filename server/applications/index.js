let canUpdateApplications = (areaId) => {
  let permissionChecker = new HospoHero.security.PermissionChecker();
  return areaId && permissionChecker.hasPermissionInArea(areaId, 'edit interviews');
};

Meteor.methods({
  upsertsApplicationDefinition(changedSchema) {
    check(changedSchema, HospoHero.checkers.ApplicationSchemaDocument);

    let area = HospoHero.getCurrentArea(Meteor.user());

    if (canUpdateApplications(area._id)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    let applicationDefinition = ApplicationDefinitions.findOne({'relations.organizationsId': area.organizationId});

    if (applicationDefinition) {
      _.extend(applicationDefinition.schema, changedSchema);
      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$set: applicationDefinition});
    } else {
      _.extend(changedSchema, {name:true,email:true}); // this field is required
      let newApplicationDefinition = {
        schema: changedSchema,
        relations: HospoHero.getRelationsObject(),
        positionIds: []
      };
      return ApplicationDefinitions.insert(newApplicationDefinition);
    }
  },

  addNewPosition(name){
    check(name, String);

    let area = HospoHero.getCurrentArea(Meteor.user());
    if (canUpdateApplications(area._id)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    let applicationDefinition = ApplicationDefinitions.findOne({'relations.organizationsId': area.organizationId});

    if (applicationDefinition) {
      let positionId = Positions.insert({
        name: name,
        relations: HospoHero.getRelationsObject(applicationDefinition.relations.areaId)
      });
      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$addToSet: {positionIds: positionId}});
    } else {
      logger.error('Unexpected Err: method [addNewPosition] Has not created ApplicationDefinitions in this area',
        {areaId: applicationDefinition.relations.areaId});
      throw new Meteor.Error('You can\'t update application schema');
    }
  },

  removePosition(positionId){
    check(positionId, HospoHero.checkers.MongoId);

    let area = HospoHero.getCurrentArea(Meteor.user());
    if (canUpdateApplications(area._id)) {
      throw new Meteor.Error('You can\'t update application schema');
    }

    let applicationDefinition = ApplicationDefinitions.findOne({'relations.organizationsId': area.organizationId});

    if (applicationDefinition) {
      Positions.remove(positionId);
      return ApplicationDefinitions.update({_id: applicationDefinition._id}, {$pull: {positionIds: positionId}});
    } else {
      logger.error('Unexpected Err: method [removePosition] Has not created ApplicationDefinitions in this area',
        {areaId: applicationDefinition.relations.areaId});
      throw new Meteor.Error('You can\'t update application schema');
    }
  },

  addApplication(organizationId, details, positions, files, captchaUrl) {
    check(organizationId, HospoHero.checkers.MongoId);
    check(positions, [HospoHero.checkers.MongoId]);
    check(files, Match.Optional([Object]));
    check(details,getSchemaCheckerObject(organizationId));
    check(captchaUrl, Match.Optional(String));

    // Captcha verify
    let verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaUrl);
    if (!verifyCaptchaResponse.data.success) {
      logger.error('Captcha Err:' + verifyCaptchaResponse['error-codes']);
      throw new Meteor.Error('Captcha Err. Captcha not verified.');
    }
    let area = Areas.findOne({organizationId: organizationId});
    let application = {
      createdAt: new Date(),
      appProgress: ['New Application'],
      positionIds: positions,
      relations: HospoHero.getRelationsObject(area ? area._id : ''),
      details: details
    };

    let applicationId = Applications.insert(application);
    _.each(files, file => {
      let newfile = {
        referenceId: applicationId,
        createdAt: new Date(),
        name: file.filename,
        url: file.url
      };
      Files.insert(newfile);
    });
    return applicationId;
  },

  updateApplicationStatus (applicationId, status) {
    check(applicationId, HospoHero.checkers.MongoId);
    check(status, String);

    let application = Applications.findOne({_id: applicationId});

    if (!application || !canUpdateApplications(application.relations.areaId)) {
      throw new Meteor.Error('You can\'t update application');
    }

    return Applications.update({_id: applicationId}, {$addToSet: {appProgress: status}});
  },

  closeApplication (applicationId, status) {
    check(applicationId, HospoHero.checkers.MongoId);
    check(status, String);

    let application = Applications.findOne({_id: applicationId});

    if (application || !canUpdateApplications(application.relations.areaId)) {
      throw new Meteor.Error('You can\'t update application');
    }

    return Applications.update({_id: applicationId}, {$set: {status: status}});
  },

  sendRejectApplicationEmail (application) {
    let organization = Organizations.findOne({_id: application.relations.organizationId});
    let sender = Meteor.users.findOne(this.userId);
    
    var notificationSender = new NotificationSender(
      'Application rejected',
      'reject-application',
      {
        applicantName: application.details.name,
        organizationName: organization.name,
        invitationSender: {
          name: `${sender.profile.firstname} ${sender.profile.lastname}`,
          tel: sender.profile.tel,
          email: sender.emails[0].address
        }
      }
    );

    notificationSender.sendEmail(application.details.email);

    Meteor.call('closeApplication', application._id, 'rejected');
  }
});

function getSchemaCheckerObject(organizationId){
  let res = {};
  let appDef = ApplicationDefinitions.findOne({'relations.organizationId': organizationId});
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
    // if fields in Application Definition is true,
    // than this field should be in Application details,
    // and have defined type
    _.each(appDef.schema,(value, field) => {
      if (value) {
        res[field] = fieldTypes[field];
      }
    });
  } else {
    logger.error('Unexpected Err: method [addApplication] Has not created ApplicationDefinitions in this organization', {organizationId: organizationId});
    throw new Meteor.Error('Unexpected Err. Not correct area.');
  }
  return res;
}
