var component = FlowComponents.define('userPermissions', function(props) {
  this.set('selectPermissions', props.selectPermissions);
  this.selectedUser = props.selectedUser;
  this.areaId = props.areaId;
});

// TODO: Change respectively to new permissions
component.state.userPermissions = function() {
  return [
    {
      name: 'createEditMenu',
      title: 'Create/edit menu',
      description: 'Can create and edit menus'
    },
    {
      name: 'createEditJobs',
      title: 'Create/edit jobs',
      description: 'Can create and edit jobs'
    },
    {
      name: 'createEditStocks',
      title: 'Create/edit stocks',
      description: 'Can create and edit stocks'
    }
  ];
};

component.action.addUser = function() {
  var userId = this.selectedUser;
  var areaId = this.areaId;
  Meteor.call('addUserToArea', userId, areaId, function(err, area) {
    if(err) {
      console.log(err);
      return err.reason;
    }
    var options = {
      type: 'update',
      title: 'You\'ve been added to the ' + area.name + ' area.',
      to: userId
    };
    Meteor.call('sendNotifications', areaId, 'organization', options, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      Meteor.call('notifyAddToArea', 'id', userId, area.name, Meteor.user(), function (err) {
        if(err) {
          console.log(err);
          return alert(err);
        }
      });
    });
  });
  this.set('selectPermissions', false);
};

component.action.backToSelectUser = function() {
  this.set('selectPermissions', false);
};