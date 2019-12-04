let Application = PIXI.Application,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite,
Container = PIXI.Container,
Rectangle = PIXI.Rectangle,
TextureCache = PIXI.utils.TextureCache,
Graphics = PIXI.Graphics,
Text = PIXI.Text,
su = new SpriteUtilities(PIXI);


//Create a Pixi Application
let app = new Application({
  width: 768, 
  height: 768,
  antialias: false,
  forceCanvas: true
});


app.renderer.backgroundColor = 0xC0C0C0;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

let stage = app.renderer.view;

document.body.appendChild(app.view);

PIXI.loader
    //.add("catImage","img/cat.png")//给文件路径设置别名
    .add(["./src/img/save.png","./src/img/save.json","./src/img/bat.png","./src/img/dwarf.png","./src/img/princess.png","./src/img/All.jpg"])
    //.on("progress",loadHandler)
    .load(setup);

function loadHandler(){
    //Display the file `url` currently being loaded
    console.log("loading: " + resources.catImage);

    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
}


let gameScene = new Container();
let gameStartScene = new Container();
let gameOverScene = new Container();
let scaleScene = new Text("第一关")

let healthBar;
let id;
let deep_game = false;

function setup(){
    //let bat,dwarf,princess,all,toup,toout,door,id;

    id = PIXI.loader.resources["./src/img/save.json"].textures;

    makeScene();
    //makeMaster();
    makeExploe();

    app.stage.addChild(gameOverScene); 
    app.stage.addChild(gameScene);
    app.stage.addChild(gameStartScene);

    gameScene.visible = true;
    gameOverScene.visible = false;
    gameStartScene.visible = true;

}

let dwarf,princess;
function makeExploe(){
    let frames_1 = su.filmstrip("./src/img/dwarf.png",48,64);
    dwarf = su.sprite(frames_1);
    dwarf.position.set(48,32);
    dwarf.width = 36;
    dwarf.height = 48;

    dwarf.states = {
        up:0,
        right:3,
        down:6,
        left:9,
        walkUp:[0,2],
        walkRight:[3,5],
        walkDown:[6,8],
        walkLeft:[9,11]
    };

    dwarf.fps = 10;

    dwarf.vX = 0;
    dwarf.vY = 0;
    dwarf.show(dwarf.states.down);
    setKey(dwarf,37,38,39,40,3,true);
    gameScene.addChild(dwarf);
    //app.stage.addChild(dwarf);

    let frames_2 = su.filmstrip("./src/img/princess.png",64,64);
    princess = su.sprite(frames_2);
    princess.position.set(stage.width - princess.width - 32,stage.height / 2 - princess.height / 2);
    princess.width = 48;
    princess.height = 48;

    princess.states = {
        up:0,
        right:27,
        down:18,
        left:9,
        walkUp:[0,8],
        walkRight:[27,35],
        walkDown:[18,26],
        walkLeft:[9,17]
    };

    princess.fps = 20;

    princess.vX = 0;
    princess.vY = 0;
    princess.show(princess.states.down);
    //princess.playAnimation(princess.states.walkDown);
    //setKey(dwarf,37,38,39,40,2,true);

    gameScene.addChild(princess);
    //app.stage.addChild(princess);

}


