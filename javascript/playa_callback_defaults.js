Playa.callbackDefault = {
  play: function(playa){},
  pause: function(playa){},
  stop: function(playa){
    playa.doOn.updatePlayhead(playa)
  },
  gotoNext: function(playa){},
  gotoPrevious: function(playa){},
  playNext: function(playa){},
  playPrevious: function(playa){},
  activateTrack: function(playa){
    playa.doOn.updateCSS(playa);
    playa.doOn.updatePlayhead(playa);
  },
  playing: function(playa){
    playa.doOn.updatePlayhead(playa); 
  },
  updatePlayhead: function(playa){
    if(playa.trackTime){
      var playheadDisplay = (playa.playhead);
      playheadDisplay = playheadDisplay +"/"+ playa.trackTime;
      $("#"+playa.name +" .display").each(function(i){
        $(this).text(playheadDisplay);
      })
    }
  },
  updateCSS: function(playa){
    $("#"+playa.name +" .track").each(function(i){
      if(i == playa.currentTrack){
        $(this).addClass("active");
      }else{
        $(this).removeClass("active");
      }
    });
  }
};

