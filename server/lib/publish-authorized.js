/**
 * Publishes only for authorized uses
 *
 * @param publicationName
 * @param publicationFn
 */
Meteor.publishAuthorized = function (publicationName, publicationFn) {
  let wrapPublishFunction = function () {
    if (this.userId) {
      return publicationFn.apply(this, arguments);
    } else {
      logger.warn(`Unauthorized user in ${publicationName} publication`);
      this.ready();
    }
  };

  let wrappedPublishFn = wrapPublishFunction(publicationFn);
  Meteor.publish(publicationName, wrappedPublishFn);
};