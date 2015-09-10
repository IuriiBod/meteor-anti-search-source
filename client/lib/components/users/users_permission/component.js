var component = FlowComponents.define('usersPermission', function(props) {});

component.state.activeUsers = function() {
  var users = this.get('users', true);
  return users;
};

component.state.deactiveUsers = function() {
  var users = this.get('users', false);
  return users;
};

component.state.users = function(isActive) {
  var orgId = Session.get('organizationId');
  var userId = Meteor.userId();
  var relations = Relations.find({
    collectionName: 'users',
    organizationId: orgId,
    entityId: {
      $ne: userId
    }
  }).fetch();
  var users = [];
  if(relations.length) {
    var user;
    relations.forEach(function(relation) {
      if(isActive) {
        user = Meteor.users.findOne({_id: relation.entityId, isActive: true});
      } else {
        user = Meteor.users.findOne({_id: relation.entityId, isActive: false});
      }
      if(user) {
        users.push(user);
      }
    });
  }
  return users;
};