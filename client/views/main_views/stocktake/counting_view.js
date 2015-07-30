Template.stocktakeCountingMainView.helpers({
  'new': function() {
    var view = Session.get("thisDate");
    if(view == "new") {
      return true;
    } else {
      return false;
    }
  }
});