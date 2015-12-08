Template.weeklyRosterDay.onRendered(function () {
  if (HospoHero.canUser('edit roster', Meteor.userId())) {
    this.$(".sortable-list").sortable(createSortableConfig());
  }
});

Template.weeklyRosterDay.events({
  'click .add-shift-button': function (event, tmpl) {
    FlowComponents.callAction("addShift");
  },

  'click .manager-note-flyout': function () {
    FlowComponents.callAction('openManagerNotesFlyout');
  }
});

var createSortableConfig = function () {
  return {
    connectWith: ".sortable-list",
    revert: true,
    stop: function (event, ui) {
      try {
        var sortedShift = new SortableHelper(ui).getSortedShift();

        if (sortedShift) {
          Meteor.call("editShift", sortedShift, HospoHero.handleMethodResult());
        }
      } catch (err) {
        //cancel drop if shift isn't valid
        $(this).sortable('cancel');

        HospoHero.error(err);
      }
    }
  };
};


var SortableHelper = function (ui) {
  this._draggedToDate = new Date(ui.item.parent().data('current-date'));
  this._draggedShift = _.clone(this._getDataByItem(ui.item)); //clone it just in case
  this._previousShift = this._getDataByItem(ui.item.prev());
  this._nextShift = this._getDataByItem(ui.item.next());
};


SortableHelper.prototype._getDataByItem = function (item) {
  var element = item[0];
  return element ? Blaze.getData(element) : null;
};

SortableHelper.prototype._getOrder = function () {
  var order = 0;

  if (!this._nextShift && this._previousShift) {
    order = this._previousShift.order + 1;
  } else if (!this._previousShift && this._nextShift) {
    order = this._nextShift.order - 1;
  } else if (this._nextShift && this._previousShift) {
    order = (this._nextShift.order + this._previousShift.order) / 2;
  }

  return order;
};


SortableHelper.prototype.getSortedShift = function () {
  if (this._draggedShift) {
    this._draggedShift.order = this._getOrder();
    this._draggedShift.shiftDate = this._draggedToDate;

    check(this._draggedShift, HospoHero.checkers.ShiftDocument);

    return this._draggedShift;
  }
};