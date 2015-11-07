/**
 * Object for saving parameters which passed into UniEmailSender
 * @type {{Object}}
 */
var UniEmailSenderOptions = {};

var EmailOptionsChecker = {
  /**
   * Checks email options for UniEmailSender
   * @param {Object} emailOptions - the same as for UniEmailSender
   * @param {Object} checkersForEmailOptions - checker settings for email options
   */
  checkTypesOfEmailOptions: function(emailOptions, checkersForEmailOptions) {
    check(emailOptions, checkersForEmailOptions);
    return true;
  },

  /**
   * Checks if users are existing in Meteor.users collection
   * @param {Array} userIds - array of user IDs to check
   * @returns {boolean} - if one of users does not exist - returns false; else - true
   */
  checkUsersExist: function(userIds) {
    return _.reduce(userIds, function(memo, userId) {
      return memo && EmailOptionsChecker.checkOneUserExists(userId);
    }, true);
  },

  /**
   * Checks of user existing
   * @param {String} userId - ID of interested user
   * @returns {boolean}
   */
  checkOneUserExists: function(userId) {
    return !!Meteor.users.findOne({ _id: userId });
  }
};


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

  var usersExisting = EmailOptionsChecker.checkUsersExist([emailOptions.senderId, emailOptions.receiverId]);

  if(!usersExisting) {
    logger.error("Sender or receiver of message doesn't exists");
    throw new Meteor.Error("Sender or receiver of message doesn't exists");
  }

  console.log('SUCCESS');

};

UniEmailSender.prototype.send = function() {

};

var emailOptions = {
  senderId: 'kfZMbk62tgFSxmDen',
  receiverId: 'MGBaDcpnxwhckt6qL',
  emailTemplate: {},
  templateData: {}
};

var testUniSender = new UniEmailSender(emailOptions);