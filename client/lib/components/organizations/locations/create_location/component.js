var component = FlowComponents.define("createLocation", function (props) {
});

component.action.submit = function (doc) {
  Meteor.call("createLocation", doc, HospoHero.handleMethodResult());
};
