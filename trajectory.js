class Trajectory
{
    constructor(element)
    {
        this.scale = 1.6;
        this.element = element;
        this.ctx = element.getContext('2d');
        this.points =[];
        this.vec = [];
        this.vecs = [];
        this.notesNum;
        this.lineWidth = 5;
        this.guideWidth = 15;
        this.notesSize = 15;
        this.guideColor = "rgba(0, 0, 255, 0.2)";
    }
    move(x,y)
    {
        console.log("x :" + x);
        console.log("y :" + y);

        this.new_x = x;
        this.new_y = y;

        this.points.push([this.new_x,this.new_y]);
        this.ctx.beginPath();
        this.points.forEach(point=>{
            this.temp_x = point[0];
            this.temp_y = point[1];

            this.ctx.lineTo(this.temp_x, this.temp_y);
            this.ctx.moveTo(this.temp_x, this.temp_y);
        });
        this.ctx.strokeStyle = "red" ;
        this.ctx.lineWidth = this.lineWidth ;
        this.ctx.stroke();
    }
    down(x,y)
    {
        console.log("   x :" + x);
        console.log("   y :" + y);
        this.points.push([ x , y ]);
    }
    up()
    {
        this.points = [];
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.vecs.shift();
        this.drawVec();
    }
    setScale(scale)
	{
		this.scale = scale;
    }
    setVec(vecs)
	{
        this.vecs = [];
        this.temp_vec = [];
        this.temp_points = [];
		this.count = 0;
        this.max = vecs.length;
        this.notesNum = vecs.filter(vec => vec.length).length;
        
		while( this.count < this.max ){
            this.temp_points = vecs[this.count];
			if(!this.temp_points.length){
                this.vecs.push(this.temp_vec);
                this.temp_vec = [];
                this.count += 1;
			}else{
                this.temp_vec.push(this.temp_points); 
                this.count += 1;				
            }
        }
        if(this.temp_vec.length){
            this.vecs.push(this.temp_vec);
        }
        this.vecs = this.vecs.filter(vec => vec.length);
        console.log(this.vecs);
        this.drawVec();
	}
    drawVec()
    {
        this.ctx.clearRect(0, 0, this.element.width, this.element.height);
        this.ox = 400 * this.scale;
        this.oy = 80 * this.scale;

        var count = 0;
        var max = this.vecs.length;
        var temp_points = [];
        var temp_count = 0;
        var temp_max = 0;

        while( count < max ){
            temp_points = this.vecs[count];
            temp_max = temp_points.length;
            this.old_x = temp_points[0][0] * this.scale + this.ox;
            this.old_y = temp_points[0][1] * this.scale + this.oy;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.old_x,this.old_y);
            while( temp_count < temp_max ){
                this.new_x = temp_points[temp_count][0] * this.scale + this.ox;
                this.new_y = temp_points[temp_count][1] * this.scale + this.oy;

                this.ctx.lineTo(this.new_x, this.new_y);
                
                this.old_x = this.new_x;
                this.old_y = this.new_y;
                temp_count += 1;
            }
            this.ctx.strokeStyle = this.guideColor;
            this.ctx.lineWidth = this.guideWidth*this.scale ;
            this.ctx.lineCap = "round";
            this.ctx.linejoin = "round";
            this.ctx.stroke();
            temp_count = 0;
            count += 1;
        }
        //this.drawNumNotes();
    }
    drawNumNotes()
    {
        var max;
        var temp_points;
        var temp_max;

        var copyVecs = Object.create(this.vecs);

        max = copyVecs.length;
        var new_x, new_y;
        var l = 60;

        while( max > 0 ){
            temp_points = Object.create(copyVecs[max-1]);
            temp_max = temp_points.length;
            while( temp_max > 0 ){
                new_x = temp_points[temp_max-1][0] * this.scale + this.ox;
                new_y = temp_points[temp_max-1][1] * this.scale + this.oy;
                
                this.setNotes(new_x, new_y, l);
                this.setNumber(new_x, new_y, temp_max);

                temp_max -= 1;
            }
            l -= 15;
            max -= 1;
        }
    }
    setNotes(x,y,l)
    {
        this.ctx.beginPath () ;
        this.ctx.arc( x, y, this.notesSize*this.scale, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
        this.ctx.fillStyle = "hsl(180, 75%," + l + "%)" ;
        this.ctx.fill() ;

        this.ctx.strokeStyle = "#d2d4d4" ;
        this.ctx.lineWidth = this.notesSize / 10 * this.scale;
        this.ctx.stroke() ;
    }
    setNumber(x,y,num)
    {
        this.ctx.beginPath () ;
        this.ctx.font = "bold 32px Arial, meiryo, sans-serif" ;
        this.ctx.fillStyle = "#ffffff" ;
        this.ctx.fillText( num, x, y, 100*this.scale, 100*this.scale ) ;
    }
}