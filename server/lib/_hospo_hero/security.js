Namespace('HospoHero.security', {
  publishFields: {
    users: {
      'profile.fullName': 1,
      'profile.image': 1,
      'profile.sections': 1,
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