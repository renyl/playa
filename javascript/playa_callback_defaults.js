Playa.callbackDefault = {
  stop: function(playa){
    this.updatePlayhead(playa);
  },
  activateTrack: function(playa){
    this.updatePlayhead(playa);
    this.updateCSS(playa)
  },
  playing: function(playa){
    this.updatePlayhead(playa); 
  },
  updatePlayhead: function(playa){
    var playheadDisplay = "track #"+(playa.currentTrackNumber+1)+": "
    if(playa.trackTime){
      playheadDisplay += playa.playhead+"/"+ playa.trackTime;
    }else{
      playheadDisplay += "0/0"
    }
    $("#"+playa.name +" .display").each(function(i){
      $(this).text(playheadDisplay);
    })
  },
  updateCSS: function(playa){
    $("#"+playa.name +" .track").each(function(i){
      if(i == playa.currentTrack()){
        $(this).addClass("active");
      }else{
        $(this).removeClass("active");
      }
    });
  }
};

