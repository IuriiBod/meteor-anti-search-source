Template.taskDateFilter.helpers({
  templateData: function () {
    var parentData = Template.parentData();
    return {
      item: Template.currentData(),
      activeFilter: parentData.activeFilter,
      onFilterChange: parentData.onFilterChange
    };
  }
});