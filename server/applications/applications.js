let canUpdateApplications = (organizationId) => {
  let permissionChecker = new HospoHero.security.PermissionChecker();
  return organizationId && permissionChecker.hasPermissionInOrganization(organizationId, 'approve applications');
};

Meteor.methods({
  addApplication(organizationId, details, positions, files, captchaUrl) {
    check(organizationId, HospoHero.checkers.MongoId);
    check(positions, [HospoHero.checkers.MongoId]);
    check(files,[HospoHero.checkers.FilePickerFile]);
    check(details, getDetatilsCheckerObject(organizationId));
    check(captchaUrl, Match.Optional(String));

    // Captcha verify
    let verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, captchaUrl);
    if (!verifyCaptchaResponse.data.success) {
      logger.error('Captcha Err:' + verifyCaptchaResponse.data['error-codes']);
      throw new Meteor.Error("Captcha isn't verified.");
    }

    let application = {
      createdAt: new Date(),
      appProgress: ['New Application'],
      positionIds: positions,
      organizationId:organizationId,
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
      let fileId = Files.insert(newfile);
      logger.info('Add new object into [Files] collection', {_id: fileId});
    });
    logger.info('Add new object into [Applications] collection', {_id: applicationId});
    return applicationId;

  },

  updateApplicationStatus (applicationId, status) {
    check(applicationId, HospoHero.checkers.MongoId);
    check(status, Match.OneOf(
      'Active',
      'All',
      'New Application',
      'Phone Interview',
      '1st Interview',
      '2nd Interview',
      'Hired!',
      'On Wait List',
      'Rejected'
    ));

    let application = Applications.findOne({_id: applicationId});

    if (!application || !canUpdateApplications(application.organizationId)) {
      logger.error('Unexpected Err: Method [updateApplicationStatus] User can\'t update application.',
        {organizationId: application.organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t update application');
    }
    Applications.update({_id: applicationId}, {$addToSet: {appProgress: status}});
    logger.info('Updated object into [Applications] collection', {_id: applicationId});
  },

  closeApplication (applicationId, status) {
    check(applicationId, HospoHero.checkers.MongoId);
    check(status, Match.OneOf('hired', 'rejected'));

    let application = Applications.findOne({_id: applicationId});

    if (!application || !canUpdateApplications(application.organizationId)) {
      logger.error('Unexpected Err: Method [closeApplication] User can\'t close application.',
        {organizationId: application.organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t close application');
    }

    Applications.update({_id: applicationId}, {$set: {status: status}});
    logger.info('Updated object into [Applications] collection', {_id: applicationId});

    let appProgress = status === 'hired' ? 'Hired!' : 'Rejected';
    Meteor.call('updateApplicationStatus', applicationId, appProgress);
  },

  sendRejectApplicationEmail (application) {
    check(application, HospoHero.checkers.ApplicationDocument);

    if (!application || !canUpdateApplications(application.organizationId)) {
      logger.error('Unexpected Err: Method [sendRejectApplicationEmail] User can\'t send a reject email.',
        {organizationId: application.organizationId, userId: this.userId});
      throw new Meteor.Error('You can\'t send a reject email');
    }

    Meteor.call('closeApplication', application._id, 'rejected');

    let organization = Organizations.findOne({_id: application.organizationId});
    let sender = Meteor.users.findOne({_id: this.userId});

    var notificationSender = new NotificationSender(
      'Application rejected',
      'reject-application',
      {
        applicantName: application.details.name,
        organizationName: organization.name,
        invitationSender: {
          name: sender.profile.fullName,
          phone: sender.profile.phone,
          email: sender.emails[0].address
        }
      }
    );

    notificationSender.sendEmail(application.details.email);
    logger.info('Sended notification to email', {email: application.details.email});
  }
});

function getDetatilsCheckerObject(organizationId) {
  let res = {};
  let appDef = ApplicationDefinitions.findOne({organizationId: organizationId});
  if (appDef) {

    // If fields in Application Definition is true,
    // than this field should be in Application details,
    // and have defined type
    _.each(appDef.schema, (value, field) => {
      if (value) {
        res[field] = HospoHero.checkers.ApplicationDocumentDetails[field];
      }
    });
  } else {
    logger.error('Unexpected Err: method [addApplication] Has not created ApplicationDefinitions in this organization',
      {organizationId: organizationId});
    throw new Meteor.Error('Unexpected Err. Not correct organization.');
  }
  return res;
}