var UIStatesManager = function (namespace) {
  this.namespace = namespace;
};

UIStates = {
  getManagerFor: function (namespace) {
    var uiStateManager = new UIStatesManager(namespace);
    var statesDep = new Tracker.Dependency;
    return {
      getState: function (category) {
        statesDep.depend();
        var user = Meteor.user();
        if (user && user.profile.uiStates && user.profile.uiStates[uiStateManager.namespace]) {
          return user.profile.uiStates[uiStateManager.namespace][category];
        } else {
          return false;
        }
      },

      setState: function (uiStateId, state) {
        if (Meteor.userId()) {
          var item = {
            namespace: uiStateManager.namespace,
            uiStateId: uiStateId,
            state: state
          };

          Meteor.call('updateUIState', item, function (err, res) {
            if (err) {
              console.log(err);
            } else {
              statesDep.changed();
            }
          });
        }
      }
    }
  }
};