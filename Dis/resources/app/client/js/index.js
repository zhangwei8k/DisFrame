Room.Loader = {};
Room.Loader.ppt = ()=>{
    let Start = "Index";
    cc.ppt(["Loader", Start] , (after)=>{
        cc.m["Loader"].velocity({ opacity: 0 }, { duration: 1000, display:"none"} );
        cc.m[Start].show().velocity({ opacity: [1,0] }, 1000);
    })
};

// Index
Room.Index = {};
Room.Index.dom = ()=>{
    $$("#Index").click(()=>{
        Room.Index.ppt();
    });

    IO.run.play = ()=>{
        if(cc.id!="Index") return;
        if(Dom.handRun) Dom.handRun = 1;
        Room.Index.ppt();
    };

    Dom.wait = 0;
    Time.wait = setInterval(()=>{
        Dom.wait++;
        if(cc.id=="Index") Dom.wait = 0;
        if(Dom.wait == 6) Room.Nav.back();
    },10000);

};
Room.Index.ppt = ()=>{
    Dom._unable.show();
    cc.ppt([cc.id, "Video"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 1000, display:"none"});
        cc.m["Video"].show().velocity({ opacity: [1,0] }, 1000, ()=>{
            after.come();
            Dom._unable.hide();
        });
    });

};


// Video
Room.Video = {};
Room.Video.dom = ()=>{
    Dom.v = $$v("#v");
    Dom.v.volume(0);
};
Room.Video.ppt = ()=>{
    Dom.handRun = 0;
    Dom._unable.show();
    cc.ppt([cc.id, "Nav"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 1000, display:"none", complete:()=>{
            after.go();
        }});
        cc.m["Nav"].show().velocity({ opacity: [1,0] }, 1000, ()=>{
            Dom._unable.hide();
        });
    });
};
Room.Video.come_before = (next)=>{
    Dom.v.play(0);
    Dom.v.playAndFn(0.1, next);
};
Room.Video.come_after = ()=>{
    setTimeout(Room.Video.ppt, 6000);
    Dom.wait = 0;
};
Room.Video.go_after = ()=>{
    Dom.v.pause(0);
};

// Nav
Room.Nav = {};
Room.Nav.dom = ()=>{
    $$("#Nav .next").click(()=>{
        Room.Nav.next();
        Dom.wait = 0;
    });

    $$("#Nav .pre").click(()=>{
        Room.Nav.pre();
        Dom.wait = 0;
    });

    $$("#Nav .nav").click((e)=>{
        //clearTimeout(Time.nav);
        Dom.wait = 0;
        let id = $(e.target).data("id");
        if(id>4) Dom.NavNextPage = 1;
        else Dom.NavNextPage = 0;
        Room.Page.ppt(id);
        //console.log("page"+id);
    });
};
Room.Nav.back = ()=>{
    //clearTimeout(Time.nav);
    //clearTimeout(Time.page);
    Dom.wait = 0;
    Dom._unable.show();
    cc.ppt([cc.id, "Index"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 1000, display:"none"});
        cc.m["Index"].show().velocity({ opacity: [1,0] }, 1000, ()=>{
            Dom._unable.hide();
        });
    });
};
Room.Nav.come_before = (next)=>{
    $$("#Nav .nav").hide();

    if(!Dom.NavNextPage){
        $$("#Nav .pre").velocity("stop").hide();
        $$("#Nav .nav1").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .nav2").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .nav3").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .next").velocity("stop").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
    }else{
        $$("#Nav .next").velocity("stop").hide();
        $$("#Nav .nav4").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .nav5").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .nav6").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .nav7").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
        $$("#Nav .pre").velocity("stop").velocity({opacity:0, translateX:0, translateY:"+=200px"}, { duration: 0}).show();
    }



    //Time.nav = setTimeout(Room.Nav.back, 60000);
    Dom.wait = 0;
    next();
};
Room.Nav.coming = ()=>{

    let delay = 150;
    if(!Dom.NavNextPage){
        $$("#Nav .nav1").velocity({opacity:1, translateY:0}, { duration: 500});
        $$("#Nav .nav2").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*1});
        $$("#Nav .nav3").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*2});
        $$("#Nav .next").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*3}).velocity({translateX:"+=10px"}, { duration: 500, loop:true});
    }else{
        $$("#Nav .nav4").velocity({opacity:1, translateY:0}, { duration: 500});
        $$("#Nav .nav5").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*1});
        $$("#Nav .nav6").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*2});
        $$("#Nav .nav7").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*3});
        $$("#Nav .pre").velocity({opacity:1, translateY:0}, { duration: 500, delay:delay*4}).velocity({translateX:"+=10px"}, { duration: 500, loop:true});
    }


};

