var ui;
var trajectory;
var canvas1;
var canvas2;
var canvas3;
var app;
var init = false;
var isTouchDevice = false;

class App {
	setEvent(elem)
	{
		elem.addEventListener('mousemove', ev =>
		{
			if (isTouchDevice) return;
			this.moveCallback(ev, ev.clientX, ev.clientY);
		});
		elem.addEventListener('touchmove', ev =>
		{
			// loop
			this.moveCallback(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
		});

		elem.addEventListener('mousedown', ev =>
		{
			if (isTouchDevice) return;
			this.downCallback(ev, ev.clientX, ev.clientY);
		});
		elem.addEventListener('touchstart', ev =>
		{
			isTouchDevice = true;
			this.downCallback(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
		});

		elem.addEventListener('mouseup', ev =>
		{
			if (isTouchDevice) return;
			this.upCallback(ev, ev.clientX, ev.clientY);
		});
		elem.addEventListener('touchend', ev =>
		{
			this.upCallback(ev, ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
		});
	}

	downCallback(ev, cx, cy)
	{
		ev.preventDefault();
		var rect = ev.target.getBoundingClientRect();
		var x = cx - rect.left;
		var y = cy - rect.top;
		if (ui.checkPad(x, y)) {
			x -= ui.ox;
			y -= ui.oy;
			var px = x / ui.xlen;
			var py = 1.0 - y / ui.ylen;
			ui.vowel.down(px, py);
			trajectory.down(cx - rect.left, cy - rect.top );
			return;
		}

		var conso = ui.checkButton(x, y);
		if (conso != null) {
			conso.voice.down();
		}

	}

	upCallback(ev, cx, cy)
	{
		ev.preventDefault();
		var rect = ev.target.getBoundingClientRect();
		var x = cx - rect.left;
		var y = cy - rect.top;

		var conso = ui.checkButton(x, y);
		if (conso != null) {
			conso.voice.up();
			return;
		}

		ui.vowel.up();
		trajectory.up();

	}

	moveCallback(ev, cx, cy)
	{
		if (!ui.vowel.isDown()) {
			return;
		}
		ev.preventDefault();
		var rect = ev.target.getBoundingClientRect();
		var x = cx - rect.left;
		var y = cy - rect.top;
		if (ui.checkPad(x, y)) {
			x -= ui.ox;
			y -= ui.oy;
			var px = x / ui.xlen;
			var py = 1.0 - y / ui.ylen;
			//VoicePad.move(x,y)
			ui.vowel.move(px, py);
			trajectory.move(cx - rect.left, cy - rect.top);
		}
	}

}


document.addEventListener('touchstart', ev =>
{
	touchToStart();
});

document.addEventListener('mousedown', ev =>
{
	touchToStart();
});
//START PROGRAM
function touchToStart()
{
	if (!init)
	{
		init = true;

		document.getElementById('init').style.display = 'none';
		document.getElementById("forms").style.visibility = "visible"

		canvas1 = document.getElementById('canvas1');
		canvas2 = document.getElementById('canvas2');
		canvas3 = document.getElementById('canvas3');

		sentenceForm = document.getElementById("forms");

		var scaleX = window.innerWidth / 800;
		var scaleY = window.innerHeight / 500;
		var scale = Math.min(scaleX, scaleY);

		ui = new UI(canvas1);
		ui.setScale(scale);
		ui.draw();

		trajectory = new Trajectory(canvas3);
		trajectory.setScale(scale);
		
		app = new App();
		app.setEvent(canvas1);
		app.setEvent(canvas3);

		//Form Posted
		sentenceForm.addEventListener("submit", event => {
			event.preventDefault();
			let newSentence = document.forms.forms.sentence.value;
			trail = toTrail(toRoman(newSentence));
			// console.log(trail.filter(Boolean));
			// console.log(toRoman(newSentence));
			trajectory.setVec(trail.filter(Boolean));
		})


		window.onresize();
	}
};


var timer;
window.onresize = () =>
{
	if (timer > 0) {
		clearTimeout(timer);
	}

	timer = setTimeout(() =>
	{
		var scaleX = window.innerWidth / 800;
		var scaleY = window.innerHeight / 500;
		var scale = Math.min(scaleX, scaleY);

		canvas1.setAttribute("width", window.innerWidth.toString());
		canvas1.setAttribute("height", window.innerHeight.toString());
		canvas2.setAttribute("width", window.innerWidth.toString());
		canvas2.setAttribute("height", window.innerHeight.toString());
		canvas3.setAttribute("width", window.innerWidth.toString());
		canvas3.setAttribute("height", window.innerHeight.toString());
		sentenceForm.style.bottom = window.innerHeight.toString()*0.8;
		sentenceForm.style.right = window.innerWidth.toString()*0.6;

		if (ui != null)
		{
			ui.setScale(scale);
			trajectory.setScale(scale);
			ui.draw();
			trajectory.drawVec();
		}
		console.log("timeout....");
	}, 200);

};


