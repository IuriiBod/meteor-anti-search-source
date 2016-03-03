/**
 * Publishes only for authorized uses
 *
 * @param publicationName
 * @param publicationFn
 */
Meteor.publishAuthorized = function (publicationName, publicationFn) {
  let wrappedPublishFunction = function () {
    if (this.userId) {
      return publicationFn.apply(this, arguments);
    } else {
      logger.warn(`Unauthorized user in ${publicationName} publication`);
      this.ready();
    }
  };

  Meteor.publish(publicationName, wrappedPublishFunction);
};