Namespace('HospoHero', {
  
  handleMethodResult: function (onSuccess) {
    return function (err, res) {
      if (err) {
        HospoHero.handleError(err);
      } else {
        if (_.isFunction(onSuccess)) {
          onSuccess(res);
        }
      }
    };
  },

  handleError: function (err) {
    alert(err);
  }
});
