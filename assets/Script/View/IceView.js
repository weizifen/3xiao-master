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
        
    },

    // use this for initialization
    onLoad: function () {
    },
    initWithModel(model){
        this.model = model;
        if(!this.model.isDisplay){
            this.node.active=false;
        }
        var x = model.startX;
        var y = model.startY;
        this.node.x = CELL_WIDTH * (x - 0.5);
        this.node.y = CELL_HEIGHT * (y - 0.5);
        // this.updateIce();

    },
    // updateIce(){
    //      if(this.model.isDisplay){
    //         this.node.active=true;
    //     }else{
    //         this.node.active=false;
    //     }
    // }

    // 更新冰块状态
    updateWithModel(model){
        var flag=true;
        var self=this;
        // console.log(model);
        if(!model.isDisplay){
            // 动画
            var actionArray=[];
            let animation = this.node.getComponent(cc.Animation);
            animation.play("Ice");
            actionArray.push(cc.delayTime(2));
            var callFunc = cc.callFunc(function(){
                self.node.active=false;
                },this);
            actionArray.push(callFunc);
            this.node.runAction(cc.sequence(actionArray));
        }

    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
