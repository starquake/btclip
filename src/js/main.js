/* global window:false, XMLHttpRequest:false */
(function ($) {
    "use strict";


// Load native UI library
    var gui = require('nw.gui');
    var os = require("os");
    var path = require("path");
    var clipboard = gui.Clipboard.get();

    // let's cache some jquery selectors
    var $basePath = $("#basePath"),
        $baseUrl = $("#baseUrl"),
        $basePathExample = $("#basePathExample"),
        $openBasePath = $("#openBasePath"),
        $holder = $('#holder'),
        $settingsMenu = $('#settingsMenu'),
        $window = $(window);

    switch (os.platform()) {
        case 'win32':
            $basePathExample.html('C:\\Users\\John\\BTSync\\Public\\');
            break;
        case 'darwin':
            $basePathExample.html('/Users/John/BTSync/Public/');
            break;
        default: // linux
            $basePathExample.html('/home/john/BTSync/Public/');
            break;
    }


// Read previous values
    $basePath.val(localStorage.basePath || "");
    $baseUrl.val(localStorage.baseUrl || "");

    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    $openBasePath.on('click', function () {
        $basePath.val(path.normalize($basePath.val()));
        $basePath.val(path.dirname($basePath.val() + path.sep + '.'));
        gui.Shell.openItem($basePath.val());
    });

// prevent default behavior from changing page on dropped file
    $window.on('dragover', function (e) {
        e.preventDefault();
        return false;
    });
    $window.on('drop', function (e) {
        e.preventDefault();
        return false;
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

            $basePath.val(path.normalize($basePath.val()));
            $basePath.val(path.dirname($basePath.val() + path.sep + '.'));

            if ($baseUrl.val() && $baseUrl.val().slice(-1) !== '/') {
                $baseUrl.val($baseUrl.val() + '/');
            }

            if (originalFullPath.toUpperCase().indexOf($basePath.val().toUpperCase()) === 0) {
                var pathRE;

                if (os.platform() === 'win32') {
                    pathRE = new RegExp("^" + escapeRegExp($basePath.val()), "gi");
                } else {
                    pathRE = new RegExp("^" + escapeRegExp($basePath.val()), "g");
                }

                var relativePath = originalFullPath.replace(pathRE, '');

                if (os.platform() === 'win32') {
                    relativePath = relativePath.replace(/\\/g, '/');
                }

                relativePath = relativePath.slice(1);

                var newUrl = $baseUrl.val() + encodeURI(relativePath);
                urls.push(newUrl);

                console.log(originalFullPath + ' -> ' + newUrl);

            } else {
                console.log(originalFullPath + ' not in ' + $basePath.val() + ', skipping...');
            }

        }
        if (urls.length > 0) {
            clipboard.clear();
            clipboard.set(urls.join(os.EOL), 'text');
        }

        return false;
    });

    if (!($basePath.val() && $baseUrl.val())) {
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

    gui.Window.get().on('close', function () {
        localStorage.basePath = $basePath.val();
        localStorage.baseUrl = $baseUrl.val();
        this.close(true);
    });

})(jQuery, window);