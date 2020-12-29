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

    //game.rootScene.backgroundColor = "#CEF";
    
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

    var time_limit = 180;
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
    var map = new Sprite(125,173);
    var startdetail = new Sprite(192,32);
    var icon_fly = new Sprite(16,16);
    var icon_shrine = new Sprite(16,16);

    var titleimg = new Sprite(256, 256);
    var started = false;

    var charsize = stagetile_width*0.5;
    let label_value = 4;
    var exptime = 0;

    //var gamefunc = function(){};
    //var titlefunc = function(){};

    // SX, SY, EX, EY, COLLISION
    var hooks = [
        //[0,284,300,284, -1]
    ];

    // X, SY, EY, COLLISION
    var walls = [
        [4518, 0, 10000, 1]
    ];

    
    var scene = 0;

    game.onload = function(){

        var gamephase = function (){

            
            background.image = bgsurface;
            

            //let phisics_speed = 60/game.fps;

            player.info.x = base_player_x;
            player.info.y = base_player_y;
            player.info.px = 400;
            player.info.py = 4800;

            if(game.fps == 28){
                player.info.acceleration = 2;
                player.info.max_x_velocity = 12;
                player.info.x_friction = 0.6;
    
                player.info.gravity = 2.6;
                player.info.max_y_velocity = 14;
                player.info.jump_y_velocity = 24;
                player.info.gravity_adjust = 0.6;
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

            // ギミックの追加

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

            

            for(i = 0; i< label.length; i++){
                label[i] = new Sprite(11, 16);
                label[i].x = 10+(i>=label_value)*20+i*charsize;
                label[i].y = 10;
                label[i].scaleX = charsize/label[i].width;
                label[i].scaleY = charsize/label[i].width;
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


            shrine.scaleX =player.info.scaleX;
            shrine.scaleY =player.info.scaleY;
            shrine.x =game.width;
            shrine.y =player.info.y - (shrine.height-player.info.height)*shrine.scaleY;
            

            game.rootScene.addChild(player.info);

            
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
            if(Math.floor(exptime/game.fps*4)%2 == 1 && exptime < 100){
                icon_fly.visible = false;
                icon_shrine.visible = false;
            }
            else{
                icon_fly.visible = true;
                icon_shrine.visible = true;
            }

            if(exptime > 100){
                if(exptime == 101){
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

            if(exptime == 140){
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
                    game.rootScene.insertBefore(label[i], player.info);
                }
                
            }
        }

        var uifunc = function() {
            if(scene == 0){
                started = true;
            }
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

            // X phisics

            var is_controlable = this.px < 3500 || this.py > 1400;
            var is_right_only = this.px >= 3050 && this.py <= 1400;

            if(is_controlable){
                if(game.input.right || is_right_only){
                    if(is_right_only){
                        this.x -= 2;
                        if(this.px >= 3350)shrine.x -= this.max_x_velocity;
                    }
                    if(player_for_right == false){
                        player_for_right = true;
                        this.x_velocity = 0;
                    }
                    this.x_velocity += this.acceleration;
                    

                }
                else if(game.input.left){
                    if(player_for_right == true){
                        player_for_right = false;
                        this.x_velocity = 0;
                    }
                    this.x_velocity -= this.acceleration;

                    
                }
                else{
                    this.x_velocity *= this.x_friction;
                }
            }
            else{
                this.x_velocity *= this.x_friction;
            }


            if(this.x_velocity > this.max_x_velocity) this.x_velocity = this.max_x_velocity;
            if(this.x_velocity < -this.max_x_velocity) this.x_velocity = -this.max_x_velocity;
            

            var x_bef = this.px;
            var x_af  = x_bef + this.x_velocity;

            for(i = 0; i<walls.length; i++){
                
                if(walls[i][3] == 1 && this.py >= walls[i][1] && this.py <= walls[i][2] && x_bef <= walls[i][0] && x_af+stagetile_width > walls[i][0]){
                    x_af = walls[i][0] -stagetile_width;
                    break;
                }
                if(walls[i][3] == -1 && this.py >= walls[i][1] && this.py <= walls[i][2] && x_bef >= walls[i][0] && x_af-stagetile_width < walls[i][0]){
                    x_af = walls[i][0] + stagetile_width;
                    break;
                }
            }

            this.px  = x_af;

            // Y phisics

            var gravity_adjust = 1.0;

            if(game.input.up && is_controlable && !(is_right_only)){
                if(this.is_hooked == true){
                    this.y_velocity -= this.jump_y_velocity;
                    this.is_hooked = false;
                }
                else{
                    if(this.y_velocity < -this.jump_y_velocity*0.1)
                    gravity_adjust = this.gravity_adjust;
                }
            }

            this.y_velocity += this.gravity*gravity_adjust;

            if(this.y_velocity > this.max_y_velocity) this.y_velocity = this.max_y_velocity;

            var y_bef = this.py;
            var y_af  = y_bef + this.y_velocity;

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

                if(!(this.is_hooked == false && this.px >= hooks[i][0] && this.px <= hooks[i][2]))continue;

                if(hooks[i][4] == -1){
                    if(y_bef >= hook_height(i)-stagetile_height*0.2 && y_af+this.y_velocity < hook_height(i)){
                        this.y_velocity  = 0;
                        y_af = hook_height(i)+stagetile_height*0.2;
                    }
                }
                else if(y_bef <= hook_height(i)+stagetile_height*0.2 && y_af+this.y_velocity > hook_height(i)){
                    this.is_hooked = true;
                    this.hook = i;
                    break;
                }
            }

            if(this.is_hooked == true){
                if(this.px < hooks[this.hook][0] || this.px > hooks[this.hook][2]){
                    this.is_hooked = false;
                }
                this.y_velocity = 0;
                this.py = hook_height(this.hook);
            }

            else this.py  = y_af; 

            // Animation

            if(player_for_right == true) this.scaleX = Math.abs(this.scaleX);
            else this.scaleX = -Math.abs(this.scaleX);

            if(this.is_hooked == true){
                if(Math.abs(this.x_velocity) > this.max_x_velocity*0.5 && Math.floor(mastertime/game.fps*10)%2 == 1){
                        this.image = game.assets["resources/f_walk.png"];
                }
                else this.image = game.assets["resources/f_idle.png"];
            }
            else{
                if(Math.abs(this.y_velocity) < this.max_y_velocity*0.05){
                    this.image = game.assets["resources/f_idle.png"];
                }
                else if(this.y_velocity < 0){
                    this.image = game.assets["resources/f_jump.png"];
                }
                else this.image = game.assets["resources/f_fall.png"];
            }

            // Update tile

            for(ih = 0; ih<stagetile_height_split; ih++){
                for(iw = 0; iw<stagetile_width_split; iw++){
                    set_tile_frame(iw, ih,
                        (this.px-base_player_x-Math.abs(player.info.scaleX)*player.info.width)/stagetile_width,
                        (this.py-base_player_y-Math.abs(player.info.scaleY)*player.info.height)/stagetile_height);
                }
            }

            mountain.y = stagetile_height*10-(this.py-4000)*0.1;
            background.y = -stagetile_height*15-(this.py-4000)*0.12;
            mountain.x = -this.px*0.1;

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

        }

        ui.addEventListener("touchstart", uifunc);

        player.load(game, stagetile_width/player.img_width*1.2);
        gamephase();
        titlephase();
        player.set_loop_func(gamefunc);
        
    }

    game.start();
};