let message,door;
let startMess,begin,conti,start;
function makeScene(){
    let texture = TextureCache["./src/img/All.jpg"];
//    let rectangle = new Rectangle(32,0,32,32);
//    texture.frame = rectangle;
    texture.frame = new PIXI.Rectangle(32,0,32,32);

    for(let i = 1 ; i < stage.height/32 ; i++){
        for(let j = 1 ; j < stage.width/32; j++){
            let temp = new Sprite(texture);
            temp.alpha = 0.9;
            temp.width = 32;
            temp.height = 32;
            temp.position.set(i*temp.width,j*temp.height);
            gameScene.addChild(temp);
        }
    }


    //设置们
    door = new Sprite(id["door.png"]);
    door.height = 56;
    door.width = 56;
    door.position.set(21,-12);
    gameScene.addChild(door);

    //上
    for(let i = 2 ; i < stage.width / 32 ; i++){
        let temp = new Sprite(id["toOutside.png"]);
        temp.width = 32;
        temp.height = 32;
        temp.position.set(i*temp.width,0);
        gameScene.addChild(temp);
    }

    //左边
    for(let i = 0 ; i < stage.height / 32 ; i++){
        let temp = new Sprite(id["toUp.png"]);
        temp.width = 32;
        temp.height = 32;
        temp.position.set(0,i*temp.height);
        gameScene.addChild(temp);
    }

    //右边
    for(let i = 0 ; i < stage.height / 32 ; i++){
        let temp = new Sprite(id["toUp.png"]);
        temp.width = 32;
        temp.height = 32;
        temp.position.set(stage.width - 32,i*temp.height);
        gameScene.addChild(temp);
    }

    //下
    for(let i = 0 ; i < stage.width / 32 ; i++){
        let temp = new Sprite(id["toOutside.png"]);
        temp.width = 32;
        temp.height = 32;
        temp.position.set(i*temp.width,stage.width - 32);
        gameScene.addChild(temp);
    }

    //制作血条
    healthBar = new PIXI.DisplayObjectContainer();
    healthBar.position.set(stage.width - 170 , 6);

    let innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0,0,128,8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    let outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xFF3300);
    //outerBar.lineStyle(1,0x000000,1);
    outerBar.drawRect(1,1,126,6);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    let hp_style = new PIXI.TextStyle({
        fontFamily:"Future",
        fontSize:100,
        fill:"black"
    });
    let hp = new Text("HP:",hp_style);
    hp.position.set(stage.width - 190, 4);
    hp.width = 16;
    hp.height = 16;

    gameScene.addChild(hp);
    gameScene.addChild(healthBar);

    healthBar.outer = outerBar;


    //制作结束页面
    let style = new PIXI.TextStyle({
        fontFamily:"Future",
        fontSize:128,
        fill:"black"
    });

    message = new Text("the end",style);
    message.x = stage.width / 2 - message.width  /2;
    message.y = stage.height / 2 - message.height / 2;
    gameOverScene.addChild(message);


    //PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    begin = new Sprite(id["begin.png"]);
    begin.interactive = true;
    begin.buttonMode = true;
    begin.visible = false;

    begin.on('click',reBegin);
    gameOverScene.addChild(begin);

    conti = new Sprite(id["continue.png"]);
    conti.interactive = true;
    conti.buttonMode = true;
    conti.visible = false;

    conti.on('click',toDeep);
    gameOverScene.addChild(conti);


    //制造开始界面
    start = new Sprite(id["click.png"]);
    start.position.set(stage.width/2 - start.width / 2,stage.height/2 - start.height/2);
    start.interactive = true;
    start.buttonMode = true;

    start.on('click',startGame);
    gameStartScene.addChild(start);

}

let numMaster = 6;//设置monster的数量
let catchNum ;//设置跟踪蝙蝠的数量
let Masters = [];
function makeMaster(){

    let frames = su.filmstrip("./src/img/bat.png",32,32);

    for(let i = 0 ; i < numMaster ; i++){
        //console.log("bat");

        let master = su.sprite(frames);

        master.states = {
            walkDown:[0,3],
            walkRight:[4,7],
            walkUp:[8,11],
            walkLeft:[12,15]
        };

        master.fps = 12;

        let x = randomInt(32,stage.width - master.width - 32);
        let y = randomInt(32,stage.height - master.height - 32);

        master.x = x;
        master.y = y;

        master.vX = randomInt(-4,4);
        master.vY = randomInt(-4,4);

        Masters.push(master);
//                contain(master,{x:})
        master.playAnimation(master.states.walkDown);
        //app.stage.addChild(master);
        gameScene.addChild(master);
    }

    state_1 = play_1;
    //app.ticker.add(delta => gameLoop_1(Masters,delta));
}

function contain(sprite,container){
    let collision = undefined;

    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }

    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }

    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }

    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }

    //Return the `collision` value
    return collision;
}

function randomInt(min , max){
    return Math.floor(Math.random() * (max  - min + 1)) + min;
}

