/* global window:false, XMLHttpRequest:false */
(function ($) {
    "use strict";

    // Load native UI libraries
    var gui = require('nw.gui');
    var os = require("os");
    var path = require("path");
    var clipboard = gui.Clipboard.get();

    var BTClip = (function () {

        var $fileDialog = $('#fileDialog'),
            $basePath = $("#basePath"),
            $baseUrl = $("#baseUrl"),
            $basePathExample = $("#basePathExample"),
            $selectBasePath = $("#selectBasePath"),
            $openBasePath = $("#openBasePath"),
            $holder = $('#holder'),
            $settingsMenu = $('#settingsMenu'),
            _basePath,
            _baseUrl;

        function init() {

            switch (os.platform()) {
                case 'win32':
                    $basePathExample.html('C:\\Users\\John\\BTSync\\Public\\');
                    break;
                case 'darwin':
                    $basePathExample.html('/Users/John/BTSync/Public/');
                    initMac();
                    break;
                default: // linux
                    $basePathExample.html('/home/john/BTSync/Public/');
                    break;
            }

            // Read previous values
            _basePath = localStorage.basePath || "";
            _baseUrl = localStorage.baseUrl || "";
            $basePath.val(_basePath);
            $baseUrl.val(_baseUrl);

            $selectBasePath.on('click', handleSelectBasePathClick);
            $openBasePath.on('click', handleOpenBasePathClick);

            // prevent default behavior from changing page on dropped file
            $(window).on('dragover', function (e) {
                e.preventDefault();
                return false;
            });
            $(window).on('drop', function (e) {
                e.preventDefault();
                return false;
            });

            $(window).on('load', function () {
                gui.Window.get().show();
            });

            $holder.on('dragover', function () {
                this.className = 'hover';
                return false;
            });

            $holder.on('dragend', function () {
                this.className = '';
                return false;
            });

            $holder.on('drop', function (e) {
                e.preventDefault();
                this.className = '';
                var urls = [];
                for (var i = 0; i < e.originalEvent.dataTransfer.files.length; ++i) {
                    var originalFullPath = e.originalEvent.dataTransfer.files[i].path;
                    updateBasePath();
                    updateBaseUrl();

                    if (originalFullPath.toUpperCase().indexOf(_basePath.toUpperCase()) === 0) {
                        var pathRE;

                        if (os.platform() === 'win32') {
                            pathRE = new RegExp("^" + escapeRegExp(_basePath), "gi");
                        } else {
                            pathRE = new RegExp("^" + escapeRegExp(_basePath), "g");
                        }

                        var relativePath = originalFullPath.replace(pathRE, '');

                        if (os.platform() === 'win32') {
                            relativePath = relativePath.replace(/\\/g, '/');
                        }

                        //relativePath = relativePath.slice(1);

                        var newUrl = _baseUrl + encodeURI(relativePath);
                        urls.push(newUrl);

                        console.log(originalFullPath + ' -> ' + newUrl);

                    } else {
                        console.log(originalFullPath + ' not in ' + _basePath + ', skipping...');
                    }

                }
                if (urls.length > 0) {
                    clipboard.clear();
                    clipboard.set(urls.join(os.EOL), 'text');
                }

                return false;
            });

            if (!(_basePath && _baseUrl)) {
                $settingsMenu.popover({
                    placement: 'bottom',
                    content: "You haven't set your Local path and Public URL yet. Please configure your settings.",
                    trigger: 'manual'
                });
                $settingsMenu.popover('show');
            } else {
                $settingsMenu.popover('hide');
            }

            $settingsMenu.click(function () {
                $settingsMenu.popover('hide');
            });

            $fileDialog.change(function(){
                var v = $(this).val();
                $basePath.val(v);
                updateBasePath();
            });


        }

        function initMac() {
            var mb = new gui.Menu({type: "menubar"});
            var win = gui.Window.get();

            mb.createMacBuiltin("BTClip");
            win.menu = mb;

            win.focus();

            // Show window when hidden using close button
            gui.App.on('reopen', function() {
              win.show(); // show the window again.
              win.focus();
            });
        }

        function handleSelectBasePathClick() {
            $fileDialog.trigger('click');
        }
        function handleOpenBasePathClick() {
            updateBasePath();
            gui.Shell.openItem(_basePath);
        }

        function updateBasePath() {
            _basePath = $basePath.val();
            _basePath = path.normalize(_basePath + path.sep + '.');
            //_basePath = path.dirname(_basePath + path.sep + '.');
            _basePath = _basePath + path.sep;
            $basePath.val(_basePath);
        }

        function updateBaseUrl() {
            _baseUrl = $baseUrl.val();
            if (_baseUrl && _baseUrl.slice(-1) !== '/') {
                _baseUrl = _baseUrl + '/';
            }
            $baseUrl.val(_baseUrl);
        }

        function terminate(w) {
            localStorage.basePath = $basePath.val();
            localStorage.baseUrl = $baseUrl.val();
            w.close(true);
        }

        function escapeRegExp(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }


        // Expose public functions
        return {
            init: init,
            terminate: terminate
        };

    }());


    BTClip.init();

    gui.Window.get().on('close', function (action) {
        if(os.platform() !== 'darwin' || action === 'quit') {
          // When not on OS X or the application is closed using the dock icon we terminate the application
          BTClip.terminate(this);
        } else {
          // When on OS X and the close button is clicked, we hide the window and keep running
          this.hide();
        }
    });


})(jQuery);