Room.Nav.next = ()=>{
    $$("#Nav .next").velocity("stop").velocity({translateY:0}, { duration: 0}).velocity({opacity:0, translateX:200}, { duration: 300});

    $$("#Nav .nav4").velocity({opacity:0, translateX:500}, { duration: 0}).show();
    $$("#Nav .nav5").velocity({opacity:0, translateX:500}, { duration: 0}).show();
    $$("#Nav .nav6").velocity({opacity:0, translateX:500}, { duration: 0}).show();
    $$("#Nav .nav7").velocity({opacity:0, translateX:500}, { duration: 0}).show();
    $$("#Nav .pre").velocity("stop").velocity({opacity:0,translateY:0, translateX:-300}, { duration: 0}).show();

    let delay = 50;
    $$("#Nav .nav1").velocity({opacity:0, translateX:-500}, { duration: 500, display:"none"});
    $$("#Nav .nav2").velocity({opacity:0, translateX:-500}, { duration: 500, display:"none", delay:delay*1});
    $$("#Nav .nav3").velocity({opacity:0, translateX:-500}, { duration: 500, display:"none", delay:delay*2});


    $$("#Nav .nav4").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*4});
    $$("#Nav .nav5").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*5});
    $$("#Nav .nav6").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*6});
    $$("#Nav .nav7").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*7});
    $$("#Nav .pre").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*10}).velocity({translateX:"-=10px"}, { duration: 500, loop:true});
    Dom.wait = 0;
};
Room.Nav.pre = ()=>{

    $$("#Nav .pre").velocity("stop").velocity({translateY:0}, { duration: 0}).velocity({opacity:0, translateX:-300}, { duration: 300});

    $$("#Nav .nav1").velocity({opacity:0, translateX:-500}, { duration: 0}).show();
    $$("#Nav .nav2").velocity({opacity:0, translateX:-500}, { duration: 0}).show();
    $$("#Nav .nav3").velocity({opacity:0, translateX:-500}, { duration: 0}).show();
    $$("#Nav .next").velocity("stop").velocity({opacity:0, translateY:0, translateX:300}, { duration: 0}).show();

    let delay = 50;
    $$("#Nav .nav7").velocity({opacity:0, translateX:500}, { duration: 500, display:"none"});
    $$("#Nav .nav6").velocity({opacity:0, translateX:500}, { duration: 500, display:"none", delay:delay*1});
    $$("#Nav .nav5").velocity({opacity:0, translateX:500}, { duration: 500, display:"none", delay:delay*2});
    $$("#Nav .nav4").velocity({opacity:0, translateX:500}, { duration: 500, display:"none", delay:delay*3});

    $$("#Nav .nav3").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*5});
    $$("#Nav .nav2").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*6});
    $$("#Nav .nav1").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*7});

    $$("#Nav .next").velocity({opacity:1, translateX:0}, { duration: 600, delay:delay*10}).velocity({translateX:"+=10px"}, { duration: 500, loop:true});
    Dom.wait = 0;
};

//Page
Room.Page = {};
Room.Page.dom = ()=> {

    $$(".Page .home").click((e)=>{
        Room.Page.back();
        Dom.wait = 0;
    });

    Dom.swiper = {};
    for(let i=1; i<=7; i++)
        Room.Page.swiper(i);
};
Room.Page.swiper = (id)=>{
    cc.m["Page"+id].show();
    Dom.swiper["p"+id] = new Swiper('#Page'+id+' .swiper-container', {
        paginationClickable: true,
        nextButton: '#Page'+id+' .swiper-button-next',
        prevButton: '#Page'+id+' .swiper-button-prev',
        longSwipesRatio:0.1,
        onTouchEnd: function(swiper){
            Dom.wait = 0;
        },
        onSlideChangeEnd: function(swiper){
            var ids = swiper.container[0].parentNode.id;

            // console.log(swiper);
            // console.log(ids, swiper.activeIndex,swiper.isEnd);
            if(swiper.activeIndex==0){
                $$("#"+ids+" .nav_i1").velocity("stop").velocity({opacity:[0.2, 1]}, { duration: 200});
                $$("#"+ids+" .nav_i3").velocity("stop").velocity({opacity:1}, { duration: 200});
            }else if(swiper.activeIndex==swiper.slides.length-1){
                $$("#"+ids+" .nav_i1").velocity("stop").velocity({opacity:1}, { duration: 200});
                $$("#"+ids+" .nav_i3").velocity("stop").velocity({opacity:[0.2, 1]}, { duration: 200});
            }else{
                $$("#"+ids+" .nav_i1").velocity("stop").velocity({opacity:1}, { duration: 200});
                $$("#"+ids+" .nav_i3").velocity("stop").velocity({opacity:1}, { duration: 200})
            }
        }
    });
    cc.m["Page"+id].hide();
};
Room.Page.ppt = (id)=>{
    console.log("Room.Page.ppt", id);
    Dom._unable.show();
    cc.ppt([cc.id, "Page"+id, "", "Page", "", id] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 900, display:"none"});
        cc.m["Page"+id].show().velocity({ opacity: [1,0] }, 1000, ()=>{
            Dom._unable.hide();
        });
    });
    Dom.wait = 0;
};
Room.Page.back = ()=>{
    console.log("Room.Page.back");
    Dom._unable.show();
    cc.ppt([cc.id, "Nav"] , (after)=>{
        cc.m[cc.old].velocity({ opacity: 0 }, { duration: 900, display:"none"});
        cc.m["Nav"].show().velocity({ opacity: [1,0] }, 1000, ()=>{
            Dom._unable.hide();
        });
    });
    Dom.wait = 0;
};
Room.Page.come_before = (next, id)=>{
    Dom.swiper["p"+id].slideTo(0, 0, false);
    $$(".Page .nav").velocity("stop");
    $$("#Page"+id+" .nav").velocity({ translateY:[0, 300]}, { easing:[200, 20], duration: 1800}).velocity({opacity:[0.3, 1]}, { duration: 300, loop:2, complete:function(){
        if(Dom.swiper["p"+id].activeIndex==0){
            $$("#Page"+id+" .nav_i1").velocity({opacity:[0.2, 1]}, { duration: 200});
        }
    }});

    $$("#Page"+id+" .nav_i1").css({opacity:1});
    $$("#Page"+id+" .nav_i3").css({opacity:1});


    //Time.page = setTimeout(Room.Nav.back, 180000);
    Dom.wait = 0;
    next();
};