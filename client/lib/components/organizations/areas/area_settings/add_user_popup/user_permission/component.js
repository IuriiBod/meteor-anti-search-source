var component = FlowComponents.define('userPermissions', function(props) {
  this.set('selectPermissions', true);
  this.selectedUser = props.selectedUser;
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

  this.selectedUser

  this.set('selectPermissions', false);
};

component.action.backToSelectUser = function() {
  this.set('selectPermissions', false);
};