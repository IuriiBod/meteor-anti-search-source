var component = FlowComponents.define('flyouts', function(props) {});

component.state.organizationTitle = function() {
  var content = [];
  content.push('Organization');
  content.push('<span class="pull-right btn btn-sm btn-link"><i class="fa fa-fw fa-cog"></i></span>');
  content.push('<span class="pull-right btn btn-sm btn-link" style="margin-left: -50px;"><i class="fa fa-fw fa-user"></i></span>');
  return content.join('');
};