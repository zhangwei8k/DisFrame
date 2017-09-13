//////////////////////////////// 视频控制函数 ////////////////////////////////
function Media(id, video){
    if(video) this.m = $(video);
    else this.m = $(id);
}
Media.prototype.play = function(i){
    if(!this.m.length) return;
    if(i || i===0) this.m[0].currentTime=i;
    //Log("【Media.play】开始播放：（从第"+this.m[0].currentTime+"开始）");
    this.m[0].play();
};
Media.prototype.pause = function(i){
    if(!this.m.length) return;
    //Log("【Media.pause】：停止播放");
    if(i || i===0) this.m[0].currentTime=i;
    this.m[0].pause();
};
Media.prototype.stop = function(i, fn){
    if(!this.m.length) return;
    //Log("【Media.stop】：设定视频播放到"+i+"秒后停止播放");
    this.m.bind('timeupdate', function(){
        if(this.m[0].currentTime>=i) {
            //Log("@【Action.stop】=>已播放"+i+"秒：停顿");
            this.m.unbind('timeupdate');
            this.pause();
            if(fn) fn();
        }
    }.bind(this));
};
Media.prototype.playAndFn = function(i, fn){
    if(!this.m.length) return;
    //Log("【Media.stop】：设定视频播放到"+i+"秒后停止播放");
    this.m.bind('timeupdate', function(){
        if(this.m[0].currentTime>=i) {
            //Log("@【Action.stop】=>已播放"+i+"秒：停顿");
            this.m.unbind('timeupdate');
            if(fn) fn();
        }
    }.bind(this));
};
Media.prototype.end = function(fn){
    if(!this.m.length) return;
    //Log("【Media.end】：视频结束后运行");
    this.m.bind('ended', function(){
        //Log("@【Media.end】：视频结束ended");
        this.m.unbind('ended');
        fn();
    }.bind(this));
};
Media.prototype.ended = function(fn){
    if(!this.m.length) return;
    //Log("【Media.end】：视频结束后运行");
    this.m.bind('ended', function(){
        //Log("@【Media.end】：视频结束ended");
        fn();
    }.bind(this));
};
Media.prototype.set = function(i){
    if(!this.m.length) return;
    //Log("【Media.set】：设置视频跳到第"+i+"秒");
    this.m[0].currentTime = i;
};
Media.prototype.get = function(){
    if(!this.m.length) return;
    //Log("【Media.set】：设置视频跳到第"+i+"秒");
    return this.m[0].currentTime;
};
Media.prototype.unbind = function(id){
    if(!this.m.length) return;
    //Log("【Media.unbind】：清除所有绑定");
    if(id) this.m.unbind(id);
    else{
        this.m.unbind('ended');
        this.m.unbind('timeupdate');
    }

};

Media.prototype.para = function(pa){
    for(var p in pa){
        this.m[0][p] = pa[p];
    }
};

Media.prototype.volume = function(num){
    if(!this.m.length) return;
    //Log("【Media.unbind】：清除所有绑定");
    if(num || num===0)
        this.m[0].volume = num;
    else return this.m[0].volume;
};