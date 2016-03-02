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
 * Use `{{_notificationId}}` - in templates and `this._notificationId` - in helpers
 *
 * Template data helpers
 * You can also define you own helpers
 * Note: notification helpers act as simple handlebars helpers.
 * `_notificationId` will be also included in root context.
 *
 * Usage examples:
 * ```
 *  new NotificationSender('Test1', 'test', {username: 'User'})
 *  .sendEmail('kfZMbk62tgFSxmDen');
 *
 * new NotificationSender('Test3', 'test', {
 *     username: 'User',
 *     persons: [
 *         {name: 'John'},
 *         {name: 'James'},
 *         {name: 'Jim'}
 *     ],
 *     menuItemId: '4NCAWrYMj75cYKQ9L'
 * }, {
 *     interactive: true,
 *     helpers: {
 *         greeting: function () {
 *             return 'Hello, ' + this.name;
 *         },
 *         menuItemUrl: function () {
 *             return Router.url('menuItemDetail', {_id: this.menuItemId});
 *         }
 *     },
 *     meta: {aaa: 333}
 * }).sendBoth('kfZMbk62tgFSxmDen');
 *
 * ```
 *
 * @param {string} subject notification's subject/title
 * @param {string} templateName handlebars template name
 * @param {object} [templateData] data to render on template
 * @param {object} [options] additional configuration
 * @param {string} [options.senderId] user that sanded notification
 * @param {object} [options.metadata] additional notification data
 * @param {boolean} [options.interactive] deny automatic reading (usually if notification requires an action)
 * @param {object} [options.helpers] define you own formatting helpers
 * @param {boolean} [options.shareable] if one of recipients marks notification as read it will be removed
 * in others too
 * @constructor
 */
NotificationSender = function (subject, templateName, templateData = {}, options = {}) {
  this._options = _.extend(options, {
    subject: subject,
    templateName: templateName,
    templateData: templateData
  });

  //register current notification helpers
  if (options && _.isObject(options.helpers)) {
    _.each(options.helpers, function (helperFn, helperName) {
      OriginalHandlebars.registerHelper(helperName, helperFn);
    });
  }

  if (options.shareable) {
    this._options.shareId = Random.id();
  }
};

/**
 * @returns true is notification requires some action
 * @private
 */
NotificationSender.prototype._isInteractive = function () {
  return this._options.interactive;
};

/**
 * Rebder template html
 * @param {String}
 * @param {String} 'mobile' - mobile template | 'email' - template that sending to email | undefined - default template
 * @returns {String}
 * @private
 */
NotificationSender.prototype._renderTemplateWithData = function (notificationId, type) {
  var templateData = this._options.templateData;
  var templateName  = '';
  templateData._isEmail = false;

  if (this._isInteractive()) {
    templateData._notificationId = notificationId
  }

  switch (type){
    case 'mobile' : {
      templateName = this._options.templateName + '-mobile';
      break;
    }
    case 'email' : {
      templateData._isEmail = true;

      // If exist email template use him, else use default template
      templateName = Handlebars.templates[this._options.templateName + '-email']  ?
         this._options.templateName + '-email' :  this._options.templateName;
      break;
    }
    case undefined : {
      templateName = this._options.templateName;
      break;
    }
  }
  return Handlebars.templates[templateName](templateData);
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
  if (userId && userId.indexOf('@') > -1) {
    return userId;
  }

  var user = Meteor.users.findOne(userId);
  return user && user.emails && user.emails.length ? user.emails[0].address : false;
};

/**
 * Sends push notification using raix:push package
 * @param notificationId
 * @param notificationOptions
 * @private
 */
NotificationSender.prototype._sendPushNotification = function (notificationId, notificationOptions) {
  let senderId = notificationOptions.createdBy;

  let pushNotificationOptions = {
    from: senderId && HospoHero.username(senderId) || 'HospoHero',
    title: notificationOptions.title,
    text: this._renderTemplateWithData(notificationId, 'mobile'),
    badge: 12,
    query: {
      userId: notificationOptions.to
    }
  };

  Push.send(pushNotificationOptions);
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

  if (this._options.shareId) {
    notificationOptions.shareId = this._options.shareId;
  }

  var notificationId = Notifications.insert(notificationOptions);

  var html = this._renderTemplateWithData(notificationId);

  Notifications.update({_id: notificationId}, {
    $set: {text: html}
  });

  this._sendPushNotification(notificationId, notificationOptions);

  return notificationId;
};


NotificationSender.prototype._sendEmailBasic = function (receiver, text) {
  var emailOptions = {
    subject: this._getEmailSubject(),
    from: this._getUserEmail(this._options.senderId) || 'notifications@hospohero.com',
    to: this._getUserEmail(receiver),
    html: text
  };

  Email.send(emailOptions);
};


/**
 * Sends email to specified receiver
 *
 * @param receiver - user ID or email
 */
NotificationSender.prototype.sendEmail = function (receiver) {
  let notificationId = null;

  if (this._isInteractive()) {
    notificationId = this._insertNotification(receiver, true);
  }

  let html = this._renderTemplateWithData(notificationId, 'email');
  this._sendEmailBasic(receiver, html);
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
  var notificationId = this._insertNotification(receiverId, false);
  let html = this._renderTemplateWithData(notificationId, 'email');
  this._sendEmailBasic(receiverId, html);
};


/**
 * Returns URL to action 'parking' page for specified action
 * and notification ID
 *
 * @param {string} methodName
 * @param {string} action
 * @param {object} templateRootContext contains `_notificationId` and `_isEmail`
 */
NotificationSender.actionUrlFor = function (methodName, action, templateRootContext) {
  var queryMap = {
    method: methodName,
    id: templateRootContext._notificationId,
    action: action
  };
  var query = _.map(queryMap, function (value, property) {
    return property + '=' + value;
  }).join('&');

  return NotificationSender.urlFor('notificationAction', {}, templateRootContext, {query: query});
};

/**
 * Returns URL for specified route and it's params
 * This method is preferable for using while rendering notifications
 *
 * @param {string} routeName
 * @param {object} routeParams
 * @param {object} templateRootContext contains `_notificationId` and `_isEmail`
 * @param {object} [routeOptions]
 */
NotificationSender.urlFor = function (routeName, routeParams, templateRootContext, routeOptions = {}) {
  return Router[templateRootContext._isEmail ? 'url' : 'path'](routeName, routeParams, routeOptions);
};

