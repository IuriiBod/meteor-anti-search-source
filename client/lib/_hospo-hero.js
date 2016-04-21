Namespace('HospoHero.security', {
  hasPermissionInAreaTo: function (permission) {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.hasPermissionInArea(null, permission);
  },
  isCurrentOrganizationOwner: function () {
    let currentOrganizationId = HospoHero.getOrganizationIdBasedOnCurrentArea(Meteor.userId());
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return currentOrganizationId && permissionChecker.isOrganizationOwner(currentOrganizationId);
  }
});

Namespace('HospoHero', {
  handleMethodResult: function (onSuccess) {
    return function (err, res) {
      if (err) {
        HospoHero.error(err);
      } else {
        if (_.isFunction(onSuccess)) {
          onSuccess(res);
        }
      }
    };
  },
  
  // Alert error message
  error: function (err) {
    if (err) {
      console.log(err);
      if (err.reason) {
        return sweetAlert("Error!", err.reason, "error");
      } else if (err.error) {
        return sweetAlert("Error!", err.error, "error");
      } else if (err.message) {
        return sweetAlert("Error!", err.message, "error");
      } else {
        return sweetAlert("Error!", err, "error");
      }
    } else {
      return sweetAlert("Error!", "", "error");
    }
  },

  // Alert success message
  success: function (message) {
    sweetAlert("Success!", message, "success");
  },

  // Alert info message
  info: function (message) {
    sweetAlert("Info!", message, "info");
  },

  getParamsFromRoute: function (params, routeContext) {
    routeContext = routeContext || Router.current();
    if (_.isString(params)) {
      return routeContext.params[params];
    } else {
      var result = {};
      params.forEach(function (param) {
        result[param] = routeContext.params[params];
      });
      return result;
    }
  }
});

Template.registerHelper('username', HospoHero.username);