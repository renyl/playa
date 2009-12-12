Playa.callbackDefault = {
  stop: function(playa){
    playa.doOn.updatePlayhead(playa);
  },
  activateTrack: function(playa){
    playa.doOn.updatePlayhead(playa);

    $("#"+playa.name +" .track").each(function(i){
      if(i == playa.currentTrack){
        $(this).addClass("active");
      }else{
        $(this).removeClass("active");
      }
    });
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
};

