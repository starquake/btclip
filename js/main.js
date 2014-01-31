// Load native UI library
var gui = require('nw.gui');
var os = require("os");
var clipboard = gui.Clipboard.get();

var holderEl = document.getElementById('holder');

var basePathEl = document.getElementById("basePath");
var baseUrlEl = document.getElementById("baseUrl");

var basePathExample = document.getElementById("basePathExample");
switch (os.platform()) {
    case 'win32':
        basePathExample.innerHTML = 'C:\\Users\\John\\BTSync\\Public\\';
        break;
    case 'darwin':
        basePathExample.innerHTML = '/Users/John/BTSync/Public/';
        break;
    default: // linux
        basePathExample.innerHTML = '/home/john/BTSync/Public/';
}


// Read previous values
basePathEl.value = localStorage.basePath || "";
baseUrlEl.value = localStorage.baseUrl || "";

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// prevent default behavior from changing page on dropped file
window.ondragover = function (e) {
    e.preventDefault();
    return false
};
window.ondrop = function (e) {
    e.preventDefault();
    return false
};


holderEl.ondragover = function () {
    this.className = 'hover';
    return false;
};
holderEl.ondragend = function () {
    this.className = '';
    return false;
};
holderEl.ondrop = function (e) {
    e.preventDefault();
    this.className = '';

    for (var i = 0; i < e.dataTransfer.files.length; ++i) {
        var originalFullPath = e.dataTransfer.files[i].path;
        var relativePath = originalFullPath.replace(new RegExp("^" + escapeRegExp(basePathEl.value), "g"), '');
        if (os.platform() === 'win32') {
            relativePath = relativePath.replace('\\', '/');
        }
        var newUrl = baseUrlEl.value + relativePath;

        console.log(originalFullPath + ' -> ' + newUrl);
        clipboard.set(newUrl, 'text');
    }
    return false;
};

gui.Window.get().on('close', function () {
    localStorage.basePath = basePathEl.value;
    localStorage.baseUrl = baseUrlEl.value;
    this.close(true);
});
