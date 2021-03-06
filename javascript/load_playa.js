$(document).ready(function(){
  $(".playa").each(function(i){
    var element = this;
    var playa; 
    $(this).find(".playlist").each(function(){
      if(this.value){
        playa = Playa.setup(element.id, Playlist.initWithJSON(this.value));
      }else{
        playa = Playa.setup(element.id, Playlist.initWithHTML(this));
      }

      $(this).find(".track").each(function(i){
        $(this).bind("click", function(event){
          playa.stop();
          playa.gotoTrack(i);
          playa.play();
          event.preventDefault()
        });
      });
    });


    $(this).find(".play").each(function(){
      $(this).bind("click", function(e){
        playa.play();
      });
    });

    $(this).find(".pause").each(function(){
      $(this).bind("click", function(e){
        playa.pause();
      });
    });

    $(this).find(".stop").each(function(){
      $(this).bind("click", function(e){
        playa.stop(); 
      });
    });

    $(this).find(".next").each(function(){
      $(this).bind("click", function(e){
        playa.gotoNext();
      });
    });

    $(this).find(".previous").each(function(){
      $(this).bind("click", function(e){
        playa.gotoPrevious();
      });
    });
  });
  FlashInterface.pageInit();
});


