Template.itemsSearch.events({
  'keyup input': function (event, tmpl) {
    var onKeyUp = tmpl.data.onKeyUp;
    if (_.isFunction(onKeyUp)) {
      tmpl.data.onKeyUp(event.target.value);
    }
  }
});