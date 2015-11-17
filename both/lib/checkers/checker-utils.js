/**
 * Allows intelligent document's property checking.
 * For existing documents also provides check if it is located in collection
 *
 * @param documentToValidate
 * @param targetCollection
 * @constructor
 */
DocumentCheckerHelper = function DocumentCheckerHelper(documentToValidate, targetCollection) {
  this._isCreating = !documentToValidate._id;
  this._documentToValidate = documentToValidate;

  if (!this._isCreating) {
    this._oldDocument = targetCollection.findOne({_id: documentToValidate._id});

    if (!this._oldDocument) {
      logger.error("Document not found", {id: documentToValidate._id, collection: targetCollection._name});
      throw new Meteor.Error(404, "Record not found");
    }
  }
};


DocumentCheckerHelper.prototype._needValidateProperty = function (propertyName) {
  return this._isCreating || this._documentToValidate[propertyName] !== this._oldDocument[propertyName];
};

/**
 * Calls validation function if property was changed
 *
 * @param {string} propertyName
 * @param {function} checkFn function that checks property (should throw exception if property isn't valid)
 * @returns {boolean} true if check was executed
 */
DocumentCheckerHelper.prototype.checkProperty = function (propertyName, checkFn) {
  if (this._needValidateProperty(propertyName)) {
    checkFn();
    return true;
  }
  return false;
};

/**
 * Makes check if any of specified properties was changed.
 * `checkFn` will be called only one time
 *
 * @param properties
 * @param checkFn
 */
DocumentCheckerHelper.prototype.checkPropertiesGroup = function (properties, checkFn) {
  if (_.isArray(properties)) {
    var self = this;

    properties.forEach(function (propertyName) {
      return !self.checkProperty(propertyName, checkFn);
    });
  }
};


Namespace('HospoHero.checkerUtils', {
  DocumentCheckerHelper: DocumentCheckerHelper,

  checkError: function (message) {
    throw new Meteor.Error(502, message);
  }
});

logger = Meteor.isServer ? logger : {
  error: function () {
    console.log('ERROR: ', arguments);
  }
};