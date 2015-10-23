Template.weeklyRosterDay.onRendered(function () {
  if (HospoHero.canUser('edit roster', Meteor.userId())) {
    this.$(".sortable-list > div > li").css("cursor", "move");

    this.$(".sortable-list").sortable({
      "connectWith": ".sortable-list",
      "revert": true
    });

    var self = this;

    this.$(".sortable-list").on("sortstop", function (event, ui) {
      //var id = $(ui.item[0]).find("li").attr("data-id");//shiftid
      //
      //var order = 0;
      //var nextOrder = $(ui.item[0]).next().find("li").attr("data-order");
      //var prevOrder = $(ui.item[0]).prev().find("li").attr("data-order");
      //
      //var thisShift = Shifts.findOne(id);
      //
      //if (thisShift) {
      //  if (!nextOrder) {
      //    order = parseFloat(prevOrder) + 1;
      //  } else if (!prevOrder) {
      //    order = parseFloat(nextOrder) - 1;
      //  } else {
      //    order = (parseFloat(nextOrder) + parseFloat(prevOrder)) / 2;
      //  }
      //}
      //
      //Meteor.call("editShift", id, {"order": order}, HospoHero.handleMethodResult());
      var droppedItemContext = Blaze.getData(ui.item[0]);
      console.log('stop', droppedItemContext);
    });

    this.$(".sortable-list").on("sortreceive", function (event, ui) {
      var droppedItemContext = Blaze.getData(ui.item[0]);
      console.log('stop', droppedItemContext);
      //var id = $(ui.item[0]).find("li").attr("data-id");//shiftid
      //var newDate = $(this).attr("data-date")//date of moved list
      //if (self.origin == "weeklyrostertemplate") {
      //  newDate = parseInt(daysOfWeek.indexOf(newDate));
      //}
      //
      //var order = 0;
      //var nextOrder = $(ui.item[0]).next().find("li").attr("data-order");
      //var prevOrder = $(ui.item[0]).prev().find("li").attr("data-order");
      //
      //var thisShift = Shifts.findOne(id);
      //
      //if (thisShift) {
      //  if (!nextOrder) {
      //    order = parseFloat(prevOrder) + 1;
      //  } else if (!prevOrder) {
      //    order = parseFloat(nextOrder) - 1;
      //  } else {
      //    order = (parseFloat(nextOrder) + parseFloat(prevOrder)) / 2;
      //  }
      //}
      //
      //if (id && newDate) {
      //  Meteor.call("editShift", id, {"shiftDate": newDate, "order": order}, HospoHero.handleMethodResult());
      //}
    });
  }
});

Template.weeklyRosterDay.events({
  'click .addShiftBox': function (event) {
    event.preventDefault();
    //todo: fix it
    FlowComponents.callAction("addShift");
  }
});
