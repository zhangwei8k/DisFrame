var Dis = {},
    cc = {},
    Room = {},
    Time = {},
    Ticker = {},
    Dom = {},
    Base = {},
    $$, $$v,
    FS, http;


cc.id = "Loader";

//获取Dom优化
$$ = (key) => {
    if(Dom[key]) return Dom[key];
    Dom[key] = $(key);
    return Dom[key];
};
$$v = (key) => {
    if (Dom[key]) return Dom[key];
    Dom[key] = new Media(key);
    return Dom[key];
};

//Dis运行库
Dis.ini = ()=>{
    cc.m = {};
    $("section.cc").each((i, e)=> {
        let dom = $(e);
        cc.m[dom.attr("id")] = dom;
    })
};

Dis.do = function(){
    for(let id in Room) {
        if(Room[id].dom) Room[id].dom();
    }
};

//cc工具组
cc.ppt = (id, transition)=>{
    //id:["go","come"]
    //transition(go_before, going, go_after, come_before, coming, come_after, callback):过渡动画 //传入Rooms[id[0]].go_before等
    //callback，完成后回调，或直接回调

    //容错
    if(!id[0] || !id[1]) {
        console.log("id设置错误", pa);
        return
    }

    //判断是否自己重复过场
    if(id[0]==id[1]) {
        //if(callback) callback();
        return
    }

    cc.old = id[0];
    cc.id = id[1];

    if(id[2]) id[0] = id[2];
    if(id[3]) id[1] = id[3];
    let go_para = "",
        come_para = "";
    if(id[4]) go_para = id[4];
    if(id[5]) come_para = id[5];

    //回调
    let after = {};
    if(!Room[id[0]]) Room[id[0]] = {};
    if(!Room[id[1]]) Room[id[1]] = {};

    if(Room[id[0]].go_after) after.go = Room[id[0]].go_after;
    if(Room[id[1]].come_after) after.come = Room[id[1]].come_after;

    if(Room[id[0]].go_before) {
        Room[id[0]].go_before(()=>{
            if(Room[id[1]].come_before) {
                Room[id[1]].come_before(()=>{
                    if(Room[id[0]].going) Room[id[0]].going(go_para);
                    if(Room[id[1]].coming) Room[id[1]].coming(come_para);
                    transition(after, go_para, come_para);
                }, come_para);
            }else{
                if(Room[id[0]].going) Room[id[0]].going(go_para);
                if(Room[id[1]].coming) Room[id[1]].coming(come_para);
                transition(after, go_para, come_para);
            }
        }, go_after);
    }else{
        if(Room[id[1]].come_before) {
            Room[id[1]].come_before(()=>{
                if(Room[id[0]].going) Room[id[0]].going(go_para);
                if(Room[id[1]].coming) Room[id[1]].coming(come_para);
                transition(after, go_para, come_para);
            }, come_para);
        }else{
            if(Room[id[0]].going) Room[id[0]].going(go_para);
            if(Room[id[1]].coming) Room[id[1]].coming(come_para);
            transition(after, go_para, come_para);
        }
    }
};

// libs.setTicker = function(fps){
//     createjs.Ticker.setFPS(fps);
//     createjs.Ticker.addEventListener("tick", function(){
//         $.each(Ticker, function(i, fn) { fn() })
//     })
// };
// libs.base = function(fn){
//
//     $.getJSON("../../uploads/base.json", function(data) {
//         Base = data;
//         console.log("Base准备完毕" , Base);
//         if(fn) fn();
//     });
// };
// libs.server = function(fn){
//
//     FS = require('fs');
//     http = require('http');
//
//     if(!conf) return;
//     if(!conf.server) return;
//     var url = conf.server+"/uploads/data.php";
//
//     $.getJSON("../../uploads/base.json", function(data) {
//
//         console.log(url);
//         $.ajax({
//             type:'get',
//             async:false,
//             url:url,
//             cache:false,
//             dataType:'jsonp',//传递给请求处理程序，用以获得jsonp回调函数名的参数名(默认为:callback)
//             jsonp:'jsoncallback', //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
//             jsonpCallback:"success_jsonpCallback", //成功获取跨域服务器上的json数据后,会动态执行这个callback函数
//             success: function(json){
//                 console.log("数据服务器连接成功！获取数据：" , json);
//                 //是否更新判断
//                 Server.sync(json, data, fn);
//             },
//             error:function(){
//                 console.log("数据服务器连接失败！", url);
//                 Base = data;
//                 console.log("Base准备完毕" , Base);
//                 fn();
//             }
//         });
//     });
//
//
//
//
// };


cc.ticker = function(id, fn){
    Ticker[id] = function(){
        if(cc.m[id].is(':visible')) fn();
        else delete Ticker[id];
    }
};
cc.clsTicker = function(id){
    delete Ticker[id];
};



