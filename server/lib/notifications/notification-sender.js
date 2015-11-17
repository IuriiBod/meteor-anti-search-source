/**
 * Universal notification sender
 *
 * Supports emails and build-in notifications
 * If you need send notification you probably should use it
 *
 * Possible notification data entries formats: String, Number.
 *
 * Note: If your notification data contains dates you should
 * convert it to appropriate location's timezone and convert to string.
 *
 * @param {string} subject notification's subject/title
 * @param {string} templateName handlebars template name
 * @param {object} templateData data to render on template
 * @param {*|string} senderId user that sanded notification
 * @constructor
 */
NotificationSender = function (subject, templateName, templateData, senderId) {
  this._options = {
    subject: subject,
    senderId: senderId
  };

  //todo: render text here
  this._html = '';
};

NotificationSender.prototype._getEmailSubject = function () {
  return '[HospoHero] | ' + this._options.subject;
};

/**
 * Returns an email of interested user
 * @param userId
 * @returns {String | boolean}
 * @private
 */
NotificationSender.prototype._getUserEmail = function (userId) {
  var user = Meteor.users.findOne(userId);
  return user && user.emails && user.emails.length ? user.emails[0].address : false;
};
/**
 * Sends email to specified receiver
 *
 * @param receiverId
 */
NotificationSender.prototype.sendEmail = function (receiverId) {
  var emailOptions = {
    subject: this._getEmailSubject(),
    from: this._getUserEmail(this._options.senderId) || 'notifications@hospohero.com',
    to: this._getUserEmail(receiverId),
    html: this._html
  };

  Email.send(emailOptions);
};

/**
 * Sends build-in app notification
 *
 * @param receiverId
 */
NotificationSender.prototype.sendNotification = function (receiverId) {
  var notificationOptions = {
    to: receiverId,
    read: false,
    createdBy: this._options.senderId,
    title: this._options.subject,
    text: this._html,
    createdOn: Date.now()
  };

  Notifications.insert(notificationOptions);
};