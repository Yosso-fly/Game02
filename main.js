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

        gamecore.rootScene.addChild(this.info);
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

    game.fps = 60;

	game.rootScene.backgroundColor = "#CEF";

    var mastertime = 0;
    var player_for_right = true;

    var player = new Gobject(game, 32, 42, "resources/f_idle.png");
    //game.preload("resources/f_idle.png");
    game.preload("resources/f_fall.png");
    game.preload("resources/f_jump.png");
    game.preload("resources/f_walk.png");
    game.preload("resources/panel.png");

    let stagetile_width_split  = 20;
    let stagetile_height_split = 20;
    let stagetile_rest = game.width/10;
    let stagetile_width_sum = game.width+stagetile_rest;
    let stagetile_height_sum = game.width+stagetile_rest;
    let stagetile_width = stagetile_width_sum/stagetile_width_split;
    let stagetile_height = stagetile_height_sum/stagetile_height_split;

    let hook_edge = stagetile_width*0.7;
    let hook_foot = stagetile_width*0.25;

    let wall_edge = stagetile_width*0.7;

    let base_player_x = stagetile_width_sum/2;
    let base_player_y = stagetile_height_sum/2;

    var stagetile = new Array(stagetile_height_split);

    // SX, SY, EX, EY, COLLISION
    var hooks = [
        //[0,284,300,284, -1]
    ];

    // X, SY, EY, COLLISION
    var walls = [
        //[300,0,500, 1],
    ];

    //694,444

    //27:14

    //444:200

    game.onload = function(){

        player.load(game, stagetile_width/player.img_width*1.2);

        player.info.x = base_player_x;
        player.info.y = base_player_y;
        player.info.px = 130;
        player.info.py = 130;

        player.info.acceleration = 1;
        player.info.max_x_velocity = 5;

        player.info.gravity = 0.6;
        player.info.max_y_velocity = 8;
        player.info.jump_y_velocity = 10;
        player.info.gravity_adjust = 0.6;


        // ギミックの追加

        for(iw = 0; iw< stagedata[0].length; iw++){
            for(ih = 0; ih< stagedata.length; ih++){
                var data_seg = stagedata[ih][iw]%100;
                if(data_seg == 1 || data_seg == 6 || data_seg == 13 || data_seg == 14){
                    var hook_x = iw*stagetile_width;
                    var hook_y = ih*stagetile_height;
                    hooks.push([
                        hook_x-hook_edge,
                        hook_y+hook_foot,
                        hook_x+stagetile_width+stagetile_width*0.5+hook_edge,
                        hook_y+hook_foot,
                        1]);
                }

                if(data_seg == 20 || data_seg == 21 || data_seg == 22){
                    var hook_x = iw*stagetile_width;
                    var hook_y = ih*stagetile_height;
                    hooks.push([
                        hook_x-hook_edge*0.5,
                        hook_y+stagetile_height+hook_foot,
                        hook_x+stagetile_width+hook_edge*0.5,
                        hook_y+stagetile_height+hook_foot,
                        -1]);
                }

                var wall_x = iw*stagetile_width;
                var wall_y = ih*stagetile_height;

                if(data_seg == 10 || data_seg == 14){

                    walls.push([
                        wall_x + stagetile_width*1.5,
                        wall_y - wall_edge,
                        wall_y + stagetile_height + wall_edge*1.5,
                        1]);
                }

                if(data_seg == 12 || data_seg == 13){

                    walls.push([
                        wall_x + stagetile_width*0.5,
                        wall_y - wall_edge,
                        wall_y + stagetile_height + wall_edge,
                        -1]);
                }

            }
        }
        //console.log(stagetile_width);


        function set_tile_frame(iw, ih, tile_bpx, tile_bpy){

            var tile_px = Math.floor(tile_bpx);
            var tile_py = Math.floor(tile_bpy);

            if(ih+tile_py < 0 || ih+tile_py >= stagedata.length || iw+tile_px < 0 || iw+tile_px >= stagedata[0].length ) return;

            var data = Math.floor(stagedata[ih+tile_py][iw+tile_px]);
            var framenum_x = stagetile[ih][iw].image.width / stagetile[ih][iw].width;

            stagetile[ih][iw].frame = (Math.floor(data/10)%10) * framenum_x + data%10;
            stagetile[ih][iw].x = iw*stagetile_width  - (tile_bpx-tile_px) * stagetile_width ;
            stagetile[ih][iw].y = ih*stagetile_height - (tile_bpy-tile_py) * stagetile_height;
        }

        for(ih = 0; ih<stagetile_height_split; ih++){
            stagetile[ih] = new Array(stagetile_width_split);
            for(iw = 0; iw<stagetile_width_split; iw++){
                stagetile[ih][iw] = new Sprite(16, 16);
                stagetile[ih][iw].image = game.assets["resources/panel.png"];
                stagetile[ih][iw].x = iw*stagetile_width;
                stagetile[ih][iw].y = ih*stagetile_height;
                stagetile[ih][iw].scaleX = stagetile_width/16;
                stagetile[ih][iw].scaleY = stagetile_height/16;

                game.rootScene.addChild(stagetile[ih][iw]);

            }
        }

        player.set_loop_func(function(){

            //console.log(this.px, this.py);

            // X phisics

            if(game.input.right){
                this.x_velocity += this.acceleration;
                player_for_right = true;
            }
            else if(game.input.left){
                this.x_velocity -= this.acceleration;
                player_for_right = false;
            }
            else{
                this.x_velocity *= 0.8;
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

            if(game.input.up){
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
                    if(y_bef >= hook_height(i) && y_af+this.y_velocity < hook_height(i) && this.y_velocity <= 0){
                        this.y_velocity  = 0;
                        
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

            mastertime ++;
        });
        
    };
    game.start();
};