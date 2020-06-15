class Background {

	constructor(element)
	{
		this.scale = 1.5;

		this.element = element;
		this.context = element.getContext('2d');


		this.a_type = 0;
		this.h_type = 1;
		this.s_type = 2;
		this.k_type = 3;
	}

	setScale(scale)
	{
		this.scale = scale;
	}

	draw()
	{
		this.buttons = [];

		this.ox = 350 * this.scale;
		this.oy = 80 * this.scale;
		this.gridx = 60 * this.scale;
		this.gridy = 50 * this.scale;

		this.x0 = this.gridx * 0;
		this.x1 = this.gridx * 1;
		this.x2 = this.gridx * 2;
		this.x3 = this.gridx * 3;
		this.x4 = this.gridx * 4;
		this.x5 = this.gridx * 5;

		this.y0 = this.gridy * 0;
		this.y1 = this.gridy * 1;
		this.y2 = this.gridy * 2;
		this.y3 = this.gridy * 3;
		this.y4 = this.gridy * 4;
		this.y5 = this.gridy * 5;
		this.y6 = this.gridy * 6;

		this.context.clearRect(0, 0, this.element.width, this.element.height);

	    // 縦軸
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
	    this.context.font = "16px 'Times New Roman'";
	    this.context.fillText("a", 250 * this.scale + this.ox,  184 * this.scale + this.oy);
	    this.context.fillText("i",  75 * this.scale + this.ox,   73 * this.scale + this.oy);
	    this.context.fillText("u",  71 * this.scale + this.ox,  184 * this.scale + this.oy);
	    this.context.fillText("e", 160 * this.scale + this.ox,  113 * this.scale + this.oy);
	    this.context.fillText("o", 160 * this.scale + this.ox,  224 * this.scale + this.oy);
	    this.context.fillText("F1 [Hz]", 125 * this.scale + this.ox,  350 * this.scale + this.oy);
	    this.context.save();
	    this.context.rotate(-Math.PI / 2);
	    this.context.fillText("F2 [Hz]", -165 * this.scale - this.oy,  -40 * this.scale + this.ox);
	    this.context.restore();

	    // X軸
	    this.context.fillText(   "0",  -4 * this.scale + this.ox, 320 * this.scale + this.oy);
	    this.context.fillText( "200",  48 * this.scale + this.ox, 320 * this.scale + this.oy);
	    this.context.fillText( "400", 108 * this.scale + this.ox, 320 * this.scale + this.oy);
	    this.context.fillText( "600", 168 * this.scale + this.ox, 320 * this.scale + this.oy);
	    this.context.fillText( "800", 228 * this.scale + this.ox, 320 * this.scale + this.oy);
	    this.context.fillText("1000", 284 * this.scale + this.ox, 320 * this.scale + this.oy);

	    // Y軸
	    this.context.fillText("3000", -30 * this.scale + this.ox,   6 * this.scale + this.oy);
	    this.context.fillText("2500", -30 * this.scale + this.ox,  56 * this.scale + this.oy);
	    this.context.fillText("2000", -30 * this.scale + this.ox, 106 * this.scale + this.oy);
	    this.context.fillText("1500", -30 * this.scale + this.ox, 156 * this.scale + this.oy);
	    this.context.fillText("1000", -30 * this.scale + this.ox, 206 * this.scale + this.oy);
	    this.context.fillText( "500", -23 * this.scale + this.ox, 256 * this.scale + this.oy);
	    this.context.fillText(   "0", -17 * this.scale + this.ox, 306 * this.scale + this.oy);

	    // 母音
	    this.context.fillStyle = 'rgb(20, 20, 255)';
	    this.context.beginPath();
	    var size = 4 * this.scale;
	    this.context.arc((800 / 1000 * 300) * this.scale + this.ox, (300 - 1200 / 3000 * 300) * this.scale + this.oy, size, 0, 2 * Math.PI);
	    this.context.fill();
	    this.context.beginPath();
	    this.context.arc((500 / 1000 * 300) * this.scale + this.ox, (300 - 1900 / 3000 * 300) * this.scale + this.oy, size, 0, 2 * Math.PI);
	    this.context.fill();
	    this.context.beginPath();
	    this.context.arc((300 / 1000 * 300) * this.scale + this.ox, (300 - 2300 / 3000 * 300) * this.scale + this.oy, size, 0, 2 * Math.PI);
	    this.context.fill();
	    this.context.beginPath();
	    this.context.arc((300 / 1000 * 300) * this.scale + this.ox, (300 - 1200 / 3000 * 300) * this.scale + this.oy, size, 0, 2 * Math.PI);
	    this.context.fill();
	    this.context.beginPath();
	    this.context.arc((500 / 1000 * 300) * this.scale + this.ox, (300 -  800 / 3000 * 300) * this.scale + this.oy, size, 0, 2 * Math.PI);
	    this.context.fill();

/*
	    var l1 = document.getElementById("l1");
	    var l2 = document.getElementById("l2");
	    var l3 = document.getElementById("l3");
	    var r1 = document.getElementById("r1");
	    var s1 = document.getElementById("s1");
	    l1.style.left  = Math.floor(this.ox + 385 * this.scale) + "px";
	    l1.style.top   = Math.floor(this.oy + 275 * this.scale) + "px";
	    l1.style.width = Math.floor(100 * this.scale) + "px";
	    l2.style.left  = Math.floor(this.ox + 350 * this.scale) + "px";
	    l2.style.top   = Math.floor(this.oy + 290 * this.scale) + "px";
	    l2.style.width = Math.floor(100 * this.scale) + "px";
	    l3.style.left  = Math.floor(this.ox + 440 * this.scale) + "px";
	    l3.style.top   = Math.floor(this.oy + 290 * this.scale) + "px";
	    l3.style.width = Math.floor(100 * this.scale) + "px";
	    r1.style.left  = Math.floor(this.ox + 350 * this.scale) + "px";
	    r1.style.top   = Math.floor(this.oy + 310 * this.scale) + "px";
	    r1.style.width = Math.floor(100 * this.scale) + "px";
	    s1.style.left  = Math.floor(this.ox + 350 * this.scale) + "px";
	    s1.style.top   = Math.floor(this.oy +   0 * this.scale) + "px";
	    s1.style.width = Math.floor(130 * this.scale) + "px";
*/
		background.addButton( 110,  20, "k", this.a_type);
		background.addButton( 110,  90, "s", this.h_type);
		background.addButton( 180, 90, "sy", this.h_type);
		background.addButton( 110, 160, "t", this.p_type);
		background.addButton( 110, 230, "h", this.s_type);
		background.addButton( 110, 300, "p", this.s_type);
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
			this.buttons[found].char;
		}

		return "";
	}

	addButton(x, y, char, consotype)
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

	    this.buttons.push({x:leftX + x * this.scale, y:this.oy + (y-10) * this.scale, char:char, consotype:consotype});
	}

	drawVec(vec)
	{
		this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ox = 400 * this.scale;
		this.oy = 80 * this.scale;

		var max = vec.length;
		var count = 0;

		this.old_x = vec[0][0] * this.scale + this.ox;
        this.old_y = vec[0][1] * this.scale + this.oy;
		
		this.ctx.beginPath();
		this.ctx.moveTo(this.old_x,this.old_y);
		while( count <= max ){
			this.new_x = vec[count][0];
			this.new_y = vec[count][1];

			this.ctx.lineTo(this.new_x, this.new_y);
			
			this.old_x = this.new_x;
			this.old_y = this.new_y;
			count += 1;
		}
	}
	setVec(vecs)
	{
		this.vecs = [];
		var begin = 0, end = 0;;
		var temp_vec = [];
		var count = 0;
		var max = vecs.length;

		while( count <= max ){
			temp_vec = vecs[count];
			if(!temp_vec.length){
				this.vecs.push(temp_vec.slice(begin,end));
				temp_vec = vecs.slice(begin,end);
				begin = end;
				count += 1;
			}else{
				count += 1;
				end += 1;				
			}
		}
	}
	drawVec()
    {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ox = 400 * this.scale;
        this.oy = 80 * this.scale;
        this.skip = false;
        this.number = 0;
        
        if(!this.vec.length){
            return false;
        }
        this.old_x = this.vec[0][0] * this.scale + this.ox;
        this.old_y = this.vec[0][1] * this.scale + this.oy;

        this.vec.forEach(point=>{
            if(!point.length){
                this.skip = true;
            }else{
                this.number += 1;
                
                this.temp_x = point[0];
                this.temp_y = point[1];
                this.temp_x = this.temp_x * this.scale + this.ox;
                this.temp_y = this.temp_y * this.scale + this.oy;

                this.ctx.beginPath();
                this.ctx.moveTo(this.old_x,this.old_y);
                if(this.skip){
                    this.skip = false;
                    this.ctx.moveTo(this.temp_x, this.temp_y);
                    this.setNotes(this.temp_x, this.temp_y);
                    this.setNumber(this.temp_x, this.temp_y,this.number);
                    this.old_x = this.temp_x;
                    this.old_y = this.temp_y;
                    return true;
                }
                this.ctx.lineTo(this.temp_x, this.temp_y);
                this.old_x = this.temp_x;
                this.old_y = this.temp_y;

                this.ctx.strokeStyle = this.guideColor;
                this.ctx.lineWidth = this.guideWidth*this.scale ;
                this.ctx.lineCap = "round";
                this.ctx.linejoin = "round";
                this.ctx.stroke();

                this.setNotes(this.temp_x, this.temp_y);
                this.setNumber(this.temp_x, this.temp_y,this.number);

                console.log("drawVec!!!!!!!");
            }
        });
        this.number = 0;
    }
}
