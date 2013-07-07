

self.port.on('incoming-markdown', function(data) {
  document.getElementById('markdown-error').style = 'display:none;';
  document.getElementById('markdown-copied').style = 'display:block;';

  var resultId = document.getElementById('markdown-result');
  resultId.innerHTML = '<code>' + data + '</code>';
});

self.port.on('failed-markdown', function(data) {
  document.getElementById('markdown-copied').style = 'display:none;';
  document.getElementById('markdown-error').style = 'display:block;';
  var resultId = document.getElementById('markdown-error-text');
  resultId.innerHTML = data;
});

// the main.js doesn't have the setTimeout function, its an aspect of the window, but we can't close the panel, so we
// have to communicate back to close the window
self.port.on('set-timer', function() {
//  console.log('setting timeout');
  setTimeout(function() {
//    console.log('timeout fired');
    self.port.emit('hide-panel');
  }, 2000);

});

