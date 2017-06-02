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
        flash:{
            default:[],
            url:cc.AudioClip,
        },
    },

    // use this for initialization
    onLoad: function () {
        
    },
    next(){
        this.hard();
        cc.director.loadScene("game");
    },
    hard(){
      global.GAME_HARD-=0.05;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
