/**
 * Universal notification sender
 *
 * Supports emails and build-in notifications
 * If you need send notification you probably should use it
 *
 * Possible notification data entries formats: String, Number.
 *
 * Note: If your notification data contains dates you should
 * format it in appropriate location's timezone.
 *
 * Also you can use `_notificationId` in your template to
 * link notification's metadata with notification itself.
 * This feature may be used in server side routes for
 * processing any notification's actions.
 *
 * Usage examples:
 * ```
 *  new NotificationSender('Test1', 'test', {username: 'User'})
 *  .sendEmail('kfZMbk62tgFSxmDen');
 *
 *  new NotificationSender('Test2', 'test', {username: 'User'})
 *  .sendBoth('kfZMbk62tgFSxmDen');
 *
 *  new NotificationSender('Test3', 'test', {username: 'User'}, {
 *   interactive: true,
 *   meta: {aaa: 333}
 * }).sendBoth('kfZMbk62tgFSxmDen');
 * ```
 *
 * @param {string} subject notification's subject/title
 * @param {string} templateName handlebars template name
 * @param {*|object} templateData data to render on template
 * @param {*|object} options additional configuration
 * @param {*|string} options.senderId user that sanded notification
 * @param {*|object} options.metadata additional notification data
 * @param {*|boolean} options.interactive deny automatic reading (usually if notification requires an action)
 * @constructor
 */
NotificationSender = function (subject, templateName, templateData, options) {
  this._options = _.extend(options || {}, {
    subject: subject,
    templateName: templateName,
    templateData: templateData || {}
  });
};

/**
 * @returns true is notification requires some action
 * @private
 */
NotificationSender.prototype._isInteractive = function () {
  return this._options.interactive;
};


NotificationSender.prototype._renderTemplateWithData = function (notificationId) {
  var templateData = this._options.templateData;

  if (this._isInteractive()) {
    templateData._notificationId = notificationId
  }

  return Handlebars.templates[this._options.templateName](templateData);
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


NotificationSender.prototype._insertNotification = function (receiverId, markAsRead) {
  var notificationOptions = {
    to: receiverId,
    read: !!markAsRead,
    createdBy: this._options.senderId,
    title: this._options.subject,
    interactive: this._options.interactive,
    meta: this._options.meta,
    createdOn: Date.now()
  };

  var html = false;

  if (this._isInteractive()) {
    var notificationId = Notifications.insert(notificationOptions);

    html = this._renderTemplateWithData(notificationId);

    Notifications.update({_id: notificationId}, {
      $set: {text: html}
    });
  } else {
    html = this._renderTemplateWithData();
    notificationOptions.text = html;
    Notifications.insert(notificationOptions);
  }

  console.log('insert notification', notificationOptions);

  return html;
};


NotificationSender.prototype._sendEmailBasic = function (receiverId, text) {
  var emailOptions = {
    subject: this._getEmailSubject(),
    from: this._getUserEmail(this._options.senderId) || 'notifications@hospohero.com',
    to: this._getUserEmail(receiverId),
    html: text
  };

  Email.send(emailOptions);
};


/**
 * Sends email to specified receiver
 *
 * @param receiverId
 */
NotificationSender.prototype.sendEmail = function (receiverId) {
  var html;

  if (this._isInteractive()) {
    html = this._insertNotification(receiverId, true);
  } else {
    html = this._renderTemplateWithData();
  }

  this._sendEmailBasic(receiverId, html);
};

/**
 * Sends build-in app notification
 *
 * @param receiverId
 */
NotificationSender.prototype.sendNotification = function (receiverId) {
  this._insertNotification(receiverId, false);
};


NotificationSender.prototype.sendBoth = function (receiverId) {
  var html = this._insertNotification(receiverId, false);
  this._sendEmailBasic(receiverId, html);
};