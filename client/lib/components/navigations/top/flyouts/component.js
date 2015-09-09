var component = FlowComponents.define('flyouts', function(props) {});

component.state.organizationTitle = function() {
  var content = [];
  content.push('<span style="margin-left: 150px;">Organization</span>');

  content.push('<span class="pull-right btn btn-sm btn-link open-flyout" data-id="organizationDetailsPage"><i class="fa fa-fw fa-cog"></i></span>');
  content.push('<span class="pull-right btn btn-sm btn-link"><i class="fa fa-fw fa-user"></i></span>');

  content.push('<div class="btn-group pull-right open">');
  content.push('<button type="button" class="btn dropdown-toggle btn-link" data-toggle="dropdown" aria-expanded="true">');
  content.push('<i class="fa fa-fw fa-plus"></i>');
  content.push('</button>');
  content.push('<ul class="dropdown-menu" role="menu">');
  content.push('<li>');
  content.push('<a href="#" class="open-flyout" data-id="createLocation">Add Location</a>');
  content.push('</li>');
  content.push('<li>');
  content.push('<a href="#" class="open-flyout" data-id="createArea">Add Area</a>');
  content.push('</li>');
  content.push('<li class="divider"></li>');
  content.push('<li>');
  content.push('<a href="#">Create Organisation</a>');
  content.push('</li>');
  content.push('</ul>');
  content.push('</div>');
  return content.join('');
};