var Loads = {};
Loads.list = [];
Loads.loading = function(manifest){
    Loads.que = new createjs.LoadQueue();
    Loads.que.installPlugin(createjs.Sound);

    if(Loads.progress) Loads.que.on("progress", Loads.progress, this);
    if(Loads.complete) Loads.que.on("complete", Loads.complete, this);
    if(!manifest) manifest = Loads.list;
    Loads.que.loadManifest(manifest)
};
Loads.loads = function(id, src, fi, tp){
    //{id: "player1", src:"uploads/stage1/player1.png"}
    //{id:"sound", src:"http://path/to/sound.mp3"}
    Loads.list.push({id:id, src:(src?src:"")+fi})
};
Loads.get = function(id){
    return Loads.que.getResult(id)
};
// Loads.progress(e) e.loaded
// Loads.complete() Loads.que.getResult("image")




//Sever 函数
var Url = {};
Url.fs  = "resources/";//fs的时候的相对地址
Url.upload = "../uploads/";
var Server = {};
//资料下载前判断
Server.sync = function(web, local, fn){

    Log("【Server.sync】：开始进入同步判断");
    if(!web.date) alert("【Server.sync】：没有取到date");

    if(web.date == local.date && local.download_finish) {
        Log("【Server.sync】 无需更新：json的date一样，开始运行");
        Base = local;
        console.log("Base准备完毕" , Base);
        fn();
    }else{
        Log("【Server.sync】 需要更新：json的date不一样,开始更新数据", web);
        Base = web;
        Server.update(fn);
    }


};

//下载资源,更新
Server.update = function(fn){
    Log("【Server.update】 ：更新数据");
    Server.download();
    Lock.open("update", 3000, function(){
        Log("【Server.update】 下载全部完成，验证下载文件");
        if(Progress) Progress(99, "验证下载文件: ");
        Server.update_check(fn);
    });
};

//从服务器获取资源
Server.download = function(){

    Log("【Server.download】： 从服务器获取资源");

    Base.download_finish = 0;
    Server.download_list = [];
    //生成base.json
    FS.writeFile(Url.fs+'uploads/base.json', JSON.stringify(Base, null, 4) , function (err) {
        if (err) {
            Logwt("【Server.download】 FS.writeFile写json： 出现错误");
        }
    });

    Lock.set("update");
    for(var nm in Download){
        Download[nm]();
    }
    setTimeout(function(){
        Lock.cls("update", function(){
            Progress(parseInt(100-(Lock.nm["update"]*100/Lock.len["update"])));
        });
    },3000);
};

Server.save = function(webUrl, fileUrl, rs, filesize, lock){

    if(!lock) lock="update";
    Lock.set(lock);

    var webFile = webUrl+rs;
    var localFile = fileUrl+rs;

    Log("【Server.save】： 正在获取"+webFile+"文件");

    FS.exists(localFile, function(exists) {
        if (exists) {
            Log("【Server.save】："+localFile+":文件已经存在！！判断文件是否完整...");

            var fileSync = FS.statSync(localFile);

            if (filesize != fileSync.size) {
                Log("【Server.save】：" + filesize + "===" + fileSync.size + "(" + (filesize == fileSync.size)+")");
                _save(webFile, localFile, filesize, fileSync.size, lock);

            }
            else {
                Log("【Server.save】：" + localFile+":文件完整,跳过！");
                Lock.cls(lock, function(){
                    Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                });
            }

        } else {
            Log("【Base._save_file】： 正在获取"+webFile+'--'+localFile+"文件");
            //_save(webFile, localFile, filesize, fileSync.size, lock);
            _save(webFile, localFile, filesize, 0, lock);
        }
    });

    //保存到本地
    function _save(url, file, size, mysize, lock){
        Server.download_list.push({file:localFile, size:size, mysize:mysize});
        http.get(url, function(res){
            var writestream = FS.createWriteStream(file);
            writestream.on('close', function(err) {
                // callback(null, res);
                if(err){
                    Logwt("【Server.save】 失败!： 获取"+url+"文件", err);
                    Lock.cls(lock, function(){
                        Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                    });
                }else{
                    Log("【Server.save】 成功： 获取"+url+"文件");
                    //Logs("【Server._save_file】 成功： 获取"+url+file+"文件");
                    Lock.cls(lock, function(){
                        Progress(parseInt(100-(Lock.nm[lock]*100/Lock.len[lock])));
                    });
                }
            });
            res.pipe(writestream);

        });
    }
};

