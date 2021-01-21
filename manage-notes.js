//data_hoge =[[posX,posY,time(ms), isSetNotes],...]
//posX,posY   : ノーツ位置
//makeNotes(x, y, spawnTime(ms))

var ManageNotes = 
{
    loaddata : [],
    notesArray : [],
    now_line: 0,
    lineArray : [],
    isLineDraw : [],
    TappedEndNotes : true,
    TappedFirstNotes : true,
    isSeted : false,
    score : 0,
    scale : 2.0,
    gridx : 400,
    gridy : 80,

    ReadNotes : function(data)
    {
        console.log(data);
        this.loaddata = data;
        this.notesArray = [];
        this.lineArray = [];
        for(let i = 0; i < data.length; i++){
            this.notesArray.push(makeNotes(data[i][0], data[i][1], data[i][2]));
        }
        this.makeLine(this.notesArray);
    },
    makeLine : function(notesArray)
    {
        let tmpArray = [];
        let Array_end = notesArray.length - 1;
        this.TappedEndNotes = true;
        this.TappedFirstNotes = true;
        for(let i = 0; i < notesArray.length; i++){
            if(!notesArray[i].x){
                this.lineArray.push(tmpArray)
                tmpArray = [];
                i++;
            }
            tmpArray.push(notesArray[i]);
            if(i == Array_end){
                this.lineArray.push(tmpArray)
                tmpArray = [];
                i++;
            }
        }
        console.log(this.lineArray);
    },
    updateNotes : function(progress,state)
    {
        for(let i = 0; i < this.notesArray.length; i++){
            this.notesArray[i].hitNotes(progress,state);
        }
        for(let i = 0; i < this.notesArray.length; i++){
            if(!this.notesArray[i].isDone){
                this.notesArray[i].isNext = true;
                break;
            }
        }
        try{
            //Notes First Tapped+
            if(this.notesArray[0].isDone && this.TappedFirstNotes){
                console.log("FirstNotesTapped")
                this.TappedFirstNotes = false;
            }
            //Notes End Tapped+
            if(this.notesArray[this.notesArray.length-1].isDone && this.TappedEndNotes){
                console.log("EndNotesTapped")
                this.TappedEndNotes = false;
                let count=1
                let first_tapTime = this.notesArray[0].tapTime;
                this.notesArray.forEach((element) => {
                    let time = element.tapTime - first_tapTime
                    console.log(count +" : "+time*0.001);
                    // first_tapTime += time;
                    count++;
                })
                this.ReadNotes(this.loaddata);
            }
        } catch(e){}
        this.updateLine(this.lineArray);
    },
    updateLine : function(lineArray)
    {
        this.now_line = 0;
        for(let i = 0; i < lineArray.length; i++){
            let end = lineArray[i].length - 1;

            this.now_line = lineArray[i][end].isDone ? this.now_line+1 : this.now_line;
        }
    },
    drawVec : function(ctx)
    {
        for(let i=0; i< this.lineArray.length; i++)
        {
            let alpha;
            // 現在のライン
            if( i == this.now_line){
                alpha = 0.9;
            }
            // 次以降のライン
            if( i > this.now_line){
                alpha = 0.4;
            }
            if( i > this.now_line + 1){
                alpha = 0.2;
            }
            if( i > this.now_line + 2){
                alpha = 0.1;
            }
            // なぞり終えたライン
            if( i < this.now_line){
                alpha = 0;
            }
            // console.log("alpha : " + alpha)
            // console.log("now_line : " + this.lineArray[i])
            this.drawLine(ctx, this.lineArray[i],alpha)
        }
    },
    drawLine : function(ctx,Array,alpha)
    {
        let lineWidth = 5 * this.scale;

        let ps = [];
        Array.forEach((element) => {
            let tmp = {};
            tmp.x = (element.x * this.scale) + this.gridx
            tmp.y = (element.y * this.scale) + this.gridy
            ps.push(tmp)
            // element.draw(ctx,alpha)
        })
        // console.log(ps)
        let pointer = new Spline (ps)

        ctx.beginPath();
        for (let i = 0; i <= 1; i += .01) {
            let Pos = pointer.calc (i);
            ctx[i ? 'lineTo': 'moveTo'](Pos.x, Pos.y);
        }
        
        ctx.strokeStyle = "rgba(41,182,246," + alpha + ")";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        this.drawArrow(ctx, pointer,alpha);
    },
    drawArrow : function(ctx,pointer,alpha){
        let w = 10 * this.scale, h = 20 * this.scale,
            A = pointer.calc (.9), B = pointer.calc (1),
            {L,R} = this.arrowPos(A,B,w,h);

        ctx.beginPath();
        ctx.moveTo(L.x,L.y); //最初の点の場所
		ctx.lineTo(R.x,R.y); //2番目の点の場所
		ctx.lineTo(B.x,B.y); //3番目の点の場所
		ctx.closePath();	//三角形の最後の線 closeさせる

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(41,182,246," + alpha + ")"; //枠線の色
        ctx.fillStyle = "rgba(41,182,246," + alpha + ")"; //塗りつぶしの色
		
        // ctx.fill();
        ctx.stroke();
        // console.log("Arrow Draw!!")
    },
    arrowPos : function(A,B,w,h){
        let Vx= B.x-A.x,
            Vy= B.y-A.y,
            v = Math.sqrt(Vx*Vx+Vy*Vy),
            Ux= Vx/v,
            Uy= Vy/v,
            L = {},
            R = {};

        L.x= B.x - Uy*w - Ux*h;
        L.y= B.y + Ux*w - Uy*h;
        R.x= B.x + Uy*w - Ux*h;
        R.y= B.y - Ux*w - Uy*h;

        return {L: L, R: R};
    },

    old_drawLine : function(ctx,Array,alpha)
    {
        let lineWidth = 15 * this.scale,
        tmp_x, tmp_y, i = 0;

        ctx.beginPath();
        Array.forEach(element => {
            tmp_x = (element.x * this.scale) + this.gridx
            tmp_y = (element.y * this.scale) + this.gridy
            ctx[i ? 'lineTo': 'moveTo'](tmp_x, tmp_y);
            i += 1;
        });
        ctx.strokeStyle = "rgba(41,182,246," + alpha + ")";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    },
    setScale : function(scale){
        this.scale = scale;
        this.gridx = 400 * scale;
        this.gridy = 80 * scale;
        for(let i = 0; i < this.notesArray.length; i++){
            this.notesArray[i].setScale(scale);
        }
    }
}