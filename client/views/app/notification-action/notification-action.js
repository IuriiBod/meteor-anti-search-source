Template.notificationAction.onCreated(function () {
  this.actionResult = new ReactiveVar(false);
  var routerQuery = Router.current().params.query;

  try {
    check(routerQuery, {
      method: String,
      id: HospoHero.checkers.MongoId,
      action: String
    });

    Meteor.call(routerQuery.method, routerQuery.id, routerQuery.action, HospoHero.handleMethodResult(function () {
      Router.go('dashboard');
    }));

  } catch (err) {
    this.actionResult.set('Error: wrong action');
  }
});

Template.notificationAction.helpers({
  actionResult: function () {
    return Template.instance().actionResult.get();
  }
});