Namespace('HospoHero.security', {
  publishFields: {
    users: {
      'profile.firstname': 1,
      'profile.lastname': 1,
      'profile.image': 1,
      'services.google.picture': 1,
      relations: 1,
      createdAt: 1,
      currentAreaId: 1,
      roles: 1
    }
  },

  getPublishFieldsFor(collectionName, additionalFields = {}) {
    if (_.isString(collectionName)) {
      let defaultFields = HospoHero.security.publishFields[collectionName] || {};
      return _.extend(additionalFields, defaultFields);
    } else {
      throw new Meteor.Error('Collection name expected');
    }
  }
});