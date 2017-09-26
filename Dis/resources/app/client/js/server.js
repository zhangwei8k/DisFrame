var Progress = function(num){
    Log("$$$$【Server.loader】目前完成："+num+"%");
    if(num==100) num=99;
    $$("#Loader .word").html("正在更新资料中，已完成："+num+"%");
};

var Download ={};
Download.Page1 = function(){

    var serv = conf.server+"/uploads/page1/";
    var serc = conf.server+"/uploads/page1_case/";
    var local = Url.fs+"uploads/page1/";
    psave("p1_1");
    psave("p1_2");
    psave("p1_3");
    psave("p1_4");
    psave("p1_5");
    psave("p1_6");


    function psave(p){
        for(var i in Base.page1[p]){
            var rs = Base.page1[p][i];
            if(rs.menu) Server.save(serv , local, rs.menu, rs.menu_size);
            if(rs.img) Server.save(serv , local, rs.img, rs.img_size);
            if(rs.pic) Server.save(serv , local, rs.pic, rs.pic_size);
            if(rs.pic_en) Server.save(serv , local, rs.pic_en, rs.pic_en_size);

            for(var j in rs.case){
                if(rs.case[j]) Server.save(serc , local, rs.case[j], rs.case_size[j]);
            }
        }
    }
};

Download.Page2 = function(){

    var serv = conf.server+"/uploads/page2/";
    var local = Url.fs+"uploads/page2/";
    psave("p2_1");
    psave("p2_2");
    psave("p2_3");
    psave("p2_4");


    function psave(p){
        for(var i in Base.page2[p]){
            var rs = Base.page2[p][i];
            if(rs.img) Server.save(serv , local, rs.img, rs.img_size);
            if(rs.pic) Server.save(serv , local, rs.pic, rs.pic_size);

        }
    }
};