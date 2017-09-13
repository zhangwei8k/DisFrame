Dis.Server = {};
Dis.View = {};

Dis.loader = ()=>{
    Dom._unable = $("#_unable");

    for(var i=1; i<=7; i++){
        Dis.view(i);
    }

    Dis.ini();
    Dis.do();
    setTimeout(Room.Loader.ppt , 500);
};

Dis.view = (id)=>{

    var html = "";
    for(var i=1; i<=Dis.conf["p"+id]; i++){
        html+= '<div class="swiper-slide"><img src="../../../../assets/img/page'+id+'/'+i+'.png" alt=""></div>';
    }

    $("#Page"+id+" .swiper-wrapper").html(html);
};