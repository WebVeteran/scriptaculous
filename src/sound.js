// script.aculo.us sound.js v1.8.3, Sat Dec 13 02:12:00 +0500 2008

// Copyright (c) 2005-2008 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
//
// Based on code created by Jules Gravinese (http://www.webveteran.com/)
//
// script.aculo.us is freely distributable under the terms of an MIT-style license.
// For details, see the script.aculo.us web site: http://script.aculo.us/


// Set up a random ID for our soundboard
randID = 'scriptaculous-soundboard'+Math.floor(Math.random()*1000000000);
      
Sound = {
  tracks: {},
  _enabled: true,
  template:
    new Template('<embed style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>'),
  soundboard:
    new Template('<div id="'+randID+'" style="visibility:hidden;"/>'),
  enable: function(){
    Sound._enabled = true;
  },
  disable: function(){
    Sound._enabled = false;
  },
  play: function(url){
  
    // Is the soundboard created yet?
    if (!$(randID)) {
      $$('body')[0].insert( 
	      new Element('div',{
	        id: randID,
	        style: 'visibility:hidden;'
	      })
	  );
	  // All sounds will play from this soundboard
    }
    
    if(!Sound._enabled) return;
    var options = Object.extend({
      track: 'global', url: url, replace: false
    }, arguments[1] || {});
    
    if(options.replace && this.tracks[options.track]) {
      $R(0, this.tracks[options.track].id).each(function(id){
        var sound = $('sound_'+options.track+'_'+id);
        sound.Stop && sound.Stop();
        sound.remove();
      });
      this.tracks[options.track] = null;
    }
      
    if(!this.tracks[options.track])
      this.tracks[options.track] = { id: 0 };
    else
      this.tracks[options.track].id++;
      
    options.id = this.tracks[options.track].id;
    $(randID).insert( 
      Prototype.Browser.IE ? new Element('bgsound',{
        id: 'sound_'+options.track+'_'+options.id,
        src: options.url, loop: 1, autostart: true
      }) : Sound.template.evaluate(options));
  }
};

if(Prototype.Browser.Gecko && navigator.userAgent.indexOf("Win") > 0){
  if(navigator.plugins && $A(navigator.plugins).detect(function(p){ return p.name.indexOf('QuickTime') != -1 })) {
    Sound.template = new Template('<object id="sound_#{track}_#{id}" width="0" height="0" type="audio/mpeg" data="#{url}"/>');
    Sound.soundboard = new Template('<div id="'+randID+'" style="visibility:hidden;"/>');
  } else {
    Sound.play = function(){};
  }
}

// Remove the soundboard when leaving
window.onbeforeunload = function() {
	if ($(randID)) {
		document.body.removeChild($(randID));
	}
} 
