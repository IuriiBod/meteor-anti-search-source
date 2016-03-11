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
 */
NotificationSender = class NotificationSender {
  /**
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
  constructor(subject, templateName, templateData, options) {
    this._options = _.extend(options, {
      subject,
      templateName,
      templateData
    });

    //register current notification helpers
    if (options && _.isObject(options.helpers)) {
      _.each(options.helpers, (helperFn, helperName) => {
        OriginalHandlebars.registerHelper(helperName, helperFn);
      });
    }

    if (options.shareable) {
      this._options.shareId = Random.id();
    }
  }

  /**
   * @returns true is notification requires some action
   * @private
   */
  _isInteractive() {
    return this._options.interactive;
  }

  /**
   * Render Handlebars template
   * @param {String} notificationId
   * @param {'mobile'|'email'} [type=false]
   * @returns {String}
   * @private
   */
  _renderTemplateWithData(notificationId, type) {
    let templateData = _.extend(this._options.templateData, {
      _isEmail: type === 'email',
      _notificationId: notificationId
    });

    let basicTemplateName = this._options.templateName;

    let templateName = type && Handlebars.templates[`${basicTemplateName}-${type}`] &&
      `${basicTemplateName}-${type}` || basicTemplateName;

    return Handlebars.templates[templateName](templateData);
  }

  _getEmailSubject() {
    return `[HospoHero] | ${this._options.subject}`;
  }

  /**
   * Returns an email of interested user
   * @param userId
   * @returns {String | boolean}
   * @private
   */
  _getUserEmail(userId) {
    if (userId && userId.indexOf('@') > -1) {
      return userId;
    }

    let user = Meteor.users.findOne(userId);
    return user && user.emails && user.emails.length ? user.emails[0].address : false;
  }

  /**
   * Sends push notification using raix:push package
   * @param notificationId
   * @param notificationOptions
   * @private
   */
  _sendPushNotification(notificationId, notificationOptions) {
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
  }

  _insertNotification(receiverId, markAsRead) {
    let notificationOptions = {
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

    let notificationId = Notifications.insert(notificationOptions);

    let html = this._renderTemplateWithData(notificationId);

    Notifications.update({_id: notificationId}, {
      $set: {text: html}
    });

    this._sendPushNotification(notificationId, notificationOptions);

    return notificationId;
  }

  _sendEmailBasic(receiver, text) {
    let emailOptions = {
      subject: this._getEmailSubject(),
      from: this._getUserEmail(this._options.senderId) || 'notifications@hospohero.com',
      to: this._getUserEmail(receiver),
      html: text
    };

    Email.send(emailOptions);
  }

  /**
   * Sends email to specified receiver
   *
   * @param receiver - user ID or email
   */
  sendEmail(receiver) {
    let notificationId = null;

    if (this._isInteractive()) {
      notificationId = this._insertNotification(receiver, true);
    }

    let html = this._renderTemplateWithData(notificationId, 'email');
    this._sendEmailBasic(receiver, html);
  }

  /**
   * Sends build-in app notification
   *
   * @param receiverId
   */
  sendNotification(receiverId) {
    this._insertNotification(receiverId, false);
  }

  sendBoth(receiverId) {
    let notificationId = this._insertNotification(receiverId, false);
    let html = this._renderTemplateWithData(notificationId, 'email');
    this._sendEmailBasic(receiverId, html);
  }


  /**
   * Returns URL to action 'parking' page for specified action
   * and notification ID
   *
   * @param {string} methodName
   * @param {string} action
   * @param {object} templateRootContext contains `_notificationId` and `_isEmail`
   */
  static actionUrlFor(methodName, action, templateRootContext) {
    let queryMap = {
      method: methodName,
      id: templateRootContext._notificationId,
      action
    };
    let query = _.map(queryMap, (value, property) => `${property}=${value}`).join('&');

    return NotificationSender.urlFor('notificationAction', {}, templateRootContext, {query});
  }

  /**
   * Returns URL for specified route and it's params
   * This method is preferable for using while rendering notifications
   *
   * @param {string} routeName
   * @param {object} routeParams
   * @param {object} templateRootContext contains `_notificationId` and `_isEmail`
   * @param {object} [routeOptions]
   */
  static urlFor(routeName, routeParams, templateRootContext, routeOptions = {}) {
    return Router[templateRootContext._isEmail ? 'url' : 'path'](routeName, routeParams, routeOptions);
  }
};