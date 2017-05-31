export default class IceModel{
        constructor(){
        this.isDisplay=false;    
        this.status = CELL_ICE_BLOCK.DISPLAY;
        this.x = 1;
        this.y = 1;
        this.startX = 1;
        this.startY = 1;
        this.cmd = [];

    }


    toDie(playTime){
        this.cmd.push({
        action: "toDie",
        playTime: playTime,
        keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }
    init(getIsDisplay){
      this.beforeDisplay=getIsDisplay;
      if(getIsDisplay>0.8){
        this.isDisplay= true;  
      }
      else{
        this.isDisplay= false;     
      }  
    }
    setXY(x,y){
        this.x = x;
        this.y = y;
    }
    setStartXY(x,y){
        this.startX = x;
        this.startY = y;
    }


    removeIceBlock(){
        this.isDisplay=CELL_ICE_BLOCK.HIDDEN;
    }
        
}
