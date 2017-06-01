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
        SpriteFrame:{
            default: [],
            type: cc.SpriteFrame
        },
        bgm:{
            default:null,
            url:cc.AudioClip,
        },    
        
    },

    // use this for initialization
    onLoad: function () {
        cc.audioEngine.play(this.bgm,0.3);

    },
    play(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("game");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
