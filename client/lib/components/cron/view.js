Template.cronConfig.onRendered(function() {
  this.$(".set-cron-time").datetimepicker({
    format: 'LT'
  });
});

Template.cronConfig.events({
  'submit #shift-updates-cron': function(e, tpl) {
    e.preventDefault();

    var id = tpl.$('[name="cron-time"]').attr("data-id");
    var val = tpl.$('[name="cron-time"]').val();

    if(confirm("Do you really want to set new cron time?")) {
      Meteor.call("updateCronTime", val, id, function(err, id) {
        if(err) {
          HospoHero.alert(err);
        } else {
          tpl.$('[name="cron-time"]').attr("data-id", id);
          tpl.$(".alert-area").html('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>You should restart Meteor server to apply cron time change</div>');
        }
      });
    }
  }
});
