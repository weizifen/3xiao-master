import CellModel from './CellModel'
export default class GameModel{
    
    constructor(){
            this.cells = null;
            this.cellBgs = null;
            this.lastPos = cc.p(-1, -1);
            this.cellTypeNum = 5;
            this.cellCreateType = []; // 升成种类只在这个数组里面查找
            this.temp=null;
    }
    // cellTypeNum cell类型有多少种
    // 初始化  确认几行几列
    // 创造CellModel对象 for1 创造CellModel
    // 初始化CellModel
    init(cellTypeNum){
        this.cells = [];
        //  每次创造的类型
        this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
        for(var i = 1;i<=GRID_WIDTH;i++){
            this.cells[i] = [];
            for(var j = 1;j <= GRID_HEIGHT;j++){
                this.cells[i][j] = new CellModel();
            }
        }
        for(var i = 1;i<=GRID_WIDTH;i++){
            for(var j = 1;j <= GRID_HEIGHT;j++){
                let flag = true;
                while(flag){
                    flag = false;
                    // 初始化cell的类型
                    this.cells[i][j].init(this.getRandomCellType());
                    this.cells[i][j].isIce(this.getCellsIce());
                    let result = this.checkPoint(j, i)[0];
                    // console.log(this.checkPoint(j, i));
                    // console.log(result);
                    if(result.length > 2){
                        flag = true;
                    }
                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }
    };
    initWithData(data){
    }
    //智能提示---在一段时间后用户未作出明确操作   ==横向遍历
    prompt(){
        // console.log(this.cells);
        // var allCouple=[];
        var  ageCellModel=null;
        for(var i = 1;i <= GRID_WIDTH; i++){
  
            for(var j = 1;j <= GRID_HEIGHT ;j++)
            {
                if(ageCellModel==null){
                    ageCellModel=this.cells[i][j];
                    continue;
                }
                if(ageCellModel.type==this.cells[i][j].type&&ageCellModel.y==this.cells[i][j].y){
                    console.log(ageCellModel,this.cells[i][j])
                    var exist=this.rowSearchLeft(ageCellModel,ageCellModel.type);
                    if(!exist){
                         exist=this.rowSearchRight(this.cells[i][j],ageCellModel.type);
                    }
                    // console.log(exist[0].ice)
                    if(exist)
                    {                    
                    var targetIsICE=exist[0].ice;
                    var tempIsICE=this.temp.ice;

                    if(exist&&!targetIsICE&&!tempIsICE){
                        exist[0].toShake(5);
                        exist[1].toShake(5);
                        return exist;
                    }}
   
                }
                ageCellModel=this.cells[i][j];
            }
        }
    }
    //遍历两点左右  ==横向
    rowSearchLeft(model,typeA){
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX-1;
        var tempY=modelY;
        var temp=this.cells[tempY][tempX];
        this.temp=temp;
        if(temp){
            // 左上
            var typeOne=this.pointForTop(temp);
            // console.log(typeOne,typeA);  
            if(typeOne!=null){          
                if(typeOne.type==typeA){
                    console.log("存在左边一点,左上方");
                    return [typeOne,model,"存在左边一点,左上方"];
                }
            }   
            // 左右
            var typeThree=this.pointForLeft(temp);
            // console.log(typeThree,typeA);
            if(typeThree!=null){                      
                if(typeThree.type==typeA){
                    console.log("存在左边一点,左左位置");
                    return [typeThree,model,"存在左边一点,左左位置"];
                }

            }

            // 左下
            var typeTwo=this.pointForBottom(temp);
            // console.log(typeTwo,typeA); 
            if(typeTwo!=null){                                 
                if(typeTwo.type==typeA){
                    console.log("存在左边一点,左下方");
                    return [typeTwo,model,"存在左边一点,左下方"];
                }
            }

        }
        return ;
    }
    rowSearchRight(model,typeB){
        var modelX=model.x;
        var modelY=model.y; 
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX+1;
        var tempY=modelY;
        var temp=this.cells[tempY][tempX];
        if(temp){
            // 左上
            var typeOne=this.pointForTop(temp);
            // console.log(typeOne,typeB);  
            if(typeOne!=null){                                                       
                if(typeOne.type==typeB){
                    console.log("存在右边一点,右上方");
                    return [typeOne,model,"存在右边一点,右上方"];
                }
            }
            // 左右
            var typeThree=this.pointForRight(temp);
            // console.log(typeThree,typeB);
            if(typeThree!=null){                                             
                if(typeThree.type==typeB){
                    console.log("存在右边一点,右右位置");
                    return [typeThree,model,"存在右边一点,右右位置"];
                }
            }

            // 左下
            var typeTwo=this.pointForBottom(temp);
                // console.log(typeTwo,typeB); 
            if(typeTwo!=null){                                 
                if(typeTwo.type==typeB){
                    console.log("存在右边一点,右下方");
                    return [typeTwo,model,"存在右边一点,右下方"];
                }
            }

        }
        return ;      
    }
    pointForTop(model){
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX;
        var tempY=modelY+1;
        if(tempX>0&&tempY>0&&tempX<10&&tempY<10){        
            // console.log(tempY,tempX)
            var NewTemp=this.cells[tempY][tempX];
            if(NewTemp.type){
                return NewTemp;
            }
        }
    }
    pointForBottom(model){
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX;
        var tempY=modelY-1;
        if(tempX>0&&tempY>0&&tempX<10&&tempY<10){        
            // console.log(tempY,tempX)
            var NewTemp=this.cells[tempY][tempX];
            if(NewTemp.type){
                return NewTemp;
            }
        }    

    }
    pointForLeft(model){
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX-1;
        var tempY=modelY;
        if(tempX>0&&tempY>0&&tempX<10&&tempY<10){        
            // console.log(tempY,tempX)
            var NewTemp=this.cells[tempY][tempX];
            if(NewTemp.type){
                return NewTemp;
            }
        }
    } 
    pointForRight(model){
        var modelX=model.x;
        var modelY=model.y;
        var tempX=modelX+1;
        var tempY=modelY;
        if(tempX>0&&tempY>0&&tempX<10&&tempY<10){        
            // console.log(tempY,tempX) 
            var NewTemp=this.cells[tempY][tempX];
            if(NewTemp.type){
                return NewTemp;
            }
        }
    }   


    // 遍历目标点上下
    // 检查周围Point与当前point的类型
    checkPoint(x,y){
            let checkWithDirection = function (x, y, direction) {
            let queue = [];
            let vis = [];
            vis[x + y * 9] = true;
            queue.push(cc.p(x, y));
            let front = 0;
            // front(前)
            while (front < queue.length) {
                //let direction = [cc.p(0, -1), cc.p(0, 1), cc.p(1, 0), cc.p(-1, 0)];
                let point = queue[front];
                let cellModel = this.cells[point.y][point.x];
                front++;
                if (!cellModel) {
                    continue;
                }
                for (let i = 0; i < direction.length; i++) {
                    let tmpX = point.x + direction[i].x;
                    let tmpY = point.y + direction[i].y;
                    if (tmpX < 1 || tmpX > 9
                        || tmpY < 1 || tmpY > 9
                        || vis[tmpX + tmpY * 9]
                        || !this.cells[tmpY][tmpX]) {
                        continue;
                    }
                    if (cellModel.type == this.cells[tmpY][tmpX].type) {
                        vis[tmpX + tmpY * 9] = true;
                        queue.push(cc.p(tmpX, tmpY));
                    }
                }
            }
            return queue;
        }
        let rowResult = checkWithDirection.call(this,x,y,[cc.p(1, 0), cc.p(-1, 0)]);
        let colResult = checkWithDirection.call(this,x,y,[cc.p(0, -1), cc.p(0, 1)]);
        let result = [];
        let newCellStatus = "";
        // 如果遍历到5个相同type的cell  则生成新类型同type的cell  ---状态改变
        if(rowResult.length >= 5 || colResult.length >= 5){
            newCellStatus = CELL_STATUS.BIRD;
        }
        // 如果遍历到3个横竖相同type的cell  则生成新类型同type的cell   ---状态改变
        else if(rowResult.length >= 3 && colResult.length >= 3){
            newCellStatus = CELL_STATUS.WRAP;
        }
        else if(rowResult.length >= 4){
            newCellStatus = CELL_STATUS.LINE;
        }
        else if(colResult.length >= 4){
            newCellStatus = CELL_STATUS.COLUMN;
        }
        if(rowResult.length >= 3){
            result = rowResult;
        }
        if(colResult.length >= 3){
            let tmp = result.concat();
            colResult.forEach(function(newEle){
                let flag = false;
                tmp.forEach(function (oldEle) {
                    if(newEle.x == oldEle.x && newEle.y == oldEle.y){
                        flag = true;
                    }
                }, this);
                if(!flag){
                    result.push(newEle);
                }
            }, this);
        }
        return [result,newCellStatus, this.cells[y][x].type];
        }
    printInfo(){
            for(var i = 1; i<=9 ;i++){
            var printStr = "";
            for(var j = 1; j<=9;j++){
                printStr += this.cells[i][j].type + " ";
            }
            console.log(printStr);
        }
    }
    getCells(){
        return this.cells;
    }
    selectCell(pos){
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var lastPos = this.lastPos;
        // 如果点击的是带有气球的cell  则无法被点击
        if(this.cells[pos.y][pos.x].ice){
            return [[],[]];
        }
        // 相邻交换判定
        var isEmpty = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
        if(isEmpty != 1){
            this.lastPos = pos;
            return [[], []];
        }
        this.exchangeCell(lastPos, pos);
        var result1 = this.checkPoint(pos.x, pos.y)[0];
        var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(this.cells[pos.y][pos.x]);
        this.pushToChangeModels(this.cells[lastPos.y][lastPos.x]);
        let isCanBomb = (this.cells[pos.y][pos.x].status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物 
                this.cells[lastPos.y][lastPos.x].status != CELL_STATUS.COMMON) ||
                this.cells[pos.y][pos.x].status == CELL_STATUS.BIRD ||
                this.cells[lastPos.y][lastPos.x].status == CELL_STATUS.BIRD;
        if(result1.length < 3 && result2.length < 3 && !isCanBomb){
            this.exchangeCell(lastPos, pos);
            this.cells[pos.y][pos.x].moveToAndBack(lastPos);
            this.cells[lastPos.y][lastPos.x].moveToAndBack(pos);
            this.lastPos = cc.p(-1, -1);
            return [this.changeModels];
        }
        else{
            this.lastPos = cc.p(-1,-1);
            this.cells[pos.y][pos.x].moveTo(pos, this.curTime);
            this.cells[lastPos.y][lastPos.x].moveTo(lastPos, this.curTime);
            var checkPoint = [pos, lastPos];
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            return [this.changeModels, this.effectsQueue];
        }
    }
    processCrush(checkPoint){
            let cycleCount = 0;
        while(checkPoint.length > 0){
            //爆炸模式
            let bombModels = [];
            //交换中有bird
            if(cycleCount == 0 && checkPoint.length == 2){ //特殊消除
                let pos1= checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];
                if(model1.status == CELL_STATUS.BIRD || model2.status ==  CELL_STATUS.BIRD){
                    let bombModel = null;
                    if(model1.status == CELL_STATUS.BIRD){
                        model1.type = model2.type;
                        bombModels.push(model1);

                    }
                    else{
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }

                }
            }
            // 遍历两点
            for(var i in checkPoint){
                var pos = checkPoint[i];
                if(!this.cells[pos.y][pos.x]){
                    continue;
                }
                var tmp = this.checkPoint(pos.x, pos.y);
                var result = tmp[0];
                var newCellStatus = tmp[1];
                var newCellType = tmp[2];
                
                if(result.length < 3){
                    continue;
                }
                //遍历相同cell[]
                for(var j in result){
                    var model = this.cells[result[j].y][result[j].x];
                    // 销毁该cell
                    this.crushCell(result[j].x, result[j].y);
                    //如果该model不是普通
                    if(model.status != CELL_STATUS.COMMON){
                        bombModels.push(model);
                    }
                }
                // 在该点生成新的cell
                this.createNewCell(pos, newCellStatus, newCellType);   

            }
            // 爆炸进程
            this.processBomb(bombModels);
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
    }
    createNewCell(pos,status,type){
        if(status == ""){
            return ;
        }
        if(status == CELL_STATUS.BIRD){
            type = CELL_TYPE.BIRD
        }
        let model = new CellModel();
        this.cells[pos.y][pos.x] = model
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
    }
    down(){
        let newCheckPoint = [];
        //纵向遍历
        for(var i = 1;i<=GRID_WIDTH;i++){
            for(var j = 1;j <= GRID_HEIGHT;j++){
                if(this.cells[i][j] == null){
                    var curRow = i;
                    for(var k = curRow; k<=GRID_HEIGHT;k++){
                        if(this.cells[k][j]){
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(cc.p(j, curRow), this.curTime);
                            curRow++; 
                        
                        }
                    }
                    var count = 1;
                    for(var k = curRow; k<=GRID_HEIGHT; k++){
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].init(this.getRandomCellType());
                        this.cells[k][j].isIce(this.getCellsIce());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].moveTo(cc.p(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }
                } 
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        return newCheckPoint;
    }
    pushToChangeModels(model){
        if(isInArray(this.changeModels, model)){
            return ;
        }
        this.changeModels.push(model);
    }
    cleanCmd(){
        for(var i = 1;i<=GRID_WIDTH;i++){
            for(var j = 1;j <= GRID_HEIGHT;j++){
                if(this.cells[i][j]){
                    this.cells[i][j].cmd = [];
                }
            }
        }  
    }
    exchangeCell(pos1, pos2){
        var tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }
    setCellTypeNum(num){
        this.cellTypeNum = num;
        this.cellCreateType = [];
        for(var i = 1; i<= num;i++){
            while(true){
                var randomNum = Math.floor(Math.random() * CELL_BASENUM) + 1;
                if(this.cellCreateType.indexOf(randomNum) == -1){
                    this.cellCreateType.push(randomNum);
                    break;
                }
            }
        }
    }
    getRandomCellType(){
        var index = Math.floor(Math.random() * this.cellTypeNum) ;
        return this.cellCreateType[index];
    }
    // TODO bombModels去重
    processBomb(bombModels){
        while(bombModels.length > 0){
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            // 遍历爆炸模型(横|纵|包裹|鸟)--消除
            bombModels.forEach(function(model){
                if(model.status == CELL_STATUS.LINE){
                    for(let i = 1; i<= GRID_WIDTH; i++){
                        if(this.cells[model.y][i]){
                            //当改行存在其他爆炸模型时
                            if(this.cells[model.y][i].status != CELL_STATUS.COMMON){
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            //销毁cell
                            this.crushCell(i, model.y);
                        }
                    }
                    //添加行爆炸
                    this.addRowBomb(this.curTime, cc.p(model.x, model.y));
                }
                else if(model.status == CELL_STATUS.COLUMN){
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell(model.x, i);
                        }
                    }
                    this.addColBomb(this.curTime, cc.p(model.x, model.y));
                }
                else if(model.status == CELL_STATUS.WRAP){
                    let x = model.x;
                    let y = model.y;
                    for(let i = 1;i <= GRID_HEIGHT; i++){
                        for(let j = 1;j <= GRID_WIDTH; j++){
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            //消除范围内的cell,delta设定范围的大小
                            if(this.cells[i][j] && delta <= 2){
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i);
                            }
                        }
                    }
                }
                else if(model.status == CELL_STATUS.BIRD){
                    //获得要消除cell的类型
                    let crushType = model.type
                    if(bombTime < ANITIME.BOMB_BIRD_DELAY){
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }
                    //当两者都是bird的情况,随机消除一种cell
                    if(crushType == CELL_TYPE.BIRD){
                        crushType = this.getRandomCellType(); 
                    }
                    for(let i = 1;i <= GRID_HEIGHT; i++){
                        for(let j = 1;j <= GRID_WIDTH; j++){
                            if(this.cells[i][j] && this.cells[i][j].type == crushType){
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, true);
                            }
                        }
                    }
                    //this.crushCell(model.x, model.y);
                }
            },this);
            if(bombModels.length > 0){
                this.curTime += bombTime;
            }
            //如果没有新的爆炸model需要执行,则bombModels返回为空
            bombModels = newBombModel;
        }   
    }
    addCrushEffect(playTime, pos){
        this.effectsQueue.push({
        playTime: playTime,
        pos: pos,
        action: "crush"
     });
    }
    addRowBomb(playTime, pos){
        this.effectsQueue.push({
        playTime: playTime,
        pos: pos,
        action: "rowBomb"
     }); 
    }
    addColBomb(playTime, pos){
            this.effectsQueue.push({
            playTime: playTime,
            pos: pos,
            action: "colBomb"
        });  
    }
    addWrapBomb(playTime, pos){

    }
    crushCell(x,y,needShake){
            let model = this.cells[y][x];
            this.pushToChangeModels(model);
        if(model.ice==CELL_ICE.HIDDEN){
            if(needShake){
                model.toShake(this.curTime)
                model.toDie(this.curTime + ANITIME.DIE_SHAKE);
            }
            else{
                model.toDie(this.curTime);
            }
            //  消除效果
            this.addCrushEffect(this.curTime, cc.p(model.x, model.y));
            this.cells[y][x] = null;
        }
        else{
            // console.log(model.ice);
            model.removeIce();
            // console.log(model.ice);
        }
    }
    // 是否有冰块笼罩
    getCellsIce(){
        var count =Math.random();
        return count;
    } 



    // 重置cell
    resert(){
            
            console.log(this.cells[1])
    

    }

}