function keyboard(KeyCode){
    let key = {};
    key.code = KeyCode;
    key.isDown = false;
    key.isUp = true;
    key.Press = undefined;
    key.release = undefined;

    key.downHandler = event =>{
        if(event.keyCode == key.code){
            if(key.isUp && key.Press) key.Press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    key.upHandler = event =>{
        if(event.keyCode == key.code){
            if(key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    window.addEventListener("keydown",key.downHandler.bind(key),false);

    window.addEventListener("keyup",key.upHandler.bind(key),false);

    return key;
}


function setKey(sprite,a,b,c,d,speed,move){
    let left = keyboard(a),
        up = keyboard(b),
        right = keyboard(c),
        down = keyboard(d);
        //speed = 5;

    left.Press = () =>{
        if(move) sprite.playAnimation(sprite.states.walkLeft);
        if(princessHit) princess.playAnimation(princess.states.walkLeft);

        sprite.vX = -speed;
        sprite.vY = 0;
    }

    left.release = () =>{
        if(move) sprite.show(sprite.states.left);
        if(princessHit) princess.show(princess.states.left);

        if(!right.isDown && sprite.vY === 0){
            sprite.vX = 0;
        }
    }

    up.Press = () =>{
        if(move) sprite.playAnimation(sprite.states.walkUp);
        if(princessHit) princess.playAnimation(princess.states.walkUp);

        sprite.vX = 0;
        sprite.vY = -speed;
    }

    up.release = () =>{
        if(move) sprite.show(sprite.states.up);
        if(princessHit) princess.show(princess.states.up);

        if(!down.isDown && sprite.vX === 0 ){
            sprite.vY = 0;
        }

    }

    right.Press = () =>{
        if(move) sprite.playAnimation(sprite.states.walkRight);
        if(princessHit) princess.playAnimation(princess.states.walkRight);

        sprite.vX = speed;
        sprite.vY = 0;
    }

    right.release = () =>{
        if(move) sprite.show(sprite.states.right);
        if(princessHit) princess.show(princess.states.right);

        if(!left.isDown && sprite.vY === 0){
            sprite.vX = 0;
        }
    }

    down.Press = () =>{
        if(move) sprite.playAnimation(sprite.states.walkDown);
        if(princessHit) princess.playAnimation(princess.states.walkDown);

        sprite.vX = 0;
        sprite.vY = speed;
    }

    down.release = () =>{
        if(move) sprite.show(sprite.states.down);
        if(princessHit) princess.show(princess.states.down);

        if(!up.isDown && sprite.vX === 0 ){
            sprite.vY = 0;
        }
    }

    state = play;

    app.ticker.add(delta => gameLoop(sprite,delta));
}


//碰撞测试
function hitTest(r1,r2){
    let hit,combinedHalfWidths,combinedHalfHeights,vx,vy;

    hit = false;

    //找到半高
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //找到对象中心在屏幕中的位置
    r1.centerX = r1.x + r1.halfWidth;
    r1.centerY = r1.y + r1.halfHeight;
    r2.centerX = r2.x + r2.halfWidth;
    r2.centerY = r2.y + r2.halfHeight;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if(Math.abs(vx) < combinedHalfWidths){
        if(Math.abs(vy) < combinedHalfHeights ){
            hit = true;
            //console.log(Math.abs(vx));
        }
        else hit = false;
    }
    else hit = false;

    return hit;
}

function gameLoop_1(sprite,delta){
    state_1(sprite,delta);
}

//怪物的碰撞
let loopTime = 0;
let explorerHit;
function play_1(sprite,delta){
    loopTime++;
    explorerHit = false;

     for(let i = 0 ; i < numMaster ; i++){
         let disx = dwarf.x - sprite[i].x;
         let disy = dwarf.y - sprite[i].y;
         let dis = 2*Math.sqrt(disx*disx + disy*disy);

         sprite[i].speed = randomInt(0,5);

         if(i < catchNum ){
             sprite[i].vX = (disx / dis) * sprite[i].speed + i*i/100;
             sprite[i].vY = (disy / dis) * sprite[i].speed + i*i/100;
             //设置偏移量，让蝙蝠最终不是汇聚成一个点
         }

//                //使蝙蝠前后飞行的时候动画播放不同
//                 if(sprite[i].vY > 0 )
//                     sprite[i].playAnimation(sprite[i].states.walkUp);
//                 
//                 if(sprite[i].vY < 0 )
//                     sprite[i].playAnimation(sprite[i].states.walkDown);


         sprite[i].y += sprite[i].vY;
         sprite[i].x += sprite[i].vX;

        let masterHitsWall = contain(sprite[i],{x:32,y:32,width:stage.width - 32,height:stage.height - 32});

        if( masterHitsWall === "top" || masterHitsWall === "bottom"){
            sprite[i].vY *= -1;
        }
        if( masterHitsWall === "right" || masterHitsWall === "left"){
            sprite[i].vX *= -1;
        }

         if(hitTest(dwarf,sprite[i])){
             explorerHit = true;
             princessHit = false;
             princess.position.set(stage.width - princess.width - 32,stage.height / 2 - princess.height / 2);
             princess.show(princess.states.down);
         }
    }
    //console.log(loopTime);
    if(loopTime === 120) loopTime = 1;
}

function gameLoop(sprite,delta){
    state(sprite,delta);
}

let princessHit;
function play(sprite,delta){
    princessHit = false;

    sprite.x += sprite.vX;
    sprite.y += sprite.vY;

    contain(dwarf,{x:32,y:32,width:stage.width - 32,height:stage.height - 32});
    contain(princess,{x:32,y:32,width:stage.width - 32,height:stage.height - 32});

    if(explorerHit){
        dwarf.alpha = 0.5;
        if(healthBar.outer.width>0)
            healthBar.outer.width -= 1;
    }
    else{
        dwarf.alpha = 1;
    }

    if(hitTest(dwarf,princess))
        princessHit = true;
    else princessHit = false;

    //设置公主在小矮人旁边的位置
    if(princessHit){
        princess.x = dwarf.x + 20;
        princess.y = dwarf.y + 5;
    }

    //带出门算胜利
    if(hitTest(dwarf,door) && princessHit){
        state = end;
        state_1 = end;

        //deep_game = true;
        begin.x = 200;
        begin.y = 595;

        conti.x =400;
        conti.y = 600;
        begin.visible = true;
        conti.visible = true;
        start.visible = false;
        message.text = "You Win!";
        message.x = stage.width / 2 - message.width  /2;
        //start.visible = false;
    }


    //没血就输了
    if(healthBar.outer.width <= 0){
        state = end;
        state_1 = end;

        deep_game = false;
        conti.visible = false;
        start.visible = false;
        begin.visible = true;
        begin.x = stage.width/2 - conti.width/2;
        begin.y = 600;

        message.text = "You Lose!";
        message.x = stage.width / 2 - message.width  /2;
    }
}



function startGame(){
    catchNum = 1;
    gameStartScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    //重新开始
    princessHit = false;
    explorerHit = false;
    princess.position.set(stage.width - princess.width - 32,stage.height / 2 - princess.height / 2);
    princess.show(princess.states.down);
    dwarf.position.set(32,32);

    makeMaster();
    app.ticker.add(delta => gameLoop_1(Masters,delta));
}

function reBegin(){
    //重新设置公主
    princessHit = false;
    explorerHit = false;
    princess.position.set(stage.width - princess.width - 32,stage.height / 2 - princess.height / 2);
    princess.show(princess.states.down);

    dwarf.position.set(32,32);
    healthBar.outer.width = 128;

    //删除怪兽
    for(let i = Masters.length - 1;i >= 0 ; i--){
        gameScene.removeChild(Masters[i]);
        Masters.pop();
        console.log(Masters.length);
    }

    if(!deep_game) {
        numMaster = 6;
        catchNum = 1;
    }
    else catchNum += 1;


    makeMaster();

    state = play;
    //state_1 = play_1;

    gameStartScene.visible = false;
    gameScene.visible = true;
    gameOverScene.visible = false;
}

function toDeep(){
    deep_game = true;
    numMaster += 3;
    reBegin();
}

function end(sprite,delta){
    gameScene.visible = false;
    gameOverScene.visible = true;
}