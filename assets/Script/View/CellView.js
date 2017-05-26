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
        defaultFrame:{
            default: null,
            type: cc.SpriteFrame
        },
        ball_break:{
            default:null,
            url:cc.AudioClip,
        },
        ballStatus:false,
    },

    // use this for initialization
    onLoad: function () {
        //this.model = null;
        this.isSelect = false;
    },
    
    initWithModel: function(model){
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.x = CELL_WIDTH * (x - 0.5);
        this.node.y = CELL_HEIGHT * (y - 0.5);
        var animation  = this.node.getComponent(cc.Animation);
        if (model.status == CELL_STATUS.COMMON){
            animation.stop();
        } 
        else{
            animation.play(model.status);       
        };
        if(model.ice==CELL_ICE.DISPLAY){
            var ice=this.node.getChildByName("ice");
            ice.active = true;
            this.ballStatus=true; 
        }
    },
    updateView: function(){
        // console.log(this.model.ice)
        //气球显示和隐藏|声音播放
        if(this.ballStatus&&this.model.ice==CELL_ICE.HIDDEN){
              this.ballStatus=false;
              var ice=this.node.getChildByName("ice");
              ice.active = this.model.ice; 
              cc.audioEngine.play(this.ball_break,false,0.2); 
        }
        
        var cmd = this.model.cmd;
        if(cmd.length <= 0){
            return ;
        }
        var actionArray = [];
        var curTime = 0;
        for(var i in cmd){
            if( cmd[i].playTime > curTime){
                var delay = cc.delayTime(cmd[i].playTime - curTime);
                actionArray.push(delay);
            }
            if(cmd[i].action == "moveTo"){
                var x = (cmd[i].pos.x - 0.5) * CELL_WIDTH;
                var y = (cmd[i].pos.y - 0.5) * CELL_HEIGHT;
                var move = cc.moveTo(ANITIME.TOUCH_MOVE, cc.p(x,y));
                actionArray.push(move);
            }
            else if(cmd[i].action == "toDie"){
                if(this.status == CELL_STATUS.BIRD){
                    let animation = this.node.getComponent(cc.Animation);
                    animation.play("effect");
                    actionArray.push(cc.delayTime(ANITIME.BOMB_BIRD_DELAY));
                }
                var callFunc = cc.callFunc(function(){
                    this.node.destroy();
                },this);
                actionArray.push(callFunc);
            }
            else if(cmd[i].action == "setVisible"){
                let isVisible = cmd[i].isVisible;
                actionArray.push(cc.callFunc(function(){
                    if(isVisible){
                        this.node.opacity = 255;
                    }
                    else{
                        this.node.opacity = 0;
                    }
                },this));
            }
            else if(cmd[i].action == "toShake"){
                let a= 0;
                let tmpAction = cc.rotateBy(0.4,60);
                actionArray.push(tmpAction);
            }
            curTime = cmd[i].playTime + cmd[i].keepTime;
        }
        this.node.runAction(cc.sequence(actionArray));

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    setSelect: function(flag){
        var animation = this.node.getComponent(cc.Animation);
        var bg = this.node.getChildByName("select");
        if(flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON){
            animation.stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.defaultFrame;
        }
        else if(flag && this.model.status == CELL_STATUS.COMMON){
            animation.play(CELL_STATUS.CLICK);
        }
        else if(flag && this.model.status == CELL_STATUS.BIRD){
            animation.play(CELL_STATUS.CLICK);
        }
        bg.active = flag; 
        this.isSelect = flag;
    }
});
