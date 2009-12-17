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
    var playheadDisplay = "track #"+(playa.playlist.humanTrackNumber())+": ";
    var track = playa.playlist.currentTrack();

    playheadDisplay += track.playhead+"/"+ track.time;

    $("#"+playa.name +" .display").each(function(i){
      $(this).text(playheadDisplay);
    })
  },
  updateCSS: function(playa){
    $("#"+playa.name +" .track").each(function(i){
      if(playa.playlist.onTrack(i)==true){
        $(this).addClass("active");
      }else{
        $(this).removeClass("active");
      }
    });
  }
};

