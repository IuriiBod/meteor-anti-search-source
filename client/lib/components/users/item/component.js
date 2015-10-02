var component = FlowComponents.define('userDetailed', function(props) {
  this.user = props.user;
});

component.state.user = function() {
  return this.user;
};

component.state.email = function() {
  if(this.user.emails && this.user.emails[0]) {
    return this.user.emails[0].address;
  }
};

component.state.roleId = function () {
  var currentArea = HospoHero.getDefaultArea();
  if(currentArea) {
    if(this.user.roles[currentArea]) {
      return this.user.roles[currentArea];
    } else if(this.user.roles.defaultRole) {
      return this.user.roles.defaultRole;
    }
  }
};

component.state.role = function() {
  if(this.get('roleId')) {
    return Roles.getRoleById(this.get('roleId')).name;
  }
};

component.state.roles = function () {
  return Roles.getRoles();
};

component.state.selectedRole = function (roleId) {
  return roleId == this.get('roleId');
};

component.state.userStyle = function() {
  return this.user.isActive ? '' : 'text-decoration: line-through';
};