//下载资源,更新后验证
Server.update_check_num = 0;
Server.update_check = function(fn){
    if(!Server.download_list.length){
        Log("【Server.update_check】 下载全部完成",Base);

        Base.download_finish = 1;
        FS.writeFile(Url.fs+'uploads/base.json', JSON.stringify(Base, null, 4) , function (err) {
            if (err) {
                Logwt("【Server.update_check】 FS.writeFile写json： 出现错误");
            }
        });

        fn();
        return;
    }

    if(Server.update_check_num){
        Log("【Server.update_check】 下载存在问题，先执行程序");

        var err = {};
        err.list = Server.download_list;
        err.date = new Date();
        FS.writeFile(Url.fs+'uploads/err.json', JSON.stringify(err, null, 4) , function (err) {
            if (err) {
                Logwt("【Server.update_check】 FS.writeFile写json： 出现错误");
            }
        });
        fn();
        return;
    }

    Server.update_check_num++;
    Server.update(fn);
};

//////////////////////////// Lock辅助锁函数 ///////////////////////////////
var Lock = {};
//运行锁，加1锁减1锁
Lock.nm  = new Array();
Lock.len = new Array();
Lock.set = function(nm){
    if(!Lock.nm[nm]) {
        Lock.nm[nm]  = 1;
        Lock.len[nm] = 1;
    } else {
        Lock.nm[nm]++;
        Lock.len[nm]++;
    }
};
Lock.cls = function(nm, fn){
    if(Lock.nm[nm]<=0) {
        Lock.nm[nm] = 0;
        //Log("【Lock.cls】=>Bug : Lock"+nm+"为0时还有cls事件");
    }else if(!Lock.nm[nm]){
        Lock.nm[nm] = 0;
        //Log("【Lock.cls】=>Bug : Lock"+nm+"不存在并有cls事件");
    }else {
        //Log("【Lock.cls】:被解锁"+nm);
        Lock.nm[nm] = parseInt(Lock.nm[nm])-1;
        if(fn) fn();
    }
};
Lock.open = function(nm, t, fn){
    var hand_num = 0;
    var hand = setInterval(function(){
        hand_num++;

        //Log("@【Lock.open】:试探"+hand_num+"次，用时"+(hand_num*t/1000)+"秒");

        if(Lock.nm[nm]==0) {
            //Log("@【Lock.open】完成");
            clearInterval(hand);
            setTimeout(function(){ fn(); },3);
        }
        if(hand_num==90) {
            //Log("@【Lock.open】-bug:试探"+hand_num+"次，用时"+(hand_num*t/1000)+"秒，现在要继续运行了");
            clearInterval(hand);
            setTimeout(function(){ fn(); },3);
        }
    }, t);
};
//等待多少时间开始运行下一个程序
Lock.hand = new Array();
Lock.wait = function(pa, fn){
    //pa.nm 关键字
    //pa.time 等待时间
    //pa.fn 等待每1秒的回调函数
    //fn 完成后的回调函数
    //Log("【Lock.wait】("+pa.nm+")：等待"+pa.time+"秒,开始运行程序");

    var time = 0;
    Lock.hand[pa.nm] = setInterval(function(){
        time++;
        //Log("@【Lock.wait】("+pa.nm+")：等待中，运行了"+time+"秒");
        if(pa.fn) pa.fn(time);

        if(time>=pa.time) {
            //Log("@【Lock.wait】("+pa.nm+")：等待完成，运行了"+time+"秒");
            clearInterval(Lock.hand[pa.nm]);

            setTimeout(function(){ if(fn)fn(); },1);
        }
    }, 1000);
};
Lock.wait_cls = function(nm){
    //Log("【Lock.wait_cls】("+nm+")：清理完毕");
    clearInterval(Lock.hand[nm]);
};
//保存错误记录
var Logwt = function (w , obj) {
    console.log(w);
    if(obj) console.log(obj);

    if(!Url.web){
        var d = new Date();
        FS.appendFile(Url.fs+'uploads/log.txt', w+'['+d+']'+"\n\t");
    }

};
//用于输出测试，正式运行时可以注释下面程序
var Log = function(w , obj){
    console.log(w);
    if(obj) console.log(obj);
};



//其他公共函数
function in_array(stringToSearch, arrayToSearch) {
    for (var s = 0; s < arrayToSearch.length; s++) {
        var thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}

function getPara(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var hours = date.getHours();
    if (hours <= 9) {
        hours = "0" + hours;
    }

    var ms = date.getMinutes();
    if (ms <= 9) {
        ms = "0" + ms;
    }

    var second = date.getSeconds();
    if (second <= 9) {
        second = "0" + second;
    }
    // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    //     + " " + date.getHours() + seperator2 + date.getMinutes()
    //     + seperator2 + date.getSeconds();

    var currentdate = strDate + seperator1 + month + seperator1 + date.getFullYear() + "&nbsp;&nbsp;&nbsp;" + hours + seperator2 + ms + seperator2 + second;

    return currentdate;
}