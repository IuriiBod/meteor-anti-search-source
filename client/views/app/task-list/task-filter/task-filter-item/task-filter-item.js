Template.taskFilterItem.helpers({
  activeFilterClass: function () {
    return this.item === this.activeFilter ? 'active' : '';
  }
});


Template.taskFilterItem.events({
  'click .task-filter-switcher': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onFilterChange(this.item);
  }
});