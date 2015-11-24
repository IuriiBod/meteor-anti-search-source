if (HospoHero.isProductionMode()) {
  Meteor._registerMethodsFn = Meteor.methods;

  Meteor.methods = function (methodsObj) {
    var wrapWithExceptionLogging = function (method) {
      return function () {
        try {
          return method.apply(this, arguments);
        } catch (err) {
          //log error and return it to client
          logger.error(err.stack);
          throw err;
        }
      };
    };

    Object.keys(methodsObj).forEach(function (methodName) {
      methodsObj[methodName] = wrapWithExceptionLogging(methodsObj[methodName]);
    });

    Meteor._registerMethodsFn(methodsObj);
  };
}
