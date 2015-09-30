var component = FlowComponents.define('usersList', function(props) {});

component.state.users = function(isActive) {
  return Meteor.users.find({
    "isActive": isActive,
    $or: [
      { "relations.areaIds": HospoHero.getDefaultArea() },
      { "relations.areaIds": null }
    ]
  }, {sort: {"username": 1}});
};