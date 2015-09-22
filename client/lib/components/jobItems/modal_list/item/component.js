var component = FlowComponents.define('jobItemListed', function(props) {
  this.jobitem = props.jobitem;
  this.name = props.name;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  return this.jobitem;
};

component.state.costPerPortion = function() {  
  if(this.jobitem) {
    var item = getPrepItem(this.jobitem._id);
    if(item) {
      return item.prepCostPerPortion;
    }
  }
};

component.prototype.onItemRendered = function() {
  var self = this;
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  if(self.jobitem) {
    $('input.selectedPrep').on('ifChecked', function(){
      var id = $(this).attr("data-id");
      if(self.name == "addPrep") {
        var localId = Session.get("localId");

        var localMenuItem = LocalMenuItem.findOne(localId);
        if(localMenuItem) {
          LocalMenuItem.update({"_id": localId}, {$addToSet: {"preps": id}});
        } 
      }
    });
  }
};