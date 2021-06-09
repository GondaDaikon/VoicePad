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
		document.getElementById("check_btn").style.visibility = "visible"

		canvas1 = document.getElementById('canvas1');
		canvas2 = document.getElementById('canvas2');
		canvas3 = document.getElementById('canvas3');
		tractCtx = canvas3.getContext("2d");

		sentenceForm = document.getElementById("forms");
		isChecked = document.getElementById("check_btn")

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
			let textbox = document.getElementById("textbox");
			let sentence = textbox.value
			console.log(sentence)
			if(sentence != null){
				sentence_roman = toRoman(sentence)
				sentence_foumants = toFoumants(sentence_roman)
				sentence_disp = Foumants2Disp(sentence_foumants)
				console.log(sentence_roman)
				console.log(sentence_foumants)
				console.log(sentence_disp)
				state.canvasStatus.isDrawing = true;
				// ManageNotes.ReadNotes(eval(sentence_data));
				ManageNotes.ReadNotes(sentence_disp);
			}
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
        //console.log(touchingTime*0.001);
        touchingTime = 0;
	}
	ManageNotes.setScale(scale);
	ManageNotes.updateNotes(timestamp,state)
	// console.log(timestamp*0.001);
}
//描画
function draw() {
	tractCtx.clearRect(0, 0, canvas3.width, canvas3.height);
	if(state.canvasStatus.isDrawing){
		// console.log("draw");
		ManageNotes.drawVec(tractCtx);
	}
	// ManageNotes.drawScore(tractCtx);
	// if isTouch drawJudge()
	if(!state.touchStatus.isTouch){
		//ManageNotes.drawJudge(tractCtx);
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
	//infomation disp
	if(isChecked.checked){
		let width, height;
		width = 740, height = 450;
		// info background
		tractCtx.fillStyle = "rgba(196,254,255,.5)"
		tractCtx.fillRect(20,20,width*scale,height*scale);
		tractCtx.globalCompositeOperation = "destination-out";
		// 子音ボタン：押しながら母音をなぞる
		tractCtx.fillStyle = "rgba(0, 0, 0)"
		tractCtx.fillRect(26*scale,80*scale,280*scale,180*scale);
		// 子音ボタン：押してる間ノイズ音が出る
		tractCtx.fillStyle = "rgba(0, 0, 0)"
		tractCtx.fillRect(90*scale,280*scale,260*scale,80*scale);
		// 母音パッド（なぞると声が出る）
		tractCtx.fillStyle = "rgba(0, 0, 0)"
		tractCtx.fillRect(390*scale,70*scale,320*scale,320*scale);
		tractCtx.globalCompositeOperation = "source-over";
		// 子音ボタン　説明
		let anchor_X,anchor_Y;
		anchor_X = 100, anchor_Y = 160;
		tractCtx.fillStyle = "rgba(225, 254, 255)"
		tractCtx.fillRect((anchor_X-10)*scale,(anchor_Y-30)*scale,160*scale,37*scale);
		tractCtx.fillStyle = "rgba(0,0,0)"
		tractCtx.font = (32*this.scale + "px x12y16pxMaruMonica");;
		tractCtx.fillText("子音ボタン：",anchor_X*scale,anchor_Y*scale)
		// 押しながらなぞると音が出る
		anchor_X = 30, anchor_Y = 195;
		tractCtx.fillStyle = "rgba(225, 254, 255)"
		tractCtx.fillRect((anchor_X-10)*scale,(anchor_Y-30)*scale,325*scale,37*scale);
		tractCtx.fillStyle = "rgba(0,0,0)"
		tractCtx.font = (32*this.scale + "px x12y16pxMaruMonica");;
		tractCtx.fillText("押しながらなぞると音が出る",anchor_X*scale,anchor_Y*scale)
		// 子音ボタン　押してるあいだ音が出る
		anchor_X = 40, anchor_Y = 385;
		tractCtx.fillStyle = "rgba(225, 254, 255)"
		tractCtx.fillRect((anchor_X-10)*scale,(anchor_Y-30)*scale,425*scale,37*scale);
		tractCtx.fillStyle = "rgba(0,0,0)"
		tractCtx.font = (32*this.scale + "px x12y16pxMaruMonica");;
		tractCtx.fillText("子音ボタン：押してるあいだ音が出る",anchor_X*scale,anchor_Y*scale)
		// 母音パッド　説明
		anchor_X = 380, anchor_Y = 240;
		tractCtx.fillStyle = "rgba(225, 254, 255)"
		tractCtx.fillRect((anchor_X-10)*scale,(anchor_Y-30)*scale,350*scale,37*scale);
		tractCtx.fillStyle = "rgba(0,0,0)"
		tractCtx.font = (32*this.scale + "px x12y16pxMaruMonica");;
		tractCtx.fillText("母音パネル：なぞると音が出る",anchor_X*scale,anchor_Y*scale)
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
		}
		console.log("timeout...." + scale);
	}, 200);
};


