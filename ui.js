class UI {

	constructor(element)
	{
		this.scale = 1.5;

		this.canvas = element;
		this.element = element;
		this.context = element.getContext('2d');

		// setup voice modules
		window.AudioContext = window.webkitAudioContext || window.AudioContext;
		this.audioContext = new AudioContext();

		this.out = this.audioContext.createGain();
		this.out.gain.value = 1.5;
		this.out.connect(this.audioContext.destination);

		var vf = new VowelFilter(this.audioContext, this.out);
		var noise = new Noise(this.audioContext);
		var fnoise = new LPFNoise(this.audioContext);

		this.vowel = new VoicePad(new Voice(this.audioContext, "a", vf, noise, fnoise, this.out));
		this.conso = {};
		this.conso["h" ] = new Htype_VoiceButton("h" , new Voice(this.audioContext, "h" ,  vf, noise, fnoise, this.out));
		this.conso["s" ] = new Stype_VoiceButton("s" , new Voice(this.audioContext, "s" ,  vf, noise, fnoise, this.out));
		this.conso["sy"] = new Stype_VoiceButton("sy", new Voice(this.audioContext, "sy",  vf, noise, fnoise, this.out));
		this.conso["t" ] = new Ptype_VoiceButton("t" , new Voice(this.audioContext, "t" ,  vf, noise, fnoise, this.out));
		this.conso["k" ] = new Ptype_VoiceButton("k" , new Voice(this.audioContext, "k" ,  vf, noise, fnoise, this.out));
		this.conso["p" ] = new Ptype_VoiceButton("p" , new Voice(this.audioContext, "p" ,  vf, noise, fnoise, this.out));
		this.conso["cy"] = new Stype_VoiceButton("cy", new Voice(this.audioContext, "cy",  vf, noise, fnoise, this.out));
		this.conso["ts"] = new Stype_VoiceButton("ts", new Voice(this.audioContext, "ts",  vf, noise, fnoise, this.out));

		for (var c in this.conso) {
			this.vowel.addConso(this.conso[c]);
			this.conso[c].addVowel(this.vowel);
		}


		this.getInitialData();
	}

	setConso(ch, data)
	{
		this.conso[ch].voice.level   = data.level / 100.0;
		this.conso[ch].voice.attack  = data.attack / 1000.0;
		this.conso[ch].voice.hold    = data.hold / 1000.0;
		this.conso[ch].voice.hold    = data.decay / 1000.0;
		this.conso[ch].voice.hold    = data.sustainLevel / 100.0;
		this.conso[ch].voice.hold    = data.sustainTime / 1000.0;
		this.conso[ch].voice.release = data.release / 1000.0;
		this.conso[ch].voice.vowel_delay = data.vdelay / 1000.0;
		this.conso[ch].voice.boost.gain.value = data.boost;
		if (this.conso[ch].voice.consoFilter != null) {
			this.conso[ch].voice.consoFilter.frequency.type = data.filter_type;
			this.conso[ch].voice.consoFilter.frequency.value = data.filter_freq;
			this.conso[ch].voice.consoFilter.Q.value = data.filter_q;
		}
	}

	getInitialData()
	{
		const xhr = new XMLHttpRequest();
		xhr.open('GET', './voicedata.json');
		xhr.onload = () => {
			const json = JSON.parse(xhr.response);

			const v = json.state.vowel_param;
			this.vowel.voice.level   = v.level   / 100.0;
			this.vowel.voice.attack  = v.attack  / 1000.0;
			this.vowel.voice.release = v.release / 1000.0;

			const c = json.conso_params;
			this.setConso('h', c['h']);
			this.setConso('s', c['s']);
			this.setConso('sy',c['sy']);
			this.setConso('p', c['p']);
			this.setConso('k', c['k']);
			this.setConso('t', c['t']);
			this.setConso('cy',c['cy']);
			this.setConso('ts',c['ts']);

			document.querySelector('#timestamp').innerText = 'data update: ' + json.state.timestamp;
		};
		xhr.send();
	}


	setScale(scale)
	{
		this.scale = scale;
	}

	draw()
	{
		this.ox = global_gridX;
		this.oy = global_gridY;

		this.x0 = grid_width * 0;
		this.x1 = grid_width * 1;
		this.x2 = grid_width * 2;
		this.x3 = grid_width * 3;
		this.x4 = grid_width * 4;
		this.x5 = grid_width * 5;
		this.xlen = this.x5 - this.x0;

		this.y0 = grid_height * 0;
		this.y1 = grid_height * 1;
		this.y2 = grid_height * 2;
		this.y3 = grid_height * 3;
		this.y4 = grid_height * 4;
		this.y5 = grid_height * 5;
		this.y6 = grid_height * 6;
		this.ylen = this.y6 - this.y0;

		this.context.clearRect(0, 0, this.element.width, this.element.height);

		// 縦軸
		this.context.fillStyle = "rgba(0, 0, 0)"
		this.context.beginPath();
		this.context.moveTo(this.x0 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x0 + this.ox, this.y6 + this.oy);
		this.context.moveTo(this.x1 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x1 + this.ox, this.y6 + this.oy);
		this.context.moveTo(this.x2 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x2 + this.ox, this.y6 + this.oy);
		this.context.moveTo(this.x3 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x3 + this.ox, this.y6 + this.oy);
		this.context.moveTo(this.x4 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x4 + this.ox, this.y6 + this.oy);
		this.context.moveTo(this.x5 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y6 + this.oy);
		this.context.stroke();

		// 横軸
		this.context.beginPath();
		this.context.moveTo(this.x0 + this.ox, this.y0 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y0 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.y1 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y1 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.y2 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y2 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.y3 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y3 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.y4 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y4 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.y5 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.y5 + this.oy);
		this.context.moveTo(this.x0 + this.ox, this.x5 + this.oy);
		this.context.lineTo(this.x5 + this.ox, this.x5 + this.oy);
		this.context.stroke();

		// ラベル
		var fontsize = String(Math.floor(26 * this.scale));
		this.context.font = fontsize + "px 'Times New Roman'";
		this.context.fillText("a", grid_width * 4.1 + this.ox, grid_height * 3.6 + this.oy);
		this.context.fillText("i", grid_width * 1.3 + this.ox, grid_height * 1.4 + this.oy);
		this.context.fillText("u", grid_width * 1.3 + this.ox, grid_height * 3.65+ this.oy);
		this.context.fillText("e", grid_width * 2.6 + this.ox, grid_height * 2.2 + this.oy);
		this.context.fillText("o", grid_width * 2.6 + this.ox, grid_height * 4.4 + this.oy);
		this.context.fillText("F1 [Hz]", grid_width * 2+ this.ox,  grid_height * 7+ this.oy);
		this.context.save();
		this.context.rotate(-Math.PI / 2);
		this.context.fillText("F2 [Hz]", - grid_width * 2.8 - this.oy,  -grid_height * 1 + this.ox);
		this.context.restore();

		// X軸
		this.context.fillText(   "0",-grid_width * .05  + this.ox, grid_height * 6.6 + this.oy);
		this.context.fillText( "200", grid_width * .85  + this.ox, grid_height * 6.6 + this.oy);
		this.context.fillText( "400", grid_width * 1.85 + this.ox, grid_height * 6.6 + this.oy);
		this.context.fillText( "600", grid_width * 2.85 + this.ox, grid_height * 6.6 + this.oy);
		this.context.fillText( "800", grid_width * 3.85 + this.ox, grid_height * 6.6 + this.oy);
		this.context.fillText("1000", grid_width * 4.8  + this.ox, grid_height * 6.6 + this.oy);

		// Y軸
		this.context.fillText("3000",-grid_width * .6 + this.ox, grid_height * .1   + this.oy);
		this.context.fillText("2500",-grid_width * .6 + this.ox, grid_height * 1.05 + this.oy);
		this.context.fillText("2000",-grid_width * .6 + this.ox, grid_height * 2.05 + this.oy);
		this.context.fillText("1500",-grid_width * .6 + this.ox, grid_height * 3.05 + this.oy);
		this.context.fillText("1000",-grid_width * .6 + this.ox, grid_height * 4.05 + this.oy);
		this.context.fillText( "500",-grid_width * .6 + this.ox, grid_height * 5.05 + this.oy);
		this.context.fillText(   "0",-grid_width * .6 + this.ox, grid_height * 6.1  + this.oy);

		// 母音
		this.context.fillStyle = 'rgb(20, 20, 255)';
		this.context.beginPath();
		var size = 5 * this.scale;
		//a
		this.context.arc(grid_width * 4.0 + this.ox, grid_height * 3.6 + this.oy, size, 0, 2 * Math.PI);
		this.context.fill();
		this.context.beginPath();
		//e
		this.context.arc(grid_width * 2.5 + this.ox, grid_height * 2.2 + this.oy, size, 0, 2 * Math.PI);
		this.context.fill();
		this.context.beginPath();
		//i
		this.context.arc(grid_width * 1.5 + this.ox, grid_height * 1.4 + this.oy, size, 0, 2 * Math.PI);
		this.context.fill();
		this.context.beginPath();
		//u
		this.context.arc(grid_width * 1.5 + this.ox, grid_height * 3.65+ this.oy, size, 0, 2 * Math.PI);
		this.context.fill();
		this.context.beginPath();
		//o
		this.context.arc(grid_width * 2.5 + this.ox, grid_height * 4.4 + this.oy, size, 0, 2 * Math.PI);
		this.context.fill();


		// this.addButton(  30, 40, "p");
		// this.addButton( 100, 40, "t");
		// this.addButton( 230, 40, "k");

		// this.addButton( 100, 140, "ts");
		// this.addButton( 170, 140, "cy");

		// this.addButton( 100, 240, "s");
		// this.addButton( 170, 240, "sy");
		// this.addButton( 280, 240, "h");

	}

	checkPad(x, y)
	{
		x -= this.ox;
		y -= this.oy;
		if ((x >= this.x0) && (x <= this.x5)
		&&  (y >= this.y0) && (y <= this.y6)) {
			return true;
		}
		return false;
	}

	checkButton(x, y)
	{
		var found = -1;

		var rsize = 30 * this.scale;
		for (var i in this.buttons)
		{
			if ((x > this.buttons[i].x - rsize) && (x < this.buttons[i].x + rsize)
			&& (y > this.buttons[i].y - rsize) && (y < this.buttons[i].y + rsize)) {
				if (found >= 0) {
					if (this.buttons[i].x < this.buttons[found].x) {
						found = i;
					}
				} else {
					found = i;
				}
			}
		}
		if (found >= 0) {
			return this.buttons[found];
		}

		return null;
	}

	addButton(x, y, char)
	{
		this.context.fillStyle = 'rgb(0, 0, 0)';
		var leftX = 30 * this.scale;
		var charX = x - char.length * 6;

		this.context.font = (24 * this.scale) + "px 'Times New Roman'";
		var rsize = 30 * this.scale;
		this.context.fillText(char, leftX + charX * this.scale,  (y + 5) * this.scale + this.oy);
		this.context.beginPath();
		this.context.arc(leftX + x * this.scale, y * this.scale + this.oy, rsize, 0, 2 * Math.PI);
		this.context.stroke();

		this.buttons.push(
			{x:leftX + x * this.scale, y:this.oy + (y-10) * this.scale, char:char, voice:this.conso[char]});
	}

}
