window.addEventListener('load', function()
{
  var iframes = document.querySelectorAll('.control-view');
  var dropBoxes = document.querySelectorAll('.drop-box');
  var selectControlLeft = document.querySelector('.version-select.left');
  var selectControlRight = document.querySelector('.version-select.right');
  var droppedStyles = [null, null];

  //
  // Handle file drops
  //
  function getHandleDragFunc(index)
  {
    var func = function(e)
    {
      e.stopPropagation();
      e.preventDefault();
    };

    return func;
  };

  function getHandleDropFunc(index)
  {
    var func = function(e)
    {
      e.stopPropagation();
      e.preventDefault();

      var file = e.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onloadend = function(loadEvent)
      {
        // Remove previous stylesheet
        var oldStyle = iframes[index].contentDocument.querySelector('#winjs-stylesheet');
        if (oldStyle)
          oldStyle.parentElement.removeChild(oldStyle);

        // Add the stylesheet
        var text = loadEvent.target.result;
        var style = iframes[index].contentDocument.createElement('style');
        style.innerHTML = text;
        style.id = 'winjs-stylesheet';
        iframes[index].contentDocument.head.appendChild(style);
        droppedStyles[index] = text;
      };
      reader.readAsText(file);
    };

    return func;
  };

  for (var i = 0; i < iframes.length; ++i)
  {
    dropBoxes[i].addEventListener('dragover', getHandleDragFunc(i));
    dropBoxes[i].addEventListener('drop', getHandleDropFunc(i));
  }


  //
  // Version paths
  //
  var versions =
  {
    'unreleased': '../winjs/unreleased/',
    '3.0(CDN)': '//cdnjs.cloudflare.com/ajax/libs/winjs/3.0.0/',
    '2.1': '../winjs/2.1/',
    '2.0': '../winjs/2.0/',
    'none': ''
  };

  //
  // Populate select dropdowns
  //
  var selectHTML = '';
  for (var i in versions)
  {
    if (!versions[i])
    {
      selectHTML += '<option>' + i + '</option>';
    }
    else
    {
      selectHTML += '<option>' + i + ' dark' + '</option>';
      selectHTML += '<option>' + i + ' light' + '</option>';
    }
  }
  selectControlLeft.innerHTML = selectHTML;
  selectControlRight.innerHTML = selectHTML;

  //
  // Add javascript
  //
  function addJavascript(version, iframe)
  {
    // Load base file
    var mainJSFile = iframe.contentDocument.createElement('script');
    mainJSFile.src = versions[version] + 'js/base.js';

    // Add additional ui file
    var ui = iframe.contentDocument.createElement('script');
    ui.src = versions[version] + 'js/ui.js';

    // Initialize WinJS when the main script loads
    mainJSFile.onload = function()
    {
      iframe.contentDocument.head.appendChild(ui);
    };

    ui.onload = function()
    {
      if (!iframe.contentWindow.WinJS)
      {
        console.warn('WinJS failed to load, skipping initialization', '(' + version + ')')
        return;
      }

      if (iframe.contentWindow.scriptLoaded)
        iframe.contentWindow.scriptLoaded();

      iframe.contentWindow.WinJS.Navigation.history.backStack = [{}];
      iframe.contentWindow.WinJS.UI.processAll();

      if (iframe.contentWindow.initialize)
        iframe.contentWindow.initialize();
    };

    iframe.contentDocument.head.appendChild(mainJSFile);
  }

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
          if (droppedStyles[index])
          {
            var style = iframe.contentDocument.createElement('style');
            style.innerHTML = droppedStyles[index];
            style.id = 'winjs-stylesheet';
            iframe.contentDocument.head.appendChild(style);
            addJavascript(version, iframe);
          }
          else if (versions[version])
          {
            var style = iframe.contentDocument.createElement('link');
            style.rel = 'stylesheet';
            style.href = versions[version] + 'css/ui-' + theme + '.css';
            style.id = 'winjs-stylesheet';
            iframe.contentDocument.head.appendChild(style);
            var imgHack = iframe.contentDocument.createElement('img');
            imgHack.onerror = function() { addJavascript(version, iframe); };
            imgHack.src = style.href;
          }

          // Add base stylesheet
          var style = iframe.contentDocument.createElement('link');
          style.rel = 'stylesheet';
          style.href = '../style-iframe.css';
          iframe.contentDocument.head.appendChild(style);
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
    droppedStyles[0] = null;
    update(iframes[0].src, parts[0], parts[1], 0);
  });
  selectControlRight.addEventListener('change', function()
  {
    var parts = selectControlRight.value.split(' ');
    droppedStyles[1] = null;
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
  var initialUrl = window.location.hash || '#AppBar';
  var parts = selectControlLeft.value.split(' ');
  var src = document.querySelector('a[href="' + initialUrl + '"]').getAttribute('data-link');
  update(src, parts[0], parts[1]);
});
