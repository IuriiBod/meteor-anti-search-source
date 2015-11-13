/**
 * UniEmailSender. How to use?
 *
 * At first, you need to create object with email options. It can be looks like this one:
 *
 * var emailOptions = {
 *   senderId: 'kfZMbk62tgFSxmDen',
 *   receiverId: 'MGBaDcpnxwhckt6qL',
 *   emailTemplate: {
 *     subject: 'Welcome!',
 *     blazeTemplateToRenderName: 'helloUser'
 *   },
 *   templateData: {
 *     username: 'Vadym'
 *   },
 *   needToNotify: true,
 *   notificationData: {
 *     type: 'organization',
 *     actionType: 'create',
 *     relations: {
 *       organizationId: 'R6PN9uFby4jYr4aiA',
 *       locationId: 'ppuSjk3WzjYwbvZQ3',
 *       areaId: 'Jeoa5mjds2ybBnne8'
 *     }
 *   }
 * };
 *
 * Then, you need to create an instance of UniEmailSender class
 *
 * var uniEmailSender = new UniEmailSender(emailOptions);
 *
 * And after that, send an e-mail and notification by calling send() method
 *
 * uniEmailSender.send();
 *
 * If you set needToNotify key to false and don't pass notificationData object,
 * UniEmailSender will send only an e-mail, not notification
 */


// =====================================================================================================================

/**
 * Object with Blaze template names and filename with respective template
 * key - template name
 * value - the name of template file in private/email-templates directory
 * @type {{Object}}
 */
var blazeViewsAndFileNames = {
  'helloUser': 'hello-user.html',
  forecastUpdate: 'forecast-update.html'
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
  /**
   * Object for saving parameters which passed into UniEmailSender
   * @type {{Object}}
   */
  this.UniEmailSenderOptions = {};

  /**
   * Object to save parameters which inserts into Notifications collection
   * @type {{}}
   */
  this.UniNotificationSenderOptions = {};

  // TODO: Move to the HospoHero Object and pass it as parameter?
  var settingsForOptions = {
    senderId: String,
    receiverId: String,
    emailTemplate: Object,
    templateData: Object,
    needToNotify: Boolean,
    notificationData: Match.Optional(Object)
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
  this.UniEmailSenderOptions.from = this._getUserEmail(emailOptions.senderId);
  this.UniEmailSenderOptions.to = this._getUserEmail(emailOptions.receiverId);

  // save email subject
  this.UniEmailSenderOptions.subject = this._getEmailSubject(emailOptions.emailTemplate.subject);
  // save html of email
  this.UniEmailSenderOptions.html = this._getEmailHtmlFromTemplate(emailOptions.emailTemplate.blazeTemplateToRenderName,
    emailOptions.templateData);

  // Check if need to send a notification to user
  if (emailOptions.needToNotify) {
    this._getNotificationOptions(emailOptions);
  }
};

/**
 * Sends email with UniEmailSenderOptions parameters
 */
UniEmailSender.prototype.send = function () {
  Email.send(this.UniEmailSenderOptions);

  if (this.UniNotificationSenderOptions) {
    Notifications.insert(this.UniNotificationSenderOptions);
  }
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

  if (templatePath) {
    templatePath = 'email-templates/' + templatePath;
    SSR.compileTemplate(blazeTemplateName, Assets.getText(templatePath));
    return SSR.render(blazeTemplateName, emailTemplateData);
  } else {
    logger.error('Email template ' + blazeTemplateName + ' not found!');
    throw new Meteor.Error('Email template ' + blazeTemplateName + ' not found!');
  }
};

UniEmailSender.prototype._getNotificationOptions = function (options) {
  var notificationOptions = {
    to: options.receiverId,
    type: '',
    read: false,
    createtedBy: options.senderId,
    ref: '',
    title: options.emailTemplate.subject,
    actionType: 'update',
    text: this.UniEmailSenderOptions.html,
    createdOn: Date.now()
  };
  this.UniNotificationSenderOptions = _.extend(notificationOptions, options.notificationData);
};