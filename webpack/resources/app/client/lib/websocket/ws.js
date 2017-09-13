var Port = 3000;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: Port });

// document.getElementById("port").innerText = "PORT "+Port;

var IO = {};
IO.id  = {};
IO.room = {};
IO.run = {};

wss.on('connection', function(ws) {
    console.log("connection", ws);
    var io = new IOServer(ws,wss);
    IO.emit = io.emit;

    ws.on('message', function(req) {
        Log("接收信息", req);

        var json = {};
        try{
            json = JSON.parse(req);
        }catch (e){
            Log("接收错误消息", req);
        }

        switch (json.type){
            case "conn":
                io.conn(json);
                break;
            case "emit":
                io.emitRun(json);
                break;
            case "next":
                io.nextRun(json);
                break;
            case "log":
                break;
            case "run":
                io.run(json);
                break;
        }


    });

});

class IOServer {
    constructor(ws, wss) {

        this.ws = ws;
        this.wss = wss;
        this.id = "";
        this.room = "";

    }

    connection(ws){
        Log('连接信息', ws);
        this.ws = ws;
    }

    conn(pa) {

        this.id = pa.id;
        //多id兼容
        if(this.id.indexOf("@")){
            this.id = this.id.replace("@" , new Date().getTime() );
        }

        this.room = pa.room?pa.room:"room";

        let val = "conn-ok";

        if(IO.id[this.id]){
            this.clearById(this.id);
            val+= "-clear";
        }

        //注册id
        IO.id[this.id] = {};
        IO.id[this.id].ws = this.ws;
        IO.id[this.id].room = this.room;

        //注册房间
        if(!IO.room[this.room]) IO.room[this.room] = [];
        IO.room[this.room].push(this.id);

        Log("IO创建完成,ID:"+this.id, IO);

        this.emit({type:"conn", key:"conn", val:val, id:this.id, room:this.room});
    }

    emitRun(pa) {
        Log("接收到emit类消息", pa);
        this.emit(pa);
    }

    nextRun(pa) {

        if(!pa.to){
            Log("next类消息没有 - to", pa);
            return;
        }
        //
        Log("接收到next类消息", pa);
        this.next(pa);
    }

    //核心发送
    emit(pa) {
        Log("emit发送",pa);
        let str = JSON.stringify(pa);

        if(pa.to){
            if(IO.id[pa.to] && IO.id[pa.to].ws) IO.id[pa.to].ws.send(str);
        }else{
            this.ws.send(str);
        }
    }
    next(pa) {
        Log("next发送",pa);
        let str = JSON.stringify(pa);

        if(pa.to){
            if(IO.id[pa.to] && IO.id[pa.to].ws) IO.id[pa.to].ws.send(str);
        }
    }

    run(pa) {
        if(IO.run[pa.key]) {
            Log("run信息" , pa);
            IO.run[pa.key](pa, this);
        }else Log("响应函数没有定义，run-key没有" , pa);
    }

    on(key, fn) {
        IO.run[key] = fn;
    }

    clearById(id) {
        if(IO.id[id].ws) IO.id[id].ws.close();
        if(IO.id[id].room) IO.room[IO.id[id].room].remove(id);
        delete IO.id[id];
    }


}

//Log函数
function Log(t, o1, o2) {
    if(!o1) o1 = "";
    if(!o2) o2 = "";
    console.log("Log:"+t , o1, o2);
}


//数组操作
Array.prototype.indexOf = function(val) { for (var i = 0; i < this.length; i++) { if (this[i] == val) return i; } return -1; };
Array.prototype.remove = function(val) { var index = this.indexOf(val); if (index > -1) { this.splice(index, 1); } };