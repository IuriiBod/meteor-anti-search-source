var component = FlowComponents.define('menuListHeader', function () {});

component.state.isArchived = function () {
  var archive = Router.current().params.status;
  return archive && archive == 'archived';
};