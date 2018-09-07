AudioContext = window.AudioContext || window.webkitAudioContext,
audioCtx = new AudioContext(),
oscillator = audioCtx.createOscillator(),
gainNode = audioCtx.createGain();
oscillator.start(0);
gainNode.gain.value = 0;
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);

$(window).resize(function(){
$('.rapPiano').each(function(){
	this.Render();
});
});
	
(function($){
$.fn.jsRapPiano = function(options){

return this.each(function(){
	
	this.opt = $.extend({
		octave:3,
		octaves:2,
		waveLength:0.5,
		waveType:'square',
		onClick:null
	},options);
	let base = this;
	oscillator.type = this.opt.waveType;
	
	this.Render = function(){
		$(this).empty();
		let w = $(this).width();
		w = w / (this.opt.octaves * 7);
		$(this).addClass('rapPiano').height(w * 5);
		let i = 12 * (this.opt.octave + 1);
		for(let o = 0;o < this.opt.octaves;o++)
			for(let x = 0;x < 7;x++){
				let k = $('<div>').addClass('divKey').css({width:w}).appendTo(this);
				$('<div>').addClass('major').prop('index',i++).appendTo(k);
				if((x % 7 == 2) || (x % 7 == 6))continue;
				$('<div>').addClass('minor').prop('index',i++).appendTo(k);
			}
		$('.major,.minor',this).bind({
			mousedown:function(e){
				let i = $(this).prop('index');
				let f =440 * Math.pow(2,(i - 69) / 12);
				base.PlaySound(f);
				if(base.opt.onClick)
					base.opt.onClick.call(base);
			}
		});	
	}
	
	this.PlaySound = function(frequency){
		oscillator.frequency.value = frequency;
		gainNode.gain.setValueAtTime(1,0);
		gainNode.gain.setTargetAtTime(0,audioCtx.currentTime,this.opt.waveLength);
	}
	
	this.Render();

})

}})(jQuery);