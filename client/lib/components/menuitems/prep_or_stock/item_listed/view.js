Template.itemListed.rendered = function() {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  $('input').on('ifChecked', function(){
    var menuId = Session.get("thisMenuItem");
    var id = $(this).attr("data-id");
    var type = $(this).attr("data-type");
    var self = this;

    if(id && type) {
      var doc = {
        "_id": id,
        "quantity": 1
      };
      if(type == "prep") {
        Meteor.call("addItemToMenu", menuId, {jobItems: doc}, function(err) {
          if(err) {
            HospoHero.alert(err);
          } else {
            $(self).closest("tr").remove();
          }
        });
      } else if(type == "ing") {
        Meteor.call("addItemToMenu", menuId, {ingredients: doc}, function(err) {
          if(err) {
            HospoHero.alert(err);
          } else {
            $(self).closest("tr").remove();
          }
        });
      }
    }
  });
};