//data_hoge =[[posX,posY,time(ms), isSetNotes],...]
//posX,posY   : ノーツ位置
//makeNotes(x, y, spawnTime(ms))

var ManageNotes = 
{
    loaddata : [],
    notesArray : [],
    // notes socket[[x,y,Judge]...]
    socket : [],
    now_point:[],
    lineArray : [],
    isLineDraw : [],
    isEndnotes : true,
    isFirstnotes : true,
    isSeted : false,
    score : 0,
    scale : 2.0,
    gridx : 400,
    gridy : 80,

    ReadNotes : function(data)
    {
        console.log(data);
        this.loaddata = data;
        this.isSeted = true;
        this.notesArray = [];
        this.lineArray = [];
        for(let i = 0; i < data.length; i++){
            this.notesArray.push(makeNotes(data[i][0],data[i][1],data[i][2],data[i][3]));
        }
        this.makeLine(this.notesArray);
    },
    makeLine : function(notesArray)
    {
        let tmpArray = [];
        let Array_end = notesArray.length - 1;
        this.isEndnotes = true;
        this.isFirstnotes = true;
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
    makeSocket : function(Array)
    {
        let tempArray = [];
        for(let i = 0; i < Array.length; i++){
            if (Array[i].isVisible){
                tempArray.push(Array[i])
            }
        }
        for(let i = 0; i < tempArray.length-1; i++){
            let socket_x,socket_y,diff_x,diff_y;

            diff_x = (Math.max(tempArray[i].x,tempArray[i+1].x)-Math.min(tempArray[i].x,tempArray[i+1].x))/2;
            diff_y = (Math.max(tempArray[i].y,tempArray[i+1].y)-Math.min(tempArray[i].y,tempArray[i+1].y))/2;

            socket_x = Math.min(tempArray[i].x,tempArray[i+1].x) + diff_x;
            socket_y = Math.min(tempArray[i].y,tempArray[i+1].y) + diff_y;

            this.socket.push([socket_x,socket_y,undefined]);
        }
    },
    updateNotes : function(progress,state)
    {
        for(let i = 0; i < this.notesArray.length; i++){
            this.notesArray[i].update(progress);
            this.notesArray[i].hitNotes(progress,state);
        }
        for(let i = 0; i < this.notesArray.length; i++){
            if(this.notesArray[i].isVisible && !this.notesArray[i].isDone){
                this.notesArray[i].isNext = true;
                break;
            }
        }
        try{
            //Notes First Taped+
            if(this.notesArray[0].isDone && this.isFirstnotes){
                console.log("FirstNotesTaped")
                this.isFirstnotes = false;
                this.socket = [];
                this.makeSocket(this.notesArray);
            }
            //Notes End Taped+
            if(this.notesArray[this.notesArray.length-1].isDone && this.isEndnotes){
                console.log("EndNotesTaped")
                this.isEndnotes = false;
                this.calcuScore(this.notesArray);
                this.ReadNotes(this.loaddata);
            }
        } catch(e){}
        this.updateLine(this.lineArray);
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
    calcuScore : function(notesArray)
    {
        let tmpArray = []
        for(let i = 0; i < notesArray.length; i++){
            if(notesArray[i].isVisible){
                tmpArray.push(notesArray[i]);
            }
        }
        let rightTaps = [];
        let actualTaps = [];
        for(let i = 0; i < tmpArray.length; i++){
            rightTaps.push(tmpArray[i].rightTapTime);
            actualTaps.push(tmpArray[i].tapTime);
        }
        let rightTapsRatio = this.ratio(rightTaps);
        let actualTapsRatio = this.ratio(actualTaps);
        let euclidDist = this.euclideanDistance(rightTapsRatio,actualTapsRatio);
        this.insertJudge(rightTapsRatio,actualTapsRatio);
        this.score = Math.ceil((1 - euclidDist)*100);
    },
    //insert socket[n][2] = Judge
    insertJudge : function(x,y)
    {
        for(let i=0; i < x.length; i++){
            let subAB = x[i] - y[i];
            let sizeAB = subAB**2;
            judge_ori = Math.sqrt(sizeAB);
            this.socket[i][2] = judge_ori;
        }
    },
    ratio : function(Array){
        let ratioArray = [];
        let end = Array.length-1;
        let denominator = Array[end] - Array[0]
        for(let i=0; i < end; i++){
            let Numerator = Array[i+1] - Array[i]
            ratioArray.push(Numerator / denominator);
        }
        return ratioArray
    },
    euclideanDistance : function(x,y){
        let euclid = 0;
        let sizeAB = 0
        for(let i=0; i < x.length; i++){
            let subAB = x[i] - y[i];
            sizeAB += subAB**2;
        }
        euclid = Math.sqrt(sizeAB);
        return  euclid;
    },
    cosSimilarity : function(x,y){
        let innerXY = this.dot(x,y);
        let crossXY = this.cross(x,y);

        let cosSim = innerXY / crossXY;

        return cosSim;
    },
    dot : function(x,y){
        let innerXY = 0;
        for(let i=0; i < x.length; i++){
            innerXY += (x[i] * y[i]);
        }
        return innerXY
    },
    cross : function(x,y){
        let crossXY = 0;
        let sizeX = x.reduce(function(a, v){return a + v*v;},0);
        let sizeY = y.reduce(function(a, v){return a + v*v;},0);
        return crossXY = Math.sqrt(sizeX) * Math.sqrt(sizeY)
    },
    drawNotes : function(ctx,notesArray,Alpha)
    {
        for(let i = 0; i < notesArray.length; i++){
            notesArray[i].draw(ctx,Alpha);
        }
    },

    drawVec : function(ctx,Array)
    {
        let alpha;
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
                    }
                    if(this.lineArray[i][j].isVisible){
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
    drawScore : function(ctx){
        let ox = 400 * this.scale;
        let oy = 80 * this.scale;

        let ax = 10 * this.scale;
        let ay = 10 * this.scale;

        let dispText = "SCORE : " + this.score + " 点";
        
        ctx.fillStyle = "rgba(38,50,56 ,1)";
        ctx.font=( 18*this.scale + "px Arial");
        ctx.textAlign = "left";
        ctx.fillText(dispText, ox+ax, oy-ay);
    },
    //drawJudge() if socket != undefind
    //socket[[x,y,Judge]...]
    drawJudge : function(ctx){
        try{
            if(this.socket[0][2] != undefined){
                for(let i=0; i < this.socket.length; i++)
                {
                    //console.log("Judge");
                    let ox = (this.socket[i][0] * this.scale) + this.gridx;
                    let oy = (this.socket[i][1] * this.scale) + this.gridy;

                    let ax = 4 * this.scale;
                    let ay = 4 * this.scale;

                    let dispText;
                    if(this.socket[i][2] < 0.1){
                        dispText = "PERFECT";
                    }else if(this.socket[i][3] < 0.5){
                        dispText = " GOOD ";
                    }else{
                        dispText = "  BAD  ";
                    }

                    ctx.fillStyle = "rgba(38,50,56 ,1)";
                    ctx.font=( 18*this.scale + "px Arial");
                    ctx.textAlign = "center";
                    ctx.fillText(dispText, ox+ax, oy+ay);
                }
            }
        }catch(e){}
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