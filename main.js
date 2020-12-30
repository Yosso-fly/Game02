enchant();

class Gobject{

    src;
    img_width;
    img_height;
    info;
    
    constructor(gamecore, img_width, img_height, src){
        this.src = src;
        this.img_width = img_width;
        this.img_height =img_height;
        gamecore.preload(src);
    }

    load(gamecore, scale) {
        this.info = new Sprite(this.img_width, this.img_height);
        this.info.image = gamecore.assets[this.src];

        this.info.px = 0;
        this.info.py = 0;
        this.info.scaleX = scale;
        this.info.scaleY = scale;

        this.info.x_velocity = 0;
        this.info.max_x_velocity = 0;
        this.info.acceleration = 0;

        this.info.y_velocity = 0;
        this.info.max_y_velocity = 0;
        this.info.gravity = 0; 
        this.info.is_hooked = false;
        this.info.hook = 0;
        this.info.gravity_adjust = 0;
        this.info.jump_y_velocity = 0;

        
    }

    set_loop_func(loop_func){
        this.info.addEventListener("enterframe", loop_func);
    }

    set_touch_func(touch_func){
        player.addEventListener("touchstart", touch_func);
    }


}


window.onload = function(){

    var game = new Core(500, 500);

    game.fps = 28;
    
    var bgsurface = new Surface(game.width, game.height*2);
    var cr = bgsurface.context;
    
    var grad = cr.createLinearGradient(0,0,0,game.height*2);
    grad.addColorStop(0.0, "rgb(130,210,240)");
    grad.addColorStop(1.0, "rgb(200,100,50)");
    cr.fillStyle = grad;
    cr.beginPath();
    cr.fillRect(0,0,game.width, game.height*2);

    var titlesurface = new Surface(game.width, game.height);
    var cr = titlesurface.context;
    cr.fillStyle = "rgb(50,50,50)";
    cr.fillRect(0,0,game.width, game.height);

    var time_limit = 5;
    var mastertime = 0;
    var masterscore = 0;
    var player_for_right = true;

    var player = new Gobject(game, 32, 42, "resources/f_idle.png");
    //game.preload("resources/f_idle.png");
    game.preload("resources/f_fall.png");
    game.preload("resources/f_jump.png");
    game.preload("resources/f_walk.png");
    game.preload("resources/panel.png");
    game.preload("resources/mountain.png");
    game.preload("resources/shrine.png");
    game.preload("resources/char.png");
    game.preload("resources/resultimg.png");
    game.preload("resources/titleimg.png");
    game.preload("resources/ui.png");
    game.preload("resources/stagels.png");
    game.preload("resources/details.png");
    game.preload("resources/fortune.png");
    game.preload("resources/fortune_details.png");

    let stagetile_width_split  = 20;
    let stagetile_height_split = 20;
    let stagetile_width_sum = game.width+game.width/10;
    let stagetile_height_sum = game.height+game.height/10;
    let stagetile_width = stagetile_width_sum/stagetile_width_split;
    let stagetile_height = stagetile_height_sum/stagetile_height_split;

    let hook_edge = stagetile_width*0.7;
    let hook_foot = stagetile_width*0.25;

    let wall_edge = stagetile_width*0.7;

    let base_player_x = stagetile_width_sum/2;
    let base_player_y = stagetile_height_sum/2;

    var stagetile = new Array(stagetile_height_split);
    var bgtile = new Array(stagetile_height_split);
    var mountain = new Sprite(1000, 300);
    var shrine= new Sprite(128,128);
    var label = new Array(10);
    var background = new Sprite(game.width, game.height*2);
    var titleground = new Sprite(game.width, game.height);
    var ui = new Sprite(64, 32);
    var ui_twitter = new Sprite(64, 32);
    var map = new Sprite(125,173);
    var startdetail = new Sprite(192,32);
    var icon_fly = new Sprite(16,16);
    var icon_shrine = new Sprite(16,16);
    var result_fortune = new Sprite(64,32);
    var result_detail_l = new Sprite(64,64);
    var result_detail_r = new Sprite(64,64);

    var titleimg = new Sprite(256, 256);
    var started = false;
    var share_time = 0;
    let share_time_max = 20;
    var text_main = "";

    var charsize = stagetile_width*0.5;
    let label_value = 4;
    var exptime = 0;

    // SX, SY, EX, EY, COLLISION
    var hooks = [
        //[0,284,300,284, -1]
    ];

    // X, SY, EY, COLLISION
    var walls = [
        [4518, 0, 10000, 1]
    ];
    
    var scene = 0;

    var ui_twitter_func = function (){
        if(share_time != share_time_max) return;
        var urltext ="https://twitter.com/share?text="+encodeURIComponent(text_main)+"&url="+encodeURIComponent(location.href);
        window.open(urltext, '', 'width=580,height=400,menubar=no,toolbar=no,scrollbars=yes');
        share_time = 0;
    }


    game.onload = function(){

        var preprocess = function() {

            for(i = 0; i< label.length; i++){
                label[i] = new Sprite(11, 16);
                label[i].image = game.assets["resources/char.png"];
            }

            label[1].frame = 11;
            label[9].frame = 10;



            for(ih = 0; ih<stagetile_height_split; ih++){
                stagetile[ih] = new Array(stagetile_width_split);
                bgtile[ih] = new Array(stagetile_width_split);
                for(iw = 0; iw<stagetile_width_split; iw++){
                    
                    stagetile[ih][iw] = new Sprite(16, 16);
                    stagetile[ih][iw].image = game.assets["resources/panel.png"];
                    stagetile[ih][iw].x = iw*stagetile_width;
                    stagetile[ih][iw].y = ih*stagetile_height;


                    stagetile[ih][iw].scaleX = stagetile_width/16;
                    stagetile[ih][iw].scaleY = stagetile_height/16;

                    // bg

                    bgtile[ih][iw] = new Sprite(16, 16);
                    bgtile[ih][iw].image = game.assets["resources/panel.png"];
                    bgtile[ih][iw].x = iw*stagetile_width;
                    bgtile[ih][iw].y = ih*stagetile_height;


                    bgtile[ih][iw].scaleX = stagetile_width/16;
                    bgtile[ih][iw].scaleY = stagetile_height/16;

                    
                    game.rootScene.addChild(bgtile[ih][iw]);
                    game.rootScene.addChild(stagetile[ih][iw]);
                    
                    

                }
            }

            for(iw = 0; iw< stagedata[0].length; iw++){
                for(ih = 0; ih< stagedata.length; ih++){
                    var data_seg = stagedata[ih][iw]%100;
                    if(data_seg ==  1 || data_seg ==  6 || data_seg == 13 || data_seg == 14
                    || data_seg == 16 || data_seg == 31 || data_seg == 33 || data_seg == 34
                    || data_seg == 41 || data_seg == 46 || data_seg == 53 || data_seg == 54
                    || data_seg == 56 || data_seg == 71 || data_seg == 73 || data_seg == 74
                    || data_seg == 81 || data_seg == 86 || data_seg == 93 || data_seg == 94){
                        var hook_x = iw*stagetile_width;
                        var hook_y = ih*stagetile_height;
                        hooks.push([
                            hook_x-hook_edge,
                            hook_y+hook_foot,
                            hook_x+stagetile_width*1.5+hook_edge,
                            hook_y+hook_foot,
                            1]);
                    }

                    if(data_seg == 20 || data_seg == 21 || data_seg == 22 || data_seg ==  3 || data_seg ==  4
                    || data_seg == 35 || data_seg == 36 || data_seg == 37 || data_seg == 33 || data_seg == 34
                    || data_seg == 60 || data_seg == 61 || data_seg == 62 || data_seg == 53 || data_seg == 54
                    || data_seg == 75 || data_seg == 76 || data_seg == 77 || data_seg == 73 || data_seg == 74
                    /*|| data_seg == 95 || data_seg == 96 || data_seg == 97*/){
                        var hook_x = iw*stagetile_width;
                        var hook_y = ih*stagetile_height;
                        hooks.push([
                            hook_x+stagetile_width-hook_edge,
                            hook_y+stagetile_height*1.5,
                            hook_x+stagetile_width*0.5+hook_edge,
                            hook_y+stagetile_height*1.5,
                            -1]);
                    }

                    var wall_x = iw*stagetile_width;
                    var wall_y = ih*stagetile_height;

                    if(data_seg == 10 || data_seg == 14
                    || data_seg == 25 || data_seg == 34
                    || data_seg == 50 || data_seg == 54
                    || data_seg == 65 || data_seg == 74
                    || data_seg == 4  || data_seg == 24
                    || data_seg == 44 || data_seg == 64
                    //|| data_seg == 84
                    /*|| data_seg == 90 || data_seg == 95*/){

                        walls.push([
                            wall_x + stagetile_width*1.5,
                            wall_y - wall_edge,
                            wall_y + stagetile_height*2.5,// - wall_edge * (data_seg%10 == 4 && Math.floor(data_seg/10)%100 %2 == 0),
                            1]);
                    }

                    if(data_seg == 12 || data_seg == 13
                    || data_seg == 27 || data_seg == 33
                    || data_seg == 52 || data_seg == 53
                    || data_seg == 67 || data_seg == 73
                    || data_seg == 3  || data_seg == 23
                    || data_seg == 43 || data_seg == 63
                    //|| data_seg == 83
                    /*|| data_seg == 92 || data_seg == 93*/){

                        walls.push([
                            wall_x + stagetile_width*0.5,
                            wall_y - wall_edge,
                            wall_y + stagetile_height*2.5,// - wall_edge * (data_seg%10 == 3 && Math.floor(data_seg/10)%100 %2 == 0),
                            -1]);
                    }
                }
            }
            mountain.image = game.assets["resources/mountain.png"];
            shrine.image = game.assets["resources/shrine.png"];
            result_fortune.image = game.assets["resources/fortune.png"];
            result_detail_l.image = game.assets["resources/fortune_details.png"];
            result_detail_r.image = game.assets["resources/fortune_details.png"];
        }

        var gamephase = function (){


            
            background.image = bgsurface;

            for(i = 0; i< label.length; i++){
                label[i].x = 10+(i>=label_value)*20+i*charsize;
                label[i].y = 10;
                label[i].scaleX = charsize/label[i].width;
                label[i].scaleY = charsize/label[i].width;
            }

            //let phisics_speed = 60/game.fps;

            player.info.x = base_player_x;
            player.info.y = base_player_y;

            //player.info.px = 2950;
            //player.info.py = 1200;
            player.info.px = 400;
            player.info.py = 4800;
            player.info.is_hooked = false;
            if(game.fps == 28){
                player.info.acceleration = 2;
                player.info.max_x_velocity = 12;
                player.info.x_friction = 0.6;
    
                player.info.gravity = 2.6;
                player.info.max_y_velocity = 14;
                player.info.jump_y_velocity = 24;
                player.info.gravity_adjust = 0.6;

 
                
                //player.info.hook = 0;
            }
            else if(game.fps == 60){
                player.info.acceleration = 1;
                player.info.max_x_velocity = 5;
                player.info.x_friction = 0.8;
        
                player.info.gravity = 0.6;
                player.info.max_y_velocity = 8;
                player.info.jump_y_velocity = 11;
                player.info.gravity_adjust = 0.6;
            }

            mastertime = time_limit*game.fps;
            masterscore = 0;
            

            shrine.scaleX =player.info.scaleX;
            shrine.scaleY =player.info.scaleY;
            shrine.x =game.width;
            shrine.y =player.info.y - (shrine.height-player.info.height)*shrine.scaleY;
            

            for(iw = 0; iw< stagedata[0].length; iw++){
                for(ih = 0; ih< stagedata.length; ih++){
                    //var data_seg = stagedata[ih][iw]%100;
                    while(stagedata[ih][iw]/100 >= 2){
                        stagedata[ih][iw] -= 100;
                    }

                }
            }

            
        }

        function set_tile_frame(iw, ih, tile_bpx, tile_bpy){


            var tile_px = Math.floor(tile_bpx);
            var tile_py = Math.floor(tile_bpy);

            if(ih+tile_py < 0 || ih+tile_py >= stagedata.length || iw+tile_px < 0 || iw+tile_px >= stagedata[0].length ) return;



            var data = Math.floor(stagedata[ih+tile_py][iw+tile_px]);
            var framenum_x = stagetile[ih][iw].image.width / stagetile[ih][iw].width;

            bgtile[ih][iw].x = iw*stagetile_width  - (tile_bpx-tile_px) * stagetile_width ;
            bgtile[ih][iw].y = ih*stagetile_height - (tile_bpy-tile_py) * stagetile_height;


                if(ih+tile_py > 180) bgtile[ih][iw].frame = framenum_x * 2 + 8;
            else if(ih+tile_py > 177) bgtile[ih][iw].frame = framenum_x * 1 + 8;

            if(ih+tile_py <= 177){
                bgtile[ih][iw].visible = false;
            }
            else bgtile[ih][iw].visible = true;

            if(data%100 == 99 || Math.floor(data/100) == 2){
                stagetile[ih][iw].visible = false;
                return;
            }
            else stagetile[ih][iw].visible = true;

            

            stagetile[ih][iw].frame = (Math.floor(data/10)%10) * framenum_x + data%10;

            var pih = Math.ceil(player.info.y/stagetile_height);
            var piw = Math.ceil(player.info.x/stagetile_width);

            if((ih == pih || ih == pih+1) && (iw == piw || iw == piw+1) && stagedata[ih+tile_py][iw+tile_px]/100 < 2){

                var bf_score = masterscore;

                switch(stagedata[ih+tile_py][iw+tile_px]%100){
                    case 48:
                        masterscore += 1;
                        break;
                    case 49:
                        masterscore += 5;
                        break;
                    case 58:
                        masterscore += 10;
                        break;
                    case 59:
                        masterscore += 50;
                        break;
                }

                if(masterscore != bf_score)stagedata[ih+tile_py][iw+tile_px] += 100;
            }

            stagetile[ih][iw].x = bgtile[ih][iw].x;
            stagetile[ih][iw].y = bgtile[ih][iw].y;
        };

        var titlephase = function(){
            titleground.image = titlesurface;
            game.rootScene.addChild(titleground);
            titleimg.image = game.assets["resources/titleimg.png"];
            titleimg.scaleX = game.width/titleimg.width*0.75;
            titleimg.scaleY = titleimg.scaleX;
            titleimg.x = game.width*0.26;
            titleimg.y = -game.height*0.2;
            game.rootScene.addChild(titleimg);
            ui.image = game.assets["resources/ui.png"];
            ui.scaleX = stagetile_width*5/ui.width;
            ui.scaleY = ui.scaleX;
            ui.x = (stagetile_width_split-5)/2*stagetile_width;
            ui.y = game.height*0.8;
            ui.frame = 4;
            game.rootScene.addChild(ui);

            ui_twitter.image = game.assets["resources/ui.png"];
            ui_twitter.scaleX = stagetile_width*5/ui_twitter.width;
            ui_twitter.scaleY = ui_twitter.scaleX;
            ui_twitter.frame = 8;
            
            
        }

        var titlefunc = function() {
            titleimg.y += (game.height*(0.1+started*1.01) - titleimg.y)*0.2*(60/game.fps);

            if(titleimg.y > game.height){
                scene = 1;
                game.rootScene.removeChild(titleimg);
                game.rootScene.removeChild(ui);
                expphase();
            }
            
        }

        var expphase = function(){
            map.image = game.assets["resources/stagels.png"];
            map.scaleX = stagetile_width*10/map.width;
            map.scaleY = map.scaleX;
            map.x = game.width * 0.36;
            map.y = -game.height * 0.3;
            game.rootScene.addChild(map);

            startdetail.image = game.assets["resources/details.png"];
            startdetail.scaleX = stagetile_width*12/startdetail.width;
            startdetail.scaleY = startdetail.scaleX;
            startdetail.x = game.width * 0.3;
            startdetail.y = game.height * 0.82;
            game.rootScene.addChild(startdetail);

            var framenum_x = stagetile[0][0].image.width / stagetile[0][0].width;

            icon_fly.image = game.assets["resources/panel.png"];
            icon_fly.scaleX = stagetile_width*1.2/icon_fly.width;
            icon_fly.scaleY = icon_fly.scaleX;
            icon_fly.frame = framenum_x *6 + 9;
            icon_fly.x = game.width * 0.22;
            icon_fly.y = game.height* 0.65;
            game.rootScene.addChild(icon_fly);
            
            icon_shrine.image = game.assets["resources/panel.png"];
            icon_shrine.scaleX = stagetile_width*1.2/icon_shrine.width;
            icon_shrine.scaleY = icon_shrine.scaleX;
            icon_shrine.frame = framenum_x *6 + 8;
            icon_shrine.x = game.width * 0.72;
            icon_shrine.y = game.height* 0.10;
            game.rootScene.addChild(icon_shrine);
            
        }

        var expfunc = function() {
            
            exptime++;
            if(Math.floor(exptime/game.fps*4)%2 == 1 && exptime < 60){
                icon_fly.visible = false;
                icon_shrine.visible = false;
            }
            else{
                icon_fly.visible = true;
                icon_shrine.visible = true;
            }

            if(exptime > 180){
                if(exptime == 181){
                    game.rootScene.removeChild(icon_fly);
                    game.rootScene.removeChild(icon_shrine);
                    game.rootScene.removeChild(startdetail);

                    game.rootScene.addChild(ui);
                    ui.frame = 6;
                    ui.y = game.height*0.5;
                }

                map.y += (game.height*1.3 - map.y)*0.2*(60/game.fps);
            }
            else{
                map.y += (game.height*0.2 - map.y)*0.2*(60/game.fps);
            }

            if(exptime == 200){
                scene = 2;
                game.rootScene.insertBefore(background, player.info);
                
                game.rootScene.insertBefore(mountain, player.info);
                for(ih = 0; ih<stagetile_height_split; ih++){
                    for(iw = 0; iw<stagetile_width_split; iw++){
                        game.rootScene.insertBefore(bgtile[ih][iw], player.info);
                        game.rootScene.insertBefore(stagetile[ih][iw], player.info);
                    }
                }

                game.rootScene.insertBefore(shrine, player.info);

                for(i = 0; i< label.length; i++){
                    label[i].visible = true;
                    //game.rootScene.addChild(label[i]);
                    game.rootScene.insertBefore(label[i], titleground);
                }
                
            }
        }

        var uifunc = function() {
            if(scene == 0){
                started = true;
            }
            if(scene == 5){
                
                scene = 2;
                for(i = label_value; i< label.length; i++){
                    game.rootScene.removeChild(label[i]);
                    game.rootScene.insertBefore(label[i], titleground);
                    label[i].visible = true;
                }

                game.rootScene.removeChild(result_fortune);
                game.rootScene.removeChild(result_detail_l);
                game.rootScene.removeChild(result_detail_r);
                game.rootScene.removeChild(startdetail);
                game.rootScene.removeChild(ui_twitter);

                gamephase();
                titleground.opacity = 1;
                ui.frame = 6;
                ui.y = game.height*0.5;
                ui.x = game.height*0.4;

            }
        }

        var resultphase = function () {

            var fortune = 1;
            if(masterscore >= 150)fortune = 2;
            if(masterscore >= 300)fortune = 3;
            if(masterscore >= 500)fortune = 4;
            if(masterscore >= 700)fortune = 5;
            if(masterscore >= 800)fortune = 6;

            if(mastertime < 0) fortune = 0;

            game.rootScene.insertBefore(titleground, label[label_value]);
            game.rootScene.addChild(ui);
            game.rootScene.addChild(ui_twitter);

            result_fortune.x = game.width * 0.6;
            result_fortune.y = game.height * 0.2;
            result_fortune.scaleX = stagetile_width*15 / result_fortune.width;
            result_fortune.scaleY = result_fortune.scaleX;
            result_fortune.frame = fortune; 
            game.rootScene.addChild(result_fortune);

            result_detail_l.x = game.width * 0.35;
            result_detail_l.y = game.height * 0.45;
            result_detail_l.scaleX = stagetile_width*5 / result_detail_l.width;
            result_detail_l.scaleY = result_detail_l.scaleX;
            result_detail_l.frame = 0; 
            game.rootScene.addChild(result_detail_l);

            result_detail_r.x = game.width * 0.55;
            result_detail_r.y = game.height * 0.45;
            result_detail_r.scaleX = stagetile_width*5 / result_detail_r.width;
            result_detail_r.scaleY = result_detail_r.scaleX;
            result_detail_r.frame = fortune; 
            game.rootScene.addChild(result_detail_r);

            share_time = share_time_max;
            
            ui.opacity = 1;
            ui.frame = 5;
            ui.y = game.height*0.8;
            ui.x = game.width*0.3;

            ui_twitter.y = game.height*0.8;
            ui_twitter.x = game.width*0.6;

            game.rootScene.addChild(startdetail);
            
            if(fortune == 0){
                startdetail.frame = 2;
                startdetail.y = game.height*0.5;
            }
            else if(fortune != 6 ){
                startdetail.frame = 1;
                startdetail.y = game.height*0.7;
            }
            else startdetail.visible = (fortune != 6);
            result_detail_l.visible = (fortune != 0);
            result_detail_r.visible = (fortune != 0);


            for(i = label_value; i< label.length; i++){
                label[i].x = game.width * (-0.125+i*0.05);
                label[i].y = game.height * 0.25;
                label[i].scaleX = game.width * 0.05/label[i].width;
                label[i].scaleY = label[i].scaleX;

                if(label[i].frame == 0 && (i==label_value || label[i-1].visible == false)){
                    label[i].visible = false;
                }
            }

            var text_score = masterscore.toString();
            var text_fortune;
            var text_result;
            if(fortune == 0){
                text_result = "「"+text_score +"円」用意したが、無念にも神社にはたどり着けなかった..."
            }
            else{
                switch(fortune){
                    case 1:
                        text_fortune = "凶";
                        break;
                    case 2:
                        text_fortune = "末吉";
                        break;
                    case 3:
                        text_fortune = "小吉";
                        break;
                    case 4:
                        text_fortune = "吉";
                        break;
                    case 5:
                        text_fortune = "中吉";
                        break;
                    case 6:
                        text_fortune = "大吉";
                        break;
                }
                text_result =   "買収金額は「"+
                                text_score+
                                "円」で、運勢は「"+
                                text_fortune+
                                "」だった！";
            }


            text_main =     "「フライゴンの運勢買収初詣 (by @Yosso_fly)」をプレイした！"+text_result+"#よっそゲー みんなも遊ぼう";

        }

        var resultfunc = function() {
            
            titleground.opacity += (0.9 - titleground.opacity)*0.2;
            result_fortune.scaleX += (stagetile_width*8 / result_fortune.width- result_fortune.scaleX)*0.2;
            result_fortune.scaleY = result_fortune.scaleX;
            
            share_time++;
            if(share_time >share_time_max)share_time = share_time_max;
        }

        var gamefunc = function(){

            if(scene == 0){
                titlefunc();
                return;
            }        
            if(scene == 1){
                expfunc();
                return;
            }

            if(scene == 2){

                titleground.opacity -= 0.01;
                if(titleground.opacity < 0){
                    titleground.opacity = 0;
                    ui.opacity -= 0.02;
                }
                if(ui.opacity < 0){
                    game.rootScene.removeChild(ui);
                    game.rootScene.removeChild(titleground);
                    scene = 3;
                }
            }


            if(scene == 4){
                resultphase();   
                scene = 5;
            }

            if(scene == 5){
                resultfunc();
                return;

            }

            // X phisics

            var is_controlable = player.info.px < 3500 || player.info.py > 1400;
            var is_right_only = player.info.px >= 3050 && player.info.py <= 1400;

            if(is_controlable){
                if(game.input.right || is_right_only){
                    if(is_right_only){
                        player.info.x -= 2;
                        if(player.info.px >= 3350)shrine.x -= player.info.max_x_velocity;
                    }
                    if(player_for_right == false){
                        player_for_right = true;
                        player.info.x_velocity = 0;
                    }
                    player.info.x_velocity += player.info.acceleration;
                    

                }
                else if(game.input.left){
                    if(player_for_right == true){
                        player_for_right = false;
                        player.info.x_velocity = 0;
                    }
                    player.info.x_velocity -= player.info.acceleration;

                    
                }
                else{
                    player.info.x_velocity *= player.info.x_friction;
                }
            }
            else{
                //player.info.x_velocity *= 0.9;
                scene = 4;
            }


            if(player.info.x_velocity > player.info.max_x_velocity) player.info.x_velocity = player.info.max_x_velocity;
            if(player.info.x_velocity < -player.info.max_x_velocity) player.info.x_velocity = -player.info.max_x_velocity;
            

            var x_bef = player.info.px;
            var x_af  = x_bef + player.info.x_velocity;

            for(i = 0; i<walls.length; i++){
                
                if(walls[i][3] == 1 && player.info.py >= walls[i][1] && player.info.py <= walls[i][2] && x_bef <= walls[i][0] && x_af+stagetile_width > walls[i][0]){
                    x_af = walls[i][0] -stagetile_width;
                    break;
                }
                if(walls[i][3] == -1 && player.info.py >= walls[i][1] && player.info.py <= walls[i][2] && x_bef >= walls[i][0] && x_af-stagetile_width < walls[i][0]){
                    x_af = walls[i][0] + stagetile_width;
                    break;
                }
            }

            player.info.px  = x_af;

            // Y phisics

            var gravity_adjust = 1.0;

            if(game.input.up && is_controlable && !(is_right_only)){
                if(player.info.is_hooked == true){
                    player.info.y_velocity -= player.info.jump_y_velocity;
                    player.info.is_hooked = false;
                }
                else{
                    if(player.info.y_velocity < -player.info.jump_y_velocity*0.1)
                    gravity_adjust = player.info.gravity_adjust;
                }
            }

            player.info.y_velocity += player.info.gravity*gravity_adjust;

            if(player.info.y_velocity > player.info.max_y_velocity) player.info.y_velocity = player.info.max_y_velocity;

            var y_bef = player.info.py;
            var y_af  = y_bef + player.info.y_velocity;

            function hook_height(i){
                //y = (hooks[EY]-hooks[SY])/(hooks[EX]-hooks[SX])*x + b
                //y = inclination*x + intercept

                if(hooks[i][1] == hooks[i][3]) return hooks[i][1];
                if(hooks[i][0] == hooks[i][2]) return 0;

                var inclination = (hooks[i][3]-hooks[i][1])/(hooks[i][2]-hooks[i][0]);
                var intercept = hooks[i][1]-inclination*hooks[i][0];

                return inclination*player.info.px + intercept;
            }

            for(i = 0; i<hooks.length; i++){

                if(!(player.info.is_hooked == false && player.info.px >= hooks[i][0] && player.info.px <= hooks[i][2]))continue;

                if(hooks[i][4] == -1){
                    if(y_bef >= hook_height(i)-stagetile_height*0.2 && y_af+player.info.y_velocity < hook_height(i)){
                        player.info.y_velocity  = 0;
                        y_af = hook_height(i)+stagetile_height*0.2;
                    }
                }
                else if(y_bef <= hook_height(i)+stagetile_height*0.2 && y_af+player.info.y_velocity > hook_height(i)){
                    player.info.is_hooked = true;
                    player.info.hook = i;
                    break;
                }
            }

            if(player.info.is_hooked == true){
                if(player.info.px < hooks[player.info.hook][0] || player.info.px > hooks[player.info.hook][2]){
                    player.info.is_hooked = false;
                }
                player.info.y_velocity = 0;
                player.info.py = hook_height(player.info.hook);
            }

            else player.info.py  = y_af; 
            

            // Animation

            if(player_for_right == true) player.info.scaleX = Math.abs(player.info.scaleX);
            else player.info.scaleX = -Math.abs(player.info.scaleX);

            if(player.info.is_hooked == true){
                if(Math.abs(player.info.x_velocity) > player.info.max_x_velocity*0.5 && Math.floor(mastertime/game.fps*10)%2 == 1){
                        player.info.image = game.assets["resources/f_walk.png"];
                }
                else player.info.image = game.assets["resources/f_idle.png"];
            }
            else{
                if(Math.abs(player.info.y_velocity) < player.info.max_y_velocity*0.05){
                    player.info.image = game.assets["resources/f_idle.png"];
                }
                else if(player.info.y_velocity < 0){
                    player.info.image = game.assets["resources/f_jump.png"];
                }
                else player.info.image = game.assets["resources/f_fall.png"];
            }

            // Update tile

            for(ih = 0; ih<stagetile_height_split; ih++){
                for(iw = 0; iw<stagetile_width_split; iw++){
                    set_tile_frame(iw, ih,
                        (player.info.px-base_player_x-Math.abs(player.info.scaleX)*player.info.width)/stagetile_width,
                        (player.info.py-base_player_y-Math.abs(player.info.scaleY)*player.info.height)/stagetile_height);
                }
            }

            mountain.y = stagetile_height*10-(player.info.py-4000)*0.1;
            background.y = -stagetile_height*15-(player.info.py-4000)*0.12;
            mountain.x = -player.info.px*0.1;

            var score = masterscore;
            for(i=label.length-2; i>=label_value; i--){
                label[i].frame = score%10;
                score = Math.floor(score/10);
            }

            var mastertime_t = Math.floor(mastertime/game.fps);
            label[0].frame = Math.floor(mastertime_t /60);
            var second = mastertime_t -(label[0].frame*60);
            label[2].frame = Math.floor(second/10);
            label[3].frame = second%10;


            if(is_controlable)mastertime--;

            if(mastertime < 0) scene = 4;

            

        }

        ui.addEventListener("touchstart", uifunc);

        ui_twitter.addEventListener("touchstart", ui_twitter_func);


        player.load(game, stagetile_width/player.img_width*1.2);
        game.rootScene.addChild(player.info);
        preprocess();
        gamephase();
        
        titlephase();
        player.set_loop_func(gamefunc);


        
    }

    game.start();
};