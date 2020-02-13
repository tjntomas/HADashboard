function basecamera(widget_id, url, skin, parameters)
{
    self = this

     // Initialization 

     self.parameters = parameters;

     self.widget_id = widget_id

     self.OnCameraClick = OnCameraClick

    // Added callback for the image element.
     var callbacks =
     [
        {"selector": '#' + widget_id + ' .img-frame', "action": "click", "callback": self.OnCameraClick}
     ]

    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate

     var monitored_entities =  
        [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate},
        ];

    // Some default values for fullscreen function.
    if ('nofullscreen' in self.parameters && self.parameters.nofullscreen == "on"){
        self.noFullScreen = true
    }
    self.seconds = 1000
    self.default_fullscream_timeout = 30

     // Call the parent constructor to get things moving

     WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks);

     self.index = 0;
    refresh_frame(self)
    self.timeout = undefined


    function OnCameraClick(self) 
    {
        try {clearTimeout(self.fs_timeout)} catch(err){}
        if (!self.noFullScreen){  // Only go to full screen if allowed by config.
            var root = document.documentElement

            // If not in fullscreen, open in fullscreen.
            if (!document.fullscreenElement){
                // Get the browser-specific fullscreen function.
                var fs = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen
                img = document.getElementById(self.widget_id).getElementsByClassName("img-frame")[0]
                fs.call(img)
                
                // Use supplied timeout interval if available.
                if ('fullscreen_timeout' in self.parameters){
                    self.fs_timeout = setTimeout(function() {OnCameraClick(self)}, self.parameters.fullscreen_timeout * self.seconds);
                } 
                // Or use the default timeout.
                else {
                    self.fs_timeout = setTimeout(function() {OnCameraClick(self)}, self.default_fullscream_timeout * self.seconds);
                }
            } else {
                // Try all broswer specific close functions.
                if (document.exitFullscreen){document.exitFullscreen()} 
                if (document.webkitExitFullscreen){document.webkitExitFullscreen()}
                if (document.mozCancelFullScreen){document.mozCancelFullScreen()}
                if (document.msExitFullscreen){document.msExitFullscreen()}
            }
        }
    }

    function refresh_frame(self)
    {
        if ("base_url" in self.parameters && "access_token" in self) {
            var endpoint = '/api/camera_proxy/'
            if ('stream' in self.parameters && self.parameters.stream) {
                endpoint = '/api/camera_proxy_stream/'
            }

             var url = self.parameters.base_url + endpoint + self.parameters.entity + '?token=' + self.access_token 
        } 
        else 
        {
            var url = '/images/Blank.gif'
        }

         if (url.indexOf('?') > -1)
        {
            url = url + "&time=" + Math.floor((new Date).getTime()/1000);
        }
        else
        {
            url = url + "?time=" + Math.floor((new Date).getTime()/1000);
        }
        self.set_field(self, "img_src", url);
        self.index = 0

         var refresh = 10
         if ('stream' in self.parameters && self.parameters.stream == "on") {
            refresh = 0
        }
        if ("refresh" in self.parameters)
        {
            refresh = self.parameters.refresh
        }
 
        if (refresh > 0)
        {
            clearTimeout(self.timeout)
            self.timeout = setTimeout(function() {refresh_frame(self)}, refresh * 1000);
        }

     }

     // Function Definitions

     // The StateAvailable function will be called when 
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state

     function OnStateAvailable(self, state)
    {   
        self.state = state.state;
        self.access_token = state.attributes.access_token
        refresh_frame(self)
    }

     // The OnStateUpdate function will be called when the specific entity
    // receives a state update - its new values will be available
    // in self.state[<entity>] and returned in the state parameter

     function OnStateUpdate(self, state)
    {
        self.state = state.state;
        self.access_token = state.attributes.access_token
        refresh_frame(self)
    }

 } 
