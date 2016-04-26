Template.textEditor.onRendered(function () {
  let onSummernoteInit = () => {
    // Add "open" - "save" buttons
    let imageButton = '<button id="uploadImage" type="button" class="btn btn-default btn-sm btn-small"' +
      ' title="Upload an image" data-event="something" tabindex="-1"><i class="fa fa-picture-o icon-picture"></i></button>';

    $(imageButton).appendTo($('.note-insert')[1]);

    // Button tooltips
    this.$('#uploadImage').tooltip({container: 'body', placement: 'bottom'});

    // Button events
    this.$('#uploadImage').click(function () {
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
            let image = `<img src="${doc[0].url}" alt="uploaded image">`;
            if (image) {
              $(image).appendTo($('.note-editable'));
            }
          }
        });
    });
  };

  this.$('.summernote').summernote({
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

  this.autorun(() => {
    let data = Template.currentData();
    let newText = data.initialHtml;

    let editorElement = this.$('.summernote');
    let oldText = editorElement.summernote('code');

    if (oldText !== newText) {
      editorElement.summernote('code', newText);
    }
  });
});