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

    load(gamecore) {
        this.info = new Sprite(this.img_width, this.img_height);
        this.info.image = gamecore.assets[this.src];

        this.info.px = 0;
        this.info.py = 0;

        this.info.x_velocity = 0;
        this.info.max_x_velocity = 0;
        this.info.acceleration = 0;

        this.info.y_velocity = 0;
        this.info.max_y_velocity = 0;
        this.info.gravity = 0; 
        this.info.is_hooked = false;
        this.info.hook = 0;
        
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

    var player = new Gobject(game, 32, 42, "resources/f_idle.png");

    var hooks = [
        [0,300,300,400],
        //[0,400,300,400]
    ];

    // X, SY, EY, COLLISION
    var walls = [
        [300,0,500, 1],
    ];

    game.onload = function(){

        player.load(game);
        player.info.px = 100;
        player.info.py = 200;
        player.info.acceleration = 1;
        player.info.max_x_velocity = 5;

        player.info.gravity = 0.5;
        player.info.max_y_velocity = 10;
        player.info.jump_y_velocity = 10;

        player.set_loop_func(function(){

            // X phisics

            if(game.input.right){
                this.x_velocity += this.acceleration;
            }
            else if(game.input.left){
                this.x_velocity -= this.acceleration;
            }
            else{
                this.x_velocity *= 0.8;
            }

            if(this.x_velocity > this.max_x_velocity) this.x_velocity = this.max_x_velocity;
            if(this.x_velocity < -this.max_x_velocity) this.x_velocity = -this.max_x_velocity;

            var x_bef = this.px;
            var x_af  = x_bef + this.x_velocity;

            for(i = 0; i<walls.length; i++){
                
                if(walls[i][3] == 1 && this.py >= walls[i][1] && this.py <= walls[i][2] && x_bef <= walls[i][0] && x_af > walls[i][0]){
                    x_af = walls[i][0];
                    break;
                }
            }

            this.px  = x_af;

            // Y phisics

            if(game.input.up && this.is_hooked == true){
                this.y_velocity -= this.jump_y_velocity;
                this.is_hooked = false;
            }

            this.y_velocity += this.gravity;

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
                if(this.is_hooked == false && this.px >= hooks[i][0] && this.px <= hooks[i][2] && y_bef < hook_height(i) && y_af+this.y_velocity > hook_height(i)){
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

            this.x = this.px;
            this.y = this.py;

            
            //
        });
        /*
        
        var player = new Sprite(32, 42);
        player.image = game.assets["resources/f_idle.png"];
        player.x = 100;
        player.y = 100;
        game.rootScene.addChild(player);

        player.addEventListener("enterframe", function(){
        });

        player.addEventListener("touchstart", function(){
            game.rootScene.removeChild(player);
        });
        */
        
    };
    game.start();
};