Template.areaChooser.events({
  'submit form': function (e, tpl) {
    e.preventDefault();
    FlowComponents.callAction('selectAreaId', tpl.$('[name="areaId"]').val());
  }
});