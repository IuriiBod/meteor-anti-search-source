/**
 * Object for saving parameters which passed into UniEmailSender
 * @type {{Object}}
 */
var UniEmailSenderOptions = {};

// =====================================================================================================================

/**
 * Object with Blaze template names and filename with respective template
 * key - template name
 * value - the name of template file in private/email-templates directory
 * @type {{Object}}
 */
var blazeViewsAndFileNames = {
  'helloUser': 'hello-user.html'
};

// =====================================================================================================================

/**
 * Object which provides methods for checking email options
 * @type {{Object}}
 */
var EmailOptionsChecker = {
  /**
   * Checks email options for UniEmailSender
   * @param {Object} emailOptions - the same as for UniEmailSender
   * @param {Object} checkersForEmailOptions - checker settings for email options
   */
  checkTypesOfEmailOptions: function (emailOptions, checkersForEmailOptions) {
    check(emailOptions, checkersForEmailOptions);
    return true;
  },

  /**
   * Checks if users are existing in Meteor.users collection
   * @param {Array} userIds - array of user IDs to check
   * @returns {boolean} - if one of users does not exist - returns false; else - true
   */
  checkUsersExist: function (userIds) {
    return _.reduce(userIds, function (memo, userId) {
      return memo && EmailOptionsChecker.checkOneUserExists(userId);
    }, true);
  },

  /**
   * Checks of user existing
   * @param {String} userId - ID of interested user
   * @returns {boolean}
   */
  checkOneUserExists: function (userId) {
    return !!Meteor.users.findOne({_id: userId});
  }
};

// =====================================================================================================================

/**
 * Class for sending emails and notifications to users
 *
 * @param {Object} emailOptions
 * @param {string} emailOptions.senderId - ID of sender
 * @param {string} emailOptions.receiverId - ID of receiver
 * @param {Object} emailOptions.emailTemplate - an object with email template parameters
 * @param {string} emailOptions.emailTemplate.subject - email subject
 * @param {string} emailOptions.emailTemplate.blazeTemplateToRenderName - email template
 * @param {Object} emailOptions.templateData - data to pass into an email template
 * @constructor
 */
UniEmailSender = function UniEmailSender(emailOptions) {
  var settingsForOptions = {
    senderId: String,
    receiverId: String,
    emailTemplate: Object,
    templateData: Object
  };
  // check of input options
  EmailOptionsChecker.checkTypesOfEmailOptions(emailOptions, settingsForOptions);

  // check existing of sender and receiver
  var usersExisting = EmailOptionsChecker.checkUsersExist([emailOptions.senderId, emailOptions.receiverId]);
  if (!usersExisting) {
    logger.error("Sender or receiver of message doesn't exists");
    throw new Meteor.Error("Sender or receiver of message doesn't exists");
  }

  // save sender and receiver emails
  UniEmailSenderOptions.from = this._getUserEmail(emailOptions.senderId);
  UniEmailSenderOptions.to = this._getUserEmail(emailOptions.receiverId);

  // save email subject
  UniEmailSenderOptions.subject = this._getEmailSubject(emailOptions.emailTemplate.subject);
  // save html of email
  UniEmailSenderOptions.html = this._getEmailHtmlFromTemplate(emailOptions.emailTemplate.blazeTemplateToRenderName,
                                                              emailOptions.templateData);
};

/**
 * Sends email with UniEmailSenderOptions parameters
 */
UniEmailSender.prototype.send = function () {
  Email.send(UniEmailSenderOptions);
};

// ---------------------------------------------------------------------------------------------------------------------
// UniEmailSender private methods
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Returns an email of interested user
 * @param userId
 * @returns {String | boolean}
 * @private
 */
UniEmailSender.prototype._getUserEmail = function (userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.emails && user.emails.length ? user.emails[0].address : false;
};

/**
 * Return a subject of email
 * @param {String} emailSubject - Subject of current email
 * @returns {string}
 * @private
 */
UniEmailSender.prototype._getEmailSubject = function (emailSubject) {
  return '[HospoHero] | ' + emailSubject;
};

/**
 * Return HTML text of email from template
 * @param {String} blazeTemplateName - Name of template to render
 * @param {Object} emailTemplateData - Data to insert into template
 * @private
 */
UniEmailSender.prototype._getEmailHtmlFromTemplate = function (blazeTemplateName, emailTemplateData) {
  var templatePath = blazeViewsAndFileNames[blazeTemplateName];

  if(templatePath) {
    templatePath = 'email-templates/' + templatePath;
    SSR.compileTemplate(blazeTemplateName, Assets.getText(templatePath));
    return SSR.render(blazeTemplateName, emailTemplateData);
  } else {
    logger.error('Email template ' + blazeTemplateName + ' not found!');
    throw new Meteor.Error('Email template ' + blazeTemplateName + ' not found!');
  }
};