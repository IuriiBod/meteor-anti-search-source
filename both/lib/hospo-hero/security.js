/**
 * Provides simple interface for permission checking
 *
 * No external dependencies except Underscore and Meteor
 */
class PermissionChecker {
  /**
   * @param {string} [userId] user we are going to check permission for
   */
  constructor(userId) {
    if (!userId) {
      try {
        userId = Meteor.userId();
      } catch (err) {
        //probably was called in subscription
        //so user isn't authorized
        userId = false;
      }
    }

    this._user = userId && Meteor.users.findOne({_id: userId});
  }

  /**
   * Checks whether user with specified ID is authorized
   */
  isAuthorized() {
    return !!this._user;
  }

  /**
   * @param {string} organizationId
   * @returns {boolean}
   */
  isOrganizationOwner(organizationId) {
    return this.isAuthorized() && this._checkOrganizationOwner(organizationId);
  }

  /**
   * @param {string} areaId area to check
   * @param {string} permission permission to check
   * @returns {boolean}
   */
  hasPermissionInArea(areaId, permission) {
    let area = Areas.findOne({_id: areaId});

    return this.isAuthorized()
      && area
      && (permission !== 'be rosted' && this.isOrganizationOwner(area.organizationId)
      || this._hasRoleAction(this._user.roles[areaId], permission));
  }

  /**
   * Warning: This method may be dangerous, because there
   * is no clear way to check user's permissions in location.
   * Double check before using it.
   *
   * @param {string} locationId location to check
   * @param {string} permission permission to check
   * @returns {boolean}
   */
  hasPermissionInLocation(locationId, permission) {
    let location = Locations.findOne({_id: locationId});
    let locationAreasIds = Areas.find({locationId: locationId}).map(area => area._id);

    return this.isOrganizationOwner(location.organizationId)
      || locationAreasIds.some(areaId => this.hasPermissionInArea(areaId, permission));
  }

  _checkOrganizationOwner(organizationId) {
    return !!Organizations.findOne({
      _id: organizationId,
      owners: this._user._id
    });
  }

  /**
   * Check whether role has action
   * @param roleId
   * @param action
   * @returns {boolean}
   */
  _hasRoleAction(roleId, action) {
    return !!Meteor.roles.findOne({
      _id: roleId,
      actions: action
    });
  }
}

Namespace('HospoHero.security', {
  PermissionChecker: PermissionChecker
});