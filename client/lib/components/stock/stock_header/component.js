var component = FlowComponents.define('stockHeader', function () {});

component.state.isArchived = function () {
  var archive = Router.current().params.type;
  return archive && archive == 'archive';
};