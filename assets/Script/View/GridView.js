cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        animalPrefab: {
            default: [],
            type: [cc.Prefab]
        },
        IcePrefab: {
            default: [],
            type: [cc.Prefab]
        },
        effectLayer: {
            default: null,
            type: cc.Node
        },
        bgAudio:{
            default:null,
            url:cc.AudioClip,
        },
        score:{
            default:null,
            type:cc.Label,
        },
        score:{
            default:null,
            type:cc.Label,
        },
        timeTotal:60,
        time:{
            default:null,
            type:cc.Label,
        },
        iceCount:{
            default:null,
            type:cc.Label,
        },
        displayCombo:{
            default:null,
            type:cc.Node,
        },
        chooseComboImg:{
            default:[],
            type:cc.SpriteFrame,
        },
        ComboAudio:{
            default:[],
            url:cc.AudioClip,
        },
        _timeOut:null,
        _comboTimeOut:null,
        _scoreC:0,
        _iceC:0,
        _flag:true,
        _beforeIce:null,
        // // 横向数组 纵向数组  --检测死局
        // _rowArray:null,
        // _colArray:null,
        
    },


    // use this for initialization
    onLoad () {
        // this.displayCombo.height=100;
        // console.log(this.displayCombo.height);
        cc.audioEngine.play(this.bgAudio,true,0.2);        
        this.setListener();
        this.lastTouchPos = cc.Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false; // 是否在播放中

        // 时间  定时
        this.schedule(function(){
            this.timeTotal--;
            if(this.timeTotal>0){
            this.time.string=this.timeTotal;
        }else{
                cc.audioEngine.pauseAll();
                cc.sys.localStorage.setItem("score",this._scoreC)
                cc.director.loadScene("over");
            }
        },1);
        // 冰块
        this.loadIce();
        this.AsetTimeout(5000);

        

        // 智能提示
        // this.promptTotal();
        // var x=this.prompt();
        // this.schedule(function(){
        //     this.prompt();
        // },5)
        
    },
    //智能检测 总(死局检测success ,智能提示有bug)
    promptTotal(){
        console.log(this.controller.shakeCell());
        if(this.controller.shakeCell()){
            this.prompt(this.controller.shakeCell())
        }else if(this.controller.shakeCellTwo()){
            this.prompt(this.controller.shakeCellTwo())
        }
        else{
            console.log("死局")
            cc.director.loadScene("over");
        }
    },
    //智能提示---横向
    prompt(shakeA){
        // var shakeA=this.controller.shakeCell();
        this._rowArray=shakeA;
        console.log(shakeA);
        shakeA.forEach(function(element) {
            var viewInfo = this.findViewByModel(element);
            // console.log(viewInfo)
            if(viewInfo){
                var cellViewScript = viewInfo.view.getComponent("CellView");
                cellViewScript.updatePrompt();
            }
            
             
        }, this);

    },
    //     //智能提示---纵向
    // promptTwo(){
    //     var shakeB=this.controller.shakeCellTwo();
    //     this._colArray=shakeB;
    //     console.log(shakeA);
    //     shakeA.forEach(function(element) {
    //         var viewInfo = this.findViewByModel(element);
    //         // console.log(viewInfo)
    //         if(viewInfo){
    //             var cellViewScript = viewInfo.view.getComponent("CellView");
    //             cellViewScript.updatePrompt();
    //         }
            
             
    //     }, this);

    // },

    setController(controller){
        this.controller = controller;
    },
    //加载冰块数量并显示
    loadIce(){
        
        this.iceCount.string=this.controller.getIceBlockCount();
        if(this.iceCount.string==0){
            var actionArray=[];
            actionArray.push(cc.delayTime(2));
            var callFunc = cc.callFunc(function(){
                cc.audioEngine.stopAll();
                cc.director.loadScene("congratulation");  
                },this);
            actionArray.push(callFunc);
            this.node.runAction(cc.sequence(actionArray)); 
        }

    },

    initWithCellModels(cellsModels){
        this.cellViews = [];
        for(var i = 1;i<=9;i++){
            this.cellViews[i] = [];
            for(var j = 1;j<=9;j++){
                var type = cellsModels[i][j].type;
                // console.log(type)
                var aniView = cc.instantiate(this.animalPrefab[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(cellsModels[i][j]);
                this.cellViews[i][j] = aniView;
            }
        }
    },
    initWithIceModels(icesModels){
        
        this.icesModels = [];
        for(var i = 1;i<=9;i++){
            this.icesModels[i] = [];
            for(var j = 1;j<=9;j++){
                // var type = cellsModels[i][j].type;
                var iceView = cc.instantiate(this.IcePrefab[0]);
                iceView.parent = this.node;
                var cellViewScript = iceView.getComponent("IceView");
                cellViewScript.initWithModel(icesModels[i][j]);
                this.icesModels[i][j] = iceView;
            }
        }
        // if(this._flag){
        // const bef=icesModels;
        // console.log(bef);
        // this._beforeIce=bef;
        // this._flag=false;

        // }
        while(!this._beforeIce){
            console.log("执行了")
          this._beforeIce=  icesModels;
        }

    },

    setListener(){
        this.node.on("touchstart", function(eventTouch){
            if(this.isInPlayAni){
                return true;
            }
            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if(cellPos){
                // console.log(cellPos)
                var changeModels = this.selectCell(cellPos);
                if(changeModels.length >= 3){
                    this.isCanMove = false;
                }
                else{
                    this.isCanMove = true;
                }
            }
            else{
                this.isCanMove = false;
            }
           return true;
        }, this);
        this.node.on("touchmove", function(eventTouch){
           if(this.isCanMove){
               var startTouchPos = eventTouch.getStartLocation ();
            //    console.log(startTouchPos)
               var startCellPos = this.convertTouchPosToCell(startTouchPos);
               var touchPos = eventTouch.getLocation();
               var cellPos = this.convertTouchPosToCell(touchPos);
               if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                   this.isCanMove = false;
                   var changeModels = this.selectCell(cellPos); 
               }
           }
        }, this);
        this.node.on("touchend", function(eventTouch){
        }, this);
        this.node.on("touchcancel", function(eventTouch){
        }, this);
    },
    // 将可点击的像素坐标转化为cell坐标
    convertTouchPosToCell(pos){
        pos = this.node.convertToNodeSpace(pos);
        console.log(pos)
        if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){
            return false;
        }
        var x = Math.floor(pos.x / CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return cc.p(x, y);
    },
    // 智能提示计时器
    AsetTimeout(time){
        var that=this;
        console.log("知心")
        clearTimeout(this._timeOut);
        this._timeOut=setTimeout(function() {
        console.log("知心1")

                  that.promptTotal();
      
        }, time);
    },
    combo(){

        // combo增加时间
        this.timeTotal+=this.controller.getAddTime();
        //combo图片
        var comboCount=this.controller.getComboCount();
        var setComboImg=this.displayCombo.getComponent(cc.Sprite);
        if(comboCount==3){
            setComboImg.spriteFrame=this.chooseComboImg[0];
            cc.audioEngine.play(this.ComboAudio[0])
            comboCount=0;
        }else if(comboCount==4){
            setComboImg.spriteFrame=this.chooseComboImg[1];
             cc.audioEngine.play(this.ComboAudio[1])
             comboCount=0;
        }else if(comboCount==5){
            setComboImg.spriteFrame=this.chooseComboImg[2];
             cc.audioEngine.play(this.ComboAudio[2]);
             comboCount=0;
        }else if(comboCount>=6){
            setComboImg.spriteFrame=this.chooseComboImg[3];
             cc.audioEngine.play(this.ComboAudio[3]);
             comboCount=0;
        }
    },
    setComboTimeout(time){
        var that=this;
        clearTimeout(this._comboTimeOut);
        this._comboTimeOut=setTimeout(function() {
            that.combo();
        }, time);
    },
    updateView(changeModels){
        // 智能提示
        this.AsetTimeout(5000);

        let newCellViewInfo = [];
        for(var i in changeModels){
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;         
            if(!viewInfo){
                var type = model.type;
                // 分数统计
                this._scoreC+=10
                this.score.string=this._scoreC;
                var aniView = cc.instantiate(this.animalPrefab[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;

                if(this.controller.getComboCount()==3){
                this.setComboTimeout(1000);
                }else if(this.controller.getComboCount()==4){
                this.setComboTimeout(2000);
                }else if(this.controller.getComboCount()==5){
                this.setComboTimeout(3000);
                }else if(this.controller.getComboCount()>=6){
                this.setComboTimeout(4000);
                }

            }
            else{
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
                // console.log("存在")
            }
            var cellScript = view.getComponent("CellView");
            cellScript.updateView();
            // var icecript = view.getComponent("IceView");
            // icecript.updateView();
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        },this);
    },
    updateSelect(pos){
         for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j]){
                    var cellScript = this.cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                    }
                    else{
                        cellScript.setSelect(false);
                    }

                }
            }
        }
        
    },
    findViewByModel(model){
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this.cellViews[i][j],
                        x:j, 
                        y:i};
                }
            }
        }
        return null;
    },
    getPlayAniTime(changeModels){
        if(!changeModels){
            return 0;
        }
        var maxTime = 0;
        changeModels.forEach(function(ele){
            ele.cmd.forEach(function(cmd){
                if(maxTime < cmd.playTime + cmd.keepTime){
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            },this)
        },this);
        return maxTime;
    },
    disableTouch(time){
        if(time <= 0){
            return ;
        }
        this.isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
            this.isInPlayAni = false;
        }, this)));
    },

    // 点击态
    selectCell(cellPos){
        // console.log(this.controller);
        var result = this.controller.selectCell(cellPos);
        // console.log(result)

// 智能提示
        // //长时间未点击第二项
        // if(result[0].length==0&&result[1].length==0){
        //         console.log("执行了")
        //         this.scheduleOnce(function(){
        //             this.prompt();
        //         },10);
        // }
        // if(result[0].length!=0&&result[1].length!=0){
        //         this.unschedule(function(){
        //            this.prompt();
        //            this.node.cleanup();  
        //         })
        // }



        var changeModels = result[0];
        var effectsQueue = result[1];
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels));
        this.updateView(changeModels);
        this.controller.cleanCmd(); 
        if(changeModels.length >= 2){
            this.updateSelect(cc.p(-1,-1));
            this.updateIces();
                }
        else{
            this.updateSelect(cellPos);
        }
        return changeModels;
    },
    // 获得最新的状态
    updateIces(){
        let newCellViewInfo = [];
        // console.log(this.icesModels);
        for(var i = 1;i <=9 ;i++){
            for(var j = 1 ;j <=9 ;j ++){
                this.icesModels[i][j].model=this._beforeIce[i][j];
                this.icesModels[i][j].getComponent("IceView").updateWithModel(this._beforeIce[i][j]);
                }
            }
        this.loadIce();


    },



    playEffect(effectsQueue){
        this.effectLayer.getComponent("Boom").playEffects(effectsQueue);
    },




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
