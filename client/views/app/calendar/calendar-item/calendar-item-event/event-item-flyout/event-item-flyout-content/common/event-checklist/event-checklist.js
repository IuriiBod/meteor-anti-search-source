Template.eventChecklist.helpers({
  isChecked: function () {
    var tmplData = Template.parentData(1);
    var doneCheckListItems = tmplData.checkedItems;

    return function (itemIndex) {
      return doneCheckListItems.length &&
        doneCheckListItems.indexOf(itemIndex) > -1;
    };
  }
});


Template.eventChecklist.events({
  'ifToggled .i-check': function (event, tmpl) {
    var doneCheckListItems = tmpl.data.checkedItems || [];
    var checkedValue = parseInt(event.target.value);

    if (event.target.checked === true) {
      doneCheckListItems.push(checkedValue);
    } else {
      doneCheckListItems.splice(doneCheckListItems.indexOf(checkedValue), 1);
    }

    tmpl.data.onCheckToggle(doneCheckListItems);
  }
});