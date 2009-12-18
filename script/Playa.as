package
{	import flash.display.Sprite;
	import flash.events.*;
	import flash.external.ExternalInterface;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.net.URLRequest;
	import flash.utils.Timer;
	
	public class Playa2 extends Sprite
	{
		private var sound:Sound;
		private var channel:SoundChannel;
		private var url:String;
		private var trackTimer:Timer = new Timer(500);
		
		public function Playa2()
		{
			if (ExternalInterface.available) {
				try {
					ExternalInterface.addCallback("play", play);
					ExternalInterface.addCallback("stop", stop);
					ExternalInterface.addCallback("playheadPosition", playheadPosition);
				} catch (error:SecurityError) {
					trace("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					trace("An Error occurred: " + error.message);
				}
			} else {
				trace("External interface is not available for this container.");
			}
		}
		private function playheadPosition(num:Number=-1):Number{
			if(num == -1){
				num = channel.position/1000; 
			}
			return(num);
		}
		
		private function soundCompleteHandler(event:Event):void {
			ExternalInterface.call("Playa.current.trackFinished()");
		}
		
		private function updateTrackTime(timer:TimerEvent):void{
			var duration:Number = (sound.bytesTotal / (sound.bytesLoaded / sound.length));
			ExternalInterface.call("Playa.current.setTrackTime("+duration/1000+")");
		}
		
		private function play(address:String, position:Number, timeEstablished:Boolean):void {
			var req:URLRequest = new URLRequest(address);
			var newSound:Sound = new Sound();
			
			ExternalInterface.call("Playa.pauseAll()");
			
			try {
				sound = newSound;
				sound.load(req);
				channel = sound.play(position*1000);
				
				trackTimer.addEventListener(TimerEvent.TIMER, updateTrackTime);
				trackTimer.start();
				channel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
			}
			
			catch (err:Error) {
				ExternalInterface.call("alert", err.message);
				
			}
			
			
		}
				
		private function stop():void {
			try{
				channel.stop();
				trackTimer.stop();
				trackTimer.removeEventListener(TimerEvent.TIMER, updateTrackTime);
			}catch(err:Error){}
		}
		
		private function checkJavaScriptReady():Boolean {
			var isReady:Boolean = ExternalInterface.call("FlashInterface.isReady()");
			return isReady;
		}
	}
	
	
}