var ui;
// var trajectory;
var canvas1;
var canvas2;
var canvas3;
var app;
var init = false;
var isTouchDevice = false;
var lastRender = 0
var scale = 2;
var width;
var height;
var state;
var tmpX;
var tmpY;
var touchingTime = 0;
var tractCtx;

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

		tmpX = x;
		tmpY = y;
		state.touchStatus.isTouch = true;

		if (ui.checkPad(x, y)) {
			x -= ui.ox;
			y -= ui.oy;
			var px = x / ui.xlen;
			var py = 1.0 - y / ui.ylen;
			ui.vowel.down(px, py);
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

		tmpX = x;
		tmpY = y;
        state.touchStatus.isTouch = false;
		state.touchStatus.isMove = false;
		
		var conso = ui.checkButton(x, y);
		if (conso != null) {
			conso.voice.up();
			return;
		}

		ui.vowel.up();
		// trajectory.up();

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

		tmpX = x;
		tmpY = y;
        state.touchStatus.isMove = true;

		if (ui.checkPad(x, y)) {
			x -= ui.ox;
			y -= ui.oy;
			var px = x / ui.xlen;
			var py = 1.0 - y / ui.ylen;
			//VoicePad.move(x,y)
			ui.vowel.move(px, py);
			// trajectory.move(cx - rect.left, cy - rect.top);
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

		window.onresize = resize;
        resize() ;

		document.getElementById('init').style.display = 'none';
		document.getElementById("forms").style.visibility = "visible"

		canvas1 = document.getElementById('canvas1');
		canvas2 = document.getElementById('canvas2');
		canvas3 = document.getElementById('canvas3');
		tractCtx = canvas3.getContext("2d");

		sentenceForm = document.getElementById("forms");

		var scaleX = window.innerWidth / 800;
		var scaleY = window.innerHeight / 500;
		var scale = Math.min(scaleX, scaleY);

		ui = new UI(canvas1);
		ui.setScale(scale);
		ui.draw();

		// trajectory = new Trajectory(canvas3);
		// trajectory.setScale(scale);
		
		app = new App();
		app.setEvent(canvas1);
		app.setEvent(canvas3);

		window.requestAnimationFrame(loop);

		state = {
            x: (width / 2),
            y: (height / 2),
            pressedKeys: {
            left: false,
            right: false,
            up: false,
            down: false
            },
            touchStatus: {
                isTouch: false,
                isMove: false,
			},
			canvasStatus: {
				isDrawing : false
			}
        }

		//Form Posted
		sentenceForm.addEventListener("submit", event => {
			event.preventDefault();
			let select = document.getElementById("sentence");
			let sentence = select.value
			let sentence_data = "data_" + sentence;
			if(sentence != null){
				state.canvasStatus.isDrawing = true;
				ManageNotes.ReadNotes(eval(sentence_data));
			}
			console.log(sentence);

		})


		window.onresize();
	}
};
//フレーム毎処理
function loop(timestamp) {
    window.requestAnimationFrame(loop);
    var progress = timestamp - this.lastRender;

    update(timestamp,progress);
    draw();
	
    lastRender = timestamp;
}
//変数更新
function update(timestamp,progress) {
    if (state.touchStatus.isTouch) {
        touchingTime += progress;
    }
    if (state.touchStatus.isTouch || state.touchStatus.isMove) {
        state.x = tmpX;
        state.y = tmpY;
    }
    if (!state.touchStatus.isTouch) {
        console.log("touchingTime : " + touchingTime*0.001);
        // touchingTime = 0;
	}
	ManageNotes.setScale(scale);
    ManageNotes.updateNotes(timestamp,state)
}
//描画
function draw() {
	tractCtx.clearRect(0, 0, canvas3.width, canvas3.height);
	if(state.canvasStatus.isDrawing){
		// console.log("draw");
		ManageNotes.drawLine(tractCtx);
	}
	ManageNotes.drawScore(tractCtx);
	// if isTouch drawJudge()
	if(!state.touchStatus.isTouch){
		ManageNotes.drawJudge(tractCtx);
		tractCtx.fillStyle = "rgba(200,245,245 ,1)";
		tractCtx.font=( 28*scale + "px Arial");
		tractCtx.textAlign = "center";
		let text = touchingTime.toPrecision(3)*0.001 + "s"
		tractCtx.fillText(text, 200, 100);
	}
	//マウス軌道
	// console.log("X: " + state.x + "  Y: " + state.y);
	if(state.touchStatus.isTouch){
		tractCtx.strokeStyle = "rgba(120,144,156 ,0.2)";
		tractCtx.fillStyle = "rgba(176,190,197 ,0.1)";
		tractCtx.lineWidth = 10 * scale * 0.4;
		tractCtx.beginPath() ;
		tractCtx.arc(state.x, state.y, 15*scale, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
		tractCtx.closePath();
		tractCtx.stroke();
		tractCtx.fill();
	}
}
var timer;
var resize = function (){
	if (timer > 0) {
		clearTimeout(timer);
	}

	timer = setTimeout(() =>
	{
		var scaleX = window.innerWidth / 800;
		var scaleY = window.innerHeight / 500;
		scale = Math.min(scaleX, scaleY);

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
			// trajectory.setScale(scale);
			ui.draw();
			// trajectory.drawVec();
		}
		console.log("timeout...." + scale);
	}, 200);
};


