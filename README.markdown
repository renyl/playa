# What it is

Playa is a javascript class that communicates with a media-streaming swf. 
The script looks for Playas defined in the dom and prepares a Playa instance
in javascript to control each playlist. No javascript is required by the user
to create a working Playa. Callbacks are available for Playa events,
and of course you can use javascript to manage the page just as you always can.

No matter the number of Playas in the dom, there will only ever be one teeny-tiny swf.
If you do not require any particular fanciness in the event callback department, there
is no need for you to write even a single byte of javascript. Dead simple, degrades
gracefully, low overhead. Just the way a Playa oughta roll.

# Try it out

go into a hosted directory (e.g. ~/Sites on a mac)

    $ git clone git://github.com/whtevn/Playa.git

and then direct your browser to the resulting folder

or just go check out what that is going to look like
[here](http://newqdev.com/playa/Playa.html)

I am aware that the visuals on that example are not particularly impressive. 
I am not aiming to prove that css works with html. It does. I promise.

nicer examples to come when they come. or if one of you nice folk would
like to make an example playa, I would be more than happy to display it here
and attribute it to you in whatever way seems most fitting to your particular 
sensibilities.

# Current behavior

a Playa has access to these actions:

- play
- pause
- next
- previous
- stop

## Play, pause, and stop with multiple Playas

pushing play in one Playa starts playing whatever the current track
in that player.

pushing play in another player after a player has started
pauses the current player (retaining playhead)

the new player will start playing at whatever track and
playhead it has stored (track 1 time 0 by default, of course)

pushing play in the original player pauses the now
current player (retaining playhead) and resumes play at the held
place of the original player


## Advancing the track

Pushing `next` or `previous` while playing will play the `next` or `previous` track

If currently on the first or last track and playing, and `next` or `previous` takes
it back to itself, play will stop. This is the same behavior as itunes. Blame them.

If another Playa is playing, pushing `next` or `previous` advances the playlist to
the appropriate place, but does not alter current play. If that Playa is later played,
the updated playhead will be used.


## Using Playa

### require the necessary js files (including jquery)

    <script type="text/javascript" src="javascript/jquery-1.3.2.min.js" /></script>
    <script type="text/javascript" src="javascript/flash_interface.js" /></script>
    <script type="text/javascript" src="javascript/Playa.js" /></script>

### embed the swf

    <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
          id="Playa" width="0" height="0"
          codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">
      <param name="movie" value="Playa.swf" />
      <param name="allowScriptAccess" value="sameDomain" />
      <embed src="script/Playa.swf" quality="high" bgcolor="#869ca7"
        width="0" height="0" name="Playa" 
        play="true" loop="false" quality="high" allowScriptAccess="sameDomain"
        type="application/x-shockwave-flash"
        pluginspage="http://www.macromedia.com/go/getflashplayer">
      </embed>
    </object>

### set up a player using predefined classes

Giving an element the class "Playa" will cause a number of hooks to be
added to the subsequent elements. Elements classed as `play`, `pause`, 
`stop`, `previous`, `next`, `playlist`, `display`, and `track` are used
by Playa. 

you can make your playlist in html
  
    <ul class="Playa" id="first_instance">
      <li class="play">play</li>
      <li class="pause">pause</li>
      <li class="stop">stop</li>
      <li class="previous">previous</li>
      <li class="next">next</li>
      <li>
        <ul class="playlist">
          <li>
            <a class="track" href="resources/01.mp3">song 1</a>
          </li>
          <li>
            <a class="track" href="resources/02.mp3">song 2</a>
          </li>
        </ul>
      </li>
    </ul>

or by putting json in the `value` attribute of the `class="playlist"` element

    <ul class="Playa" id="second_instance">
      <li class="play">play</li>
      <li class="pause">pause</li>
      <li class="stop">stop</li>
      <li class="previous">previous</li>
      <li class="next">next</li>
      <input type="hidden"
             class="playlist"
             value="['resources/06.mp3',
                     {url: 'resources/07.mp3'}]"
       />
    </ul>

Only the `url` attribute is used if an object literal is passed in the
value array. If you would like to use some other attribute (`image`, perhaps),
you are more than welcome.

### Defining playlists with html

the 'track' designator can be on any element, but if it does not
have a href attribute (as above), then it requires an anchor tag
as one of its children

e.g.
    <ul class="playlist">
      <li class="track">
        <a href="resources/01.mp3">song 1</a>
        <img src="resources/01.jpg" />
      </li>
      <li class="track">
        <a href="resources/02.mp3">song 2</a>
        <img src="resources/02.jpg" />
      </li>
    </ul>


### marking the active track

the `active` attribute is put alongside the `track` attribute when a
song becomes active in a particular Playa. Activity is triggered when
a song becomes the current track for a Playa.

e.g.

    <li class="track active">
      <a href="resources/01.mp3">song 1</a>
      <img src="resources/01.jpg" />
    </li>

or

    <li>
      <a class="track active" href="resources/01.mp3">song 1</a>
      <img src="resources/01.jpg" />
    </li>


# Callbacks

callbacks are available for the following events:

- doOnPlay
- doOnPause
- doOnStop
- doOnGotoNext
- doOnGotoPrevious
- doOnPlayNext
- doOnPlayPrevious
- doOnActivateTrack
- doWhilePlaying

callbacks are set in a jquery $(document).ready() function, and will
look something like this:

    	$(document).ready(function(){
          Playa.get["first_instance"]["doWhilePlaying"] = function(){
            playheadDisplay = (this.playhead/1000).toFixed(0)+"/"+(this.trackTime/1000).toFixed(0);
            this.updateDisplay(playheadDisplay);
          };

          Playa.get["first_instance"]["doOnStop"] = function(){
            this.updateDisplay("0/"+(this.trackTime/1000).toFixed(0));
          };
      }); 

where `first_instance` is the id of the Playa you are addressing.

currently, callbacks do nothing on default. I plan to concoct some sort of defaults,
however, as long as I can convince myself they will be generally useful.

Also, there is currently no easy way to set a particular callback for all players on
the page, although this is also in the works.

## a few special notes on callbacks

although most of the callbacks are pretty straightforward, two of them bare a little
explanation. `doWhilePlaying` and `doOnActivateTrack` are slightly different animals
than the other ones.

### doWhilePlaying

`doWhilePlaying` runs continuously once play is started. If you want to establish 
a playhead, or do something else repeatedly while a song is playing, this is where it would go. The interval span is 100ms. If this is unnacceptable to you, overwriting the
`startDoingWhilePlaying` (which, unsurprisingly, starts the `doWhilePlaying` method)
method to accommodate your needs would look exactly like writing any other callback.


### doOnActivateTrack

`doOnActivateTrack` fires for every element in a playlist on track change. This 
callback uses two arguments. The first is the track element which is currently
being discussed, and the second is a boolean value indicating whether the current
element is or is not the active track. Writing a `doOnActivateTrack` callback would 
look like this

        Playa.get["first_instance"]["doOnActivateTrack"] = function(element, active){
          if(active == true){
            $(element).removeClass("hide")
          }else{
            $(element).addClass("hide")
          }
        };

