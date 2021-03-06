export default class CellModel{
    constructor(){
    this.type = null;
    this.status = CELL_STATUS.COMMON;
    this.x = 1;
    this.y = 1;
    this.startX = 1;
    this.startY = 1;
    this.cmd = [];
    this.isDeath = false;
    // 冰块
    this.ice=false;
    // this.objecCount = Math.floor(Math.random() * 1000);
    }
    init(type){
        this.type = type;
    }
    // 判断是否有笼罩|调节冰块数量ice
    isIce(ice){
        // if(ice>=0.8){
        //     this.ice=CELL_ICE.DISPLAY;
        // }else{
        //    this.ice=CELL_ICE.HIDDEN; 
        // }
        this.ice=CELL_ICE.HIDDEN; 

        // console.log(this.ice);
    }
    isEmpty(){
       return this.type == CELL_TYPE.EMPTY;  
    }
    setEmpty(){
         this.type = CELL_TYPE.EMPTY;
    }
    setXY(x,y){
        this.x = x;
        this.y = y;
    }
    setStartXY(x,y){
        this.startX = x;
        this.startY = y;
    }
    setStatus(status){
        this.status = status;
    }
    moveToAndBack(pos){
        var srcPos = cc.p(this.x,this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        }); 
    }
    moveTo(pos, playTime){
         // 初始位置
        var srcPos = cc.p(this.x,this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y; 
    }
    toDie(playTime){
        this.cmd.push({
        action: "toDie",
        playTime: playTime,
        keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }
    toShake(playTime){
        this.cmd.push({
        action: "toShake",
        playTime: playTime,
        keepTime: ANITIME.DIE_SHAKE
    }); 
    }
    setVisible(playTime, isVisible){
        this.cmd.push({
        action: "setVisible",
        playTime: playTime,
        keepTime: 0,
        isVisible: isVisible
    });
    }
    moveToAndDie(pos){

    }
                // 移除表面冰块
    removeIce(){
        this.ice=CELL_ICE.HIDDEN;
    }
    isBird(){
        return this.type == CELL_TYPE.G;
    }
}



