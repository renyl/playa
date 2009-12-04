# What it is

Playa is a javascript class that communicates with an media-streaming swf. 
The script looks for Playas defined in the dom, and prepares a Playa instance
in javascript to control each playlist. No javascript is required to create a
Playa instance.

No matter the number of Playas in the dom, there will only ever be one teeny-tiny swf.
If you do not require any particular fanciness in the event callback department, there
is no need for you to write even a single byte of javascript. Dead simple, degrades
gracefully, low overhead. Just the way a playa oughta roll.

# Try it out

go into a hosted directory (e.g. ~/Sites on a mac)

    $ git clone git://github.com/whtevn/playa.git

and then direct your browser to the resulting folder

or just go check out what that is going to look like
[here](http://newqdev.com/playa/Playa.html)

# Current behavior

a playa has access to these actions:

- play
- pause
- next
- previous
- stop

## Play, pause, and stop with multiple Playas

pushing play in one playa starts playing whatever the current track
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

If another playa is playing, pushing `next` or `previous` advances the playlist to
the appropriate place, but does not alter current play. If that Playa is later played,
the updated playhead will be used.


## Using Playa

### require the necessary js files (including jquery)

    <script type="text/javascript" src="javascript/jquery-1.3.2.min.js" /></script>
    <script type="text/javascript" src="javascript/flash_interface.js" /></script>
    <script type="text/javascript" src="javascript/playa.js" /></script>

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

Giving an element the class "playa" will cause a number of hooks to be
added to the subsequent elements. Elements classed as `play`, `pause`, 
`stop`, `previous`, `next`, `playlist`, `display`, and `track` are used
by Playa. 

you can make your playlist in html
  
    <ul class="playa" id="first_instance">
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

or by putting json in the 'value' attribute of the class="playlist" element

    <ul class="playa" id="second_instance">
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

the "active" attribute is put alongside the "track" attribute when a
song becomes active in a particular playa.


# Callbacks

There are currently none.
