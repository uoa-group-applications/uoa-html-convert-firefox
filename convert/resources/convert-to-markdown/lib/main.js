const _ =
    clipboard = require('sdk/clipboard'),
	contextMenu = require('sdk/context-menu'),
	data = require('sdk/self').data,
	xhr = require('sdk/net/xhr'),
  widget = require("sdk/widget"),
  panel = require("sdk/panel");

var markdown = {};
var markdownPanel;

markdown.handlePaste  = function(data) {

	var req = new xhr.XMLHttpRequest();
//	req.open('POST', 'http://localhost:8090/convert/api/unknown/uoa/html-to-markdown', false);
	req.open('POST', 'http://markdown.codelounge.io/api/uoa/html-to-markdown', false);
	req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify({ html: data }));

  console.log('status ', req.status);
  console.log('text ', req.responseText);

	if (req.status == 200) {
    var result = JSON.parse(req.responseText);
    if (result.error) {
      markdownPanel.port.emit('failed-markdown', 'Unknown error - it has been logged on the server so we will investigate');
      markdown.timerShow();
    } else {
      clipboard.set(result.markdown, 'text');
      markdownPanel.port.emit('incoming-markdown', result.markdown);
      markdown.timerShow();
    }
	} else {
    markdownPanel.port.emit('failed-markdown', 'Unable to transform in HTML ' + req.responseText);
    markdown.timerShow();
  }
};

markdown.firstTime = true;

markdown.timerShow = function() {
  markdownPanel.show();

  if (!markdown.firstTime) {
    markdownPanel.port.emit('set-timer');
  } else {
    markdown.firstTime = false;
  }
};


exports.main = function() {
	// this item should only work on textareas
//	console.log('installing menu item for text areas');

  markdownPanel = panel.Panel( {
    width: 600,
    height: 200,
    contentURL: data.url('markdown.html'),
    contentScriptFile: data.url('markdown-result.js')
  });

  markdownPanel.port.on('hide-panel', function() {
    markdownPanel.hide();
  });

  var w = widget.Widget({
    id: "markdown-widget",
    label: "Copy to Markdown results",
    contentURL: data.url("markdown.png"),
    panel: markdownPanel,
    onClick: function() {
      this.panel.show();
    }
  });

	var item = contextMenu.Item({
		label: 'Copy as Markdown',
    image: data.url('markdown.png'),
		contentScriptFile: data.url('copy-me-some-markdown.js'),
		onMessage: markdown.handlePaste
	});

  item.context.add(contextMenu.SelectionContext());
};

