Template.textEditor.onRendered(function () {
  var tmpl = this;
  var onSummernoteInit = function () {
    // Add "open" - "save" buttons
    var imageButton = '<button id="uploadImage" type="button" class="btn btn-default btn-sm btn-small" ' +
      'title="Upload an image" data-event="something" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';

    $(imageButton).appendTo($('.note-insert')[1]);

    // Button tooltips
    tmpl.$('#uploadImage').tooltip({container: 'body', placement: 'bottom'});

    // Button events
    tmpl.$('#uploadImage').click(function () {
      filepicker.pickAndStore(
        {
          extensions: ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.xls', '.csv'],
          services: ['COMPUTER'],
          multiple: true
        },
        {},
        function (InkBlobs) {
          var doc = (InkBlobs);
          if (doc && doc[0].url) {
            var image = '<img src="' + doc[0].url + '" alt="uploaded image">';
            if (image) {
              $(image).appendTo($(".note-editable"));
            }
          }
        });
    });
  };

  tmpl.$('.summernote').summernote({
    focus: false,
    toolbar: [['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize', ['fontsize']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['view', ['fullscreen', 'codeview']],
      ['table', ['table']],
      ['insert', ['link']]
    ],
    oninit: onSummernoteInit,
    minHeight: 200
  });

  this.autorun(function () {
    tmpl.$(".summernote").summernote('code', Template.currentData().initialHtml);
  });
});