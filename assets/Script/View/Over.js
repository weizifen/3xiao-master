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
        button:{
            default:null,
            type:cc.Node,
        },
        score:{
            default:null,
            type:cc.Label,
        }
    },

    // use this for initialization
    onLoad: function () {
        var self=this;
        cc.director.preloadScene("game");
        this.button.on("touchstart",function(){
            cc.director.loadScene("game");
        })
        var sco=cc.sys.localStorage.getItem("score");
        self.score.string=sco;
        

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
