// TODO: Chnge to UniEmailSender
EmailSender = function EmailSender(emailOptions) {
  this.to = emailOptions.to;
  this.from = emailOptions.from;
  this.subject = emailOptions.subject;
  this.emailType = emailOptions.emailType;
  this.text = emailOptions.text;
  this.params = emailOptions.params;

  this.subjectPrefix = '[Hospo Hero]';
};

// Get email content methods
EmailSender.prototype.inviteUserContent = function() {
  var text = [];
  text.push("You've been added to the");
  text.push(this.params.areaName);
  text.push("area. You'll see this in your area list when you next log in.<br><br>");
  return text.join(' ');
};

// Privete methods
/**
 * Returns username or Firstname Lastname
 * @param {Object} user - Meteor.users object
 * @returns {string}
 * @private
 */
EmailSender._getUsername = function(user) {
  if (user.profile.firstname && user.profile.lastname) {
    return user.profile.firstname + " " + user.profile.lastname;
  } else {
    return user.username;
  }
};

/**
 * Returns user object by user ID
 * @param {string} userId - ID of user
 * @returns {Object}
 * @private
 */
EmailSender._getUserObject = function(userId) {
  return Meteor.users.findOne({ _id: userId });
};

/**
 * Returns user email address
 * @param {Object} user - Meteor.users object
 * @returns {string}
 * @private
 */
EmailSender._getEmailAddress = function(user) {
  return user.emails[0].address;
};

/**
 * Returns email subject
 * @param {string} prefix - Subject prefix
 * @param {string} subject - Subject text
 * @returns {string}
 * @private
 */
EmailSender._getSubject = function(prefix, subject) {
  return prefix + ' ' + subject;
};

/**
 * Returns email header
 * @param {Object} receiver - Meteor.users object
 * @returns {string}
 * @private
 */
EmailSender._getEmailHeader = function(receiver) {
  return 'Hi ' + EmailSender._getUsername(receiver) + ',<br><br>';
};

/**
 * Returns email footer
 * @param {Object} sender - Meteor.users object
 * @returns {string}
 * @private
 */
EmailSender._getEmailFooter = function(sender) {
  return '<br><br>If you have any questions let me know.<br>' + EmailSender._getUsername(sender);
};

/**
 * Returns email content by email type
 * @param {string} emailType - Type of email
 * @returns {string}
 * @private
 */
EmailSender.prototype._getEmailContent = function(emailType) {
  var contentFunctionByType = {
    'invite user': 'inviteUserContent'
  };

  if(emailType && contentFunctionByType[emailType]) {
    return this[contentFunctionByType[emailType]]();
  } else {
    return '';
  }
};

/**
 * Initialize EmailSender object
 * @private
 */
EmailSender.prototype._initialize = function() {
  this.receiver = EmailSender._getUserObject(this.to);
  this.sender = EmailSender._getUserObject(this.from);
  this.subject = EmailSender._getSubject(this.subjectPrefix, this.subject);

  this.html = EmailSender._getEmailHeader(this.receiver);
  this.html += this.text ? this.text : this._getEmailContent(this.emailType);
  this.html += EmailSender._getEmailFooter(this.sender);
};

/**
 * Sends an email
 */
EmailSender.prototype.send = function() {
  this._initialize();

  Email.send({
    to: EmailSender._getEmailAddress(this.receiver),
    from: EmailSender._getEmailAddress(this.sender),
    subject: this.subject,
    html: this.html
  });
};

/**
 * Adds the parameter name to object
 *
 * @param {string} name - The name of the parameter
 * @param {string} value - The value of parameter
 */
EmailSender.prototype.addOption = function(name, value) {
  this[name] = value;
};