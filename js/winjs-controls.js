window.addEventListener('load', function()
{
  var iframes = document.querySelectorAll('.control-view');
  var selectControlLeft = document.querySelector('.version-select.left');
  var selectControlRight = document.querySelector('.version-select.right');

  //
  // Update the control display
  //
  function update(path, version, theme, index)
  {
    var iframesToUpdate = (typeof index === 'undefined') ? iframes : [iframes[index]];

    for (var i = 0; i < iframesToUpdate.length; ++i)
    {
      var iframe = iframesToUpdate[i];
      iframe.src = path;

      (function(iframe)
      {
        iframe.onload = function()
        {
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
          base.async = false;
          ui.async = false;
          iframe.contentDocument.head.appendChild(base);
          iframe.contentDocument.head.appendChild(ui);

          // Run WinJS
          ui.onload = function()
          {
            if (!iframe.contentWindow.WinJS)
            {
              console.warn('WinJS failed to load, skipping initialization', '(' + version + ')')
              return;
            }

            iframe.contentWindow.WinJS.Navigation.history.backStack = [{}];
            iframe.contentWindow.WinJS.UI.processAll();
            if (iframe.contentWindow.initialize)
            {
              iframe.contentWindow.initialize();
            }
          }
        };
      })(iframe);
    }
  }

  //
  // Listen for changes on the version dropdown
  //
  selectControlLeft.addEventListener('change', function()
  {
    var parts = selectControlLeft.value.split(' ');
    update(iframes[0].src, parts[0], parts[1], 0);
  });
  selectControlRight.addEventListener('change', function()
  {
    var parts = selectControlRight.value.split(' ');
    update(iframes[1].src, parts[0], parts[1], 1);
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
      var parts = selectControlLeft.value.split(' ');
      update(link, parts[0], parts[1], 0);
      parts = selectControlRight.value.split(' ');
      update(link, parts[0], parts[1], 1);
    }
  });

  //
  // Default version and theme
  //
  var parts = selectControlLeft.value.split(' ');
  var src = document.querySelector('.control-link').getAttribute('data-link');
  update(src, parts[0], parts[1]);
});

