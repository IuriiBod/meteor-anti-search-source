_.extend(Roles, {
  configure: function (options) {
    this._configuration = _.pick(options, 'actions', 'defaultRoles');
    this._updateRoles();
  },
  _updateRoles: function() {
    this._configuration.defaultRoles.forEach(function(role) {
      role.default = true;
      Meteor.roles.update({
        name: role.name
      }, {
        $set: role
      }, {
        upsert: true
      });
    });
  }
});