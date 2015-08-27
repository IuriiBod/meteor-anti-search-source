Template.cronConfig.events({
  'keyup [name="cron-time"]': function(e, tpl) {
    var val = e.target.value;

    console.log("Value: ", val);

    var timeExp = /at\s[\d]{1,2}[:]?[\d]{0,2}[apm]{2}/;

    console.log("Match: ", val.match(timeExp));

    if(val.match(timeExp) == null) {
      $(e.target).parent().removeClass("has-success").addClass("has-error");
      tpl.$("#shift-updates-cron-submit").addClass("disabled");
    } else {
      $(e.target).parent().removeClass("has-error").addClass("has-success");
      tpl.$("#shift-updates-cron-submit").removeClass("disabled");
    }
  },
  'submit #shift-updates-cron': function(e, tpl) {
    e.preventDefault();
    var val = tpl.$('[name="cron-time"]').val();
    var id = tpl.$('[name="cron-time"]').attr("data-id");
    var timeExp = /at\s[\d]{1,2}[:]?[\d]{0,2}[apm]{2}/;
    if(val.match(timeExp) == null) {
      $(e.target).parent().removeClass("has-success").addClass("has-error");
      tpl.$("#shift-updates-cron-submit").addClass("disabled");
    } else {
      $(e.target).parent().removeClass("has-error").addClass("has-success");
      tpl.$("#shift-updates-cron-submit").removeClass("disabled");

      if(confirm("Do you really want to set new cron time?")) {
        Meteor.call("updateCronTime", val, id, function(err, id) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            tpl.$('[name="cron-time"]').attr("data-id", id).blur();
            tpl.$("#shift-updates-cron-submit").addClass("disabled");
            tpl.$(".alert-area").html('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You should restart Meteor server to apply cron time change</div>');
          }
        });
      }
    }
  }
});
