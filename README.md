BTClip
======

BTClip is a tool to share public links to large files synced with tools like BitTorrent Sync.

BTClip allows you to share files with users that do not have BitTorrent Sync installed, by syncing a local folder to a webserver and generating the public URL to the file on the webserver.


How to use
----------
  Say you want to generate a public URL to a file in a synced folder. In this example /home/starquake/BTSync/Public is synced with a folder on a webserver: http://example.org/public_files

  1. Run the app.

  2. Open the settings menu (using the button on the upper right)

  3. Set the local path to <code>/home/starquake/BTSync/Public</code>

  4. Set the public URL to <code>http://example.org/public_files</code>

  5. Drag a file (For example the file <code>/home/starquake/BTSync/Public/Pictures/FunnyPicture.jpg</code>) from the synced folder and drop it onto the dashed square in the BTClip window

  6. BTClip puts the public URL on the clipboard (in this case the result would be <code>http://example.org/public_files/Pictures/FunnyPicture.jpg</code>)

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
