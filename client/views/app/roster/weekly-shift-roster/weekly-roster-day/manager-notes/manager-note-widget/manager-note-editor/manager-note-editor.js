Template.managerNoteEditor.onCreated(function () {
  this.note = {
    title: 'Title',
    description: 'Description'
  };

  var noteDate = this.data.date || new Date();
  this.noteDate = new ReactiveVar(noteDate);
  this.sharingType = new ReactiveVar('private');
});

Template.managerNoteEditor.onRendered(function () {
  this.$('.note-title').focus();

  this.datepicker  = this.$('.date-picker-input');
  this.datepicker.datepicker({
    format: 'D dd/mm/yy',
    startDate: new Date(),
    orientation: "right"
  });

  this.datepicker.datepicker('setDate', this.noteDate.get());
});

Template.managerNoteEditor.helpers({
  note: function() {
    return Template.instance().note;
  },
  noteDate: function() {
    return Template.instance().noteDate.get();
  },
  taskSharingOptions: function () {
    return [
      {
        value: 'private',
        text: 'Private'
      },
      {
        value: 'area',
        text: 'For current area'
      },
      {
        value: 'location',
        text: 'For current location'
      },
      {
        value: 'organization',
        text: 'For current organization'
      }
    ];
  },
  selectedOption: function () {
    return Template.instance().sharingType.get();
  }
});

Template.managerNoteEditor.events({
  'click .date-picker-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.datepicker.datepicker('show');
  },

  'changeDate .date-picker-input': function (event, tmpl) {
    event.preventDefault();
    Template.instance().noteDate.set(event.date);
    tmpl.datepicker.datepicker('hide');
  },
  'click .close-manager-note-editor': function(event, tmpl) {
    event.preventDefault();
    tmpl.data.onCloseEditor();
  }
});
