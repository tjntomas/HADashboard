Test for updating the HADashboard camera widget, only recommended to test this if you are a patient person. This is not for regular use.

Just place all files in your custom_widgets folder.
There are two config options:
````
  fullscreen_timeout: 3  # Timeout in seconds. Defaults to 30 seconds
  nofullscreen: "on"       # This will turn off the full screen function. 
````

This it how it is supposed to work:

* With no config options: Click on the image will enter fullscreen and go back after 30 seconds.
* With fullscreen_timeout: 3. Goes back after 3 seconds
* With nofullscreen: "on". Does nothing
* Click or touch while in fullscreen: Goes back and resets any running timeout.

Please try it out and post any issues here so we can get it working in all browsers.
