window.addEventListener('load', function()
{
  var iframe = document.querySelector('#control-view');
  var selectControl = document.querySelector('.version-select');

  //
  // Update the control display
  //
  function update(path, version, theme)
  {
    iframe.src = path;
    iframe.onload = function()
    {
      var existingStyle = iframe.contentDocument.head.querySelector('#winjs-stylesheet');
      if (existingStyle)
        iframe.contentDocument.head.removeChild(existingStyle);

      // Add stylesheet
      var style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '../winjs/' + version + '/css/ui-' + theme + '.css';
      style.id = 'winjs-stylesheet';
      iframe.contentDocument.head.appendChild(style);

      // Add javascript
      var base = document.createElement('script');
      var ui = document.createElement('script');
      base.src = '../winjs/' + version + '/js/base.js';
      ui.src = '../winjs/' + version + '/js/ui.js';
      iframe.contentDocument.head.appendChild(base);
      iframe.contentDocument.head.appendChild(ui);

      // Run WinJS
      ui.onload = function()
      {
        iframe.contentWindow.WinJS.Navigation.history.backStack = [{}];
        iframe.contentWindow.WinJS.UI.processAll();
        if (iframe.contentWindow.initialize)
        {
          iframe.contentWindow.initialize();
        }
      }
    };
  }

  //
  // Listen for changes on the version dropdown
  //
  selectControl.addEventListener('change', function()
  {
    var parts = selectControl.value.split(' ');
    update(iframe.src, parts[0], parts[1]);
  });

  //
  // Listen for clicks in the pane
  //
  var pane = document.querySelector('.pane');
  pane.addEventListener('click', function(e)
  {
    var link = e.target.getAttribute('data-link');
    if (link)
    {
      var parts = selectControl.value.split(' ');
      update(link, parts[0], parts[1]);
    }
  });

  //
  // Default version and theme
  //
  var parts = selectControl.value.split(' ');
  update(iframe.src, parts[0], parts[1]);
});

