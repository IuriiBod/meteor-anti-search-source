Template.notificationAction.onCreated(function () {
  this.actionResult = new ReactiveVar(false);
  var routerQuery = Router.current().params.query;

  try {
    check(routerQuery, {
      method: String,
      id: HospoHero.checkers.MongoId,
      action: String
    });

    var self = this;
    Meteor.call(routerQuery.method, routerQuery.id, routerQuery.action, HospoHero.handleMethodResult(function (result) {
      self.actionResult.set('Success! ', result);
      //probably we can also create this tab, if action opened in new tab
    }));

  } catch (err) {
    this.actionResult.set('Error: wrong action');
  }
});

Template.notificationAction.helpers({
  actionResult: function () {
    return Template.instance().actionResult.get()
  }
});