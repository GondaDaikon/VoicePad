//data_hoge =[[posX,posY,time(ms), isSetNotes],...]
//posX,posY   : ノーツ位置
//makeNotes(x, y, spawnTime(ms))

var ManageNotes = 
{
    notesArray : [],
    lineArray : [],
    isLineDraw : [],
    scale : 2.0,
    gridx : 400,
    gridy : 80,

    ReadNotes : function(data)
    {
        console.log(data);
        this.notesArray = [];
        this.lineArray = [];
        for(let i = 0; i < data.length; i++){
            this.notesArray.push(makeNotes(data[i][0],data[i][1],data[i][2],data[i][3]));
        }
        this.makeLine(this.notesArray);
    },
    updateNotes : function(progress,state)
    {
        for(let i = 0; i < this.notesArray.length; i++){
            this.notesArray[i].update(progress);
            this.notesArray[i].hitNotes(progress,state);
        }
        this.updateLine(this.lineArray);
    },
    drawNotes : function(ctx,notesArray,Alpha)
    {
        for(let i = 0; i < notesArray.length; i++){
            notesArray[i].draw(ctx,Alpha);
        }
    },
    makeLine : function(notesArray)
    {
        let tmpArray = [];
        let Array_end = notesArray.length - 1;
        for(let i = 0; i < notesArray.length; i++){
            if(notesArray[i].rightTapTime == null){
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
    },
    updateLine : function(lineArray)
    {
        for(let i = 0; i < lineArray.length; i++){
            let endNotes = lineArray[i].length - 1;
            if(lineArray[i][endNotes].isSet){
                this.isLineDraw[i] = true;
            }else{
                this.isLineDraw[i] = false;
            }
        }
    },
    drawLine : function(ctx)
    {
        let alpha =  0.9;
        let isFirst = true;
        let lineWidth = this.lineArray[0][0].Notes_radius*2*scale;
        let textCount = 1;
        for(let i=0; i < this.lineArray.length; i++){
            // console.log("drawNotes");
            this.drawNotes(ctx,this.lineArray[i],alpha);
            ctx.beginPath();
            let x = (this.lineArray[i][0].x * this.scale) + this.gridx;
            let y = (this.lineArray[i][0].y * this.scale) + this.gridy;
            ctx.moveTo(x, y);
            for(let j=0; j < this.lineArray[i].length; j++)
            {
                let indexEnd = this.lineArray[i].length -1;
                if(this.isLineDraw[i]){
                    x = (this.lineArray[i][j].x * this.scale) + this.gridx;
                    y = (this.lineArray[i][j].y * this.scale) + this.gridy;
                    ctx.lineTo(x,y);

                    if(isFirst && this.lineArray[i][j].isVisible&&this.lineArray[i][j].isSet){
                        ctx.fillStyle = "rgba(245,245,245 ,1)";
                        ctx.font=( 28*this.scale + "px Arial");
                        ctx.textAlign = "center";
                        ctx.fillText(textCount, x, y + lineWidth*0.22);
                        textCount ++;
                    }
                    if(j == indexEnd){
                        ctx.globalCompositeOperation = "destination-over";
                        ctx.strokeStyle = "rgba(41,182,246," + alpha + ")";
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();
                        ctx.globalCompositeOperation = "source-over";
                        isFirst = false;
                        alpha -= 0.4;
                        if(alpha < 0) alpha = 0;
                    }
                }
            }
        }
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