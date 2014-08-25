BTClip
======

BTClip is a tool to share public links to large files synced with tools like BTSync or OwnCloud.


How to use
----------
  Say you want to sync a folder (in this example /home/starquake/BTSync/Public) with a folder on a webserver (in this example http://example.org/public_files)

  1. Run the app.

  2. Open the settings menu (using the button on the upper right)

  3. Set the local path to /home/starquake/BTSync/Public

  4. Set the public URL to http://example.org/public_files

  5. Drag a file from the local folder onto the dashed square in the BTClip window.

  6. BTClip puts the public URL on the clipboard

  7. Paste the URL in your favorite email editor or instant messaging app.

This program uses node-webkit, for more information look here:

  *  https://github.com/rogerwang/node-webkit/wiki/How-to-run-apps#wiki-all-platforms

Build Instructions
------------------

* Install NodeJS: http://nodejs.org/

* Open up a shell in the project folder

* run npm install

* Install bower: <code>npm install bower -g</code>

* Install grunt: <code>npm install grunt-cli -g</code>

* Run the default grunt task: <code>grunt</code>

* If everything went well you can find the binaries in builds/releases/BTClip