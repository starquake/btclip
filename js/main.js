// Load native UI library
var gui = require('nw.gui');
var os = require("os");
var clipboard = gui.Clipboard.get();

var holderEl = document.getElementById('holder');

var pathDelimiter = '/';
var basePathEl = document.getElementById("basePath");
var baseUrlEl = document.getElementById("baseUrl");
var basePathExampleEl = document.getElementById("basePathExample");
var openBasePathEl = document.getElementById("openBasePath");


switch (os.platform()) {
    case 'win32':
        basePathExampleEl.innerHTML = 'C:\\Users\\John\\BTSync\\Public\\';
        pathDelimiter = '\\';
        break;
    case 'darwin':
        basePathExampleEl.innerHTML = '/Users/John/BTSync/Public/';
        break;
    default: // linux
        basePathExampleEl.innerHTML = '/home/john/BTSync/Public/';
}


// Read previous values
basePathEl.value = localStorage.basePath || "";
baseUrlEl.value = localStorage.baseUrl || "";

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

openBasePathEl.onclick = function (e) {
    if (basePathEl.value.slice(-1) !== pathDelimiter) {
        basePathEl.value = basePathEl.value + pathDelimiter;
    }
    gui.Shell.showItemInFolder(basePathEl.value);
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
        if (baseUrlEl.value.slice(-1) !== '/') {
            baseUrlEl.value = baseUrlEl.value + '/';
        }

        var newUrl = baseUrlEl.value + encodeURI(relativePath);

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
