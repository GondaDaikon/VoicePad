function makeNotes(x, y, isDisp)
{
    notes = {};
    notes.x = x;
    notes.y = y;

    notes.isSet= true;
    notes.isDone = !isDisp ? true : false;
    notes.isNext = false;
    notes.only1time = true;
    notes.Notes_radius = 56;
    notes.scale = 1.0;
    notes.tapTime = 0;

    notes.draw = function(ctx,Alpha)
    {
        if(this.isDone){
            this.isSet = false;
        }
        if(this.isSet){
            //Notes
            let x = (this.x * this.scale) + global_gridX;
            let y = (this.y * this.scale) + global_gridY;
            let Notes_radius = this.Notes_radius * this.scale;

            ctx.strokeStyle = "rgba(224,224,224," + Alpha + ")" ;
            ctx.fillStyle = "rgba(66,165,245," + Alpha + ")";
            ctx.lineWidth = this.Notes_radius * 0.4;
            ctx.beginPath () ;
            ctx.arc( x, y, Notes_radius, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
            ctx.closePath();
            ctx.stroke() ;
            ctx.fill() ;
        }
    }
    notes.hitNotes = function(progress,state)
    {
        let x = (this.x * this.scale) + global_gridX;
        let y = (this.y * this.scale) + global_gridY;
        let Notes_radius = this.Notes_radius * this.scale;

        if(this.only1time){
            if (x - Notes_radius <= state.x && state.x <= x + Notes_radius
                && y - Notes_radius <= state.y && state.y <= y + Notes_radius)
            {
                if(this.isNext){
                    this.tapTime = progress;
                    this.isDone = true;
                    this.only1time = false;
                }
            }
        }
    }
    notes.reSet = function()
    {
        this.isSet= true;
        this.isDone = false;
        this.isNext = false;
        this.only1time = true;
        this.isDraw = false;
    }
    notes.setScale = function(scale)
    {
        this.scale = scale;
    }
    return notes;
}