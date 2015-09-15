var component = FlowComponents.define('flyouts', function(props) {
  this.organizationId = props.organizationId;
});

component.state.organizationTitle = function() {
  var locationsCount;
  var content = [];

  content.push('<span style="margin-left: 150px;">Organization</span>');
  content.push('<span class="pull-right btn btn-sm btn-link open-flyout" data-id="organizationDetailsPage"><i class="fa fa-fw fa-cog"></i></span>');

  if(this.get('isOrganizationOwner')) {
    content.push('<span class="pull-right btn btn-sm btn-link open-flyout" data-id="invitationsList"><i class="fa fa-fw fa-user"></i></span>');
  }

  content.push('<div class="btn-group pull-right open">');
  content.push('<button type="button" class="btn dropdown-toggle btn-link" data-toggle="dropdown" aria-expanded="true">');
  content.push('<i class="fa fa-fw fa-plus"></i>');
  content.push('</button>');
  content.push('<ul class="dropdown-menu" role="menu">');
  content.push('<li>');
  content.push('<a href="#" class="open-flyout" data-id="createLocation">Add Location</a>');
  content.push('</li>');

  if(this.get('locationsCount') > 0) {
    content.push('<li>');
    content.push('<a href="#" class="open-flyout" data-id="createArea">Add Area</a>');
    content.push('</li>');
  }
  content.push('</ul>');
  content.push('</div>');
  return content.join('');
};

component.state.isInOrganization = function() {
  if(this.organizationId != '') {
    return true;
  } else {
    return false;
  }
};

component.state.profileName = function() {
  var user = Meteor.user();
  return user.username;
};

component.state.isOrganizationOwner = function() {
  if(this.organizationId) {
    var orgCount;
    var userId;
    userId = Meteor.userId();
    orgCount = Organizations.find({_id: this.organizationId, owner: userId}).count();
    if(orgCount) {
      return true;
    } else {
      return false;
    }
  }
};

component.state.locationsCount = function() {
  return Locations.find({'organizationId': this.organizationId}).count();
};