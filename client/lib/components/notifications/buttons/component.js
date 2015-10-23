var component = FlowComponents.define("notifiButtons", function(props) {
  this.notification = props.noti;
});

component.state.notifi = function() {
  return this.notification;
};

component.state.permittedActionType = function() {
  if(this.notification) {
    var actionType = this.notification.actionType;
    var type = this.notification.type;

    return !(actionType == "delete" || type == 'organizations' || type == 'invitation');
  }
};