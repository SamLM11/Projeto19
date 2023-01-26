var humanRun, humanRunAnimation, humanDieAnimation;
var zombieRun, zombieRunAnimation, zombieAttackAnimation;
var ground, groundImg, groundInvisible, groundObstacleInvisible;
var score = 0;
var obstaclesGroup, obstacle1Img, obstacle2Img, obstacle3Img, obstacle4Img, obstacle5Img;
var gameState = "play"; 

function preload(){
    humanRunAnimation = loadAnimation("assets/human_stage1.png", "assets/human_stage2.png", "assets/human_stage3.png", "assets/human_stage4.png", "assets/human_stage5.png", "assets/human_stage6.png", "assets/human_stage7.png", "assets/human_stage8.png");
    humanDieAnimation = loadAnimation("assets/human_die_stage1.png", "assets/human_die_stage2.png", "assets/human_die_stage3.png", "assets/human_die_stage4.png", "assets/human_die_stage5.png", "assets/human_die_stage6.png", "assets/human_die_stage7.png");
    zombieAttackAnimation = loadAnimation("assets/zombie_attack_stage1.png", "assets/zombie_attack_stage2.png", "assets/zombie_attack_stage3.png", "assets/zombie_attack_stage4.png", "assets/zombie_attack_stage5.png");
    zombieRunAnimation = loadAnimation("assets/zombie_run_stage1.png", "assets/zombie_run_stage2.png", "assets/zombie_run_stage3.png", "assets/zombie_run_stage4.png", "assets/zombie_run_stage5.png");
    groundImg = loadImage("assets/background_0201.png");
    obstacle1Img = loadImage("assets/obstacle_01.png");
    obstacle2Img = loadImage("assets/obstacle_02.png");
    obstacle3Img = loadImage("assets/obstacle_03.png");
    obstacle4Img = loadImage("assets/obstacle_04.png");
    obstacle5Img = loadImage("assets/obstacle_06.png");
}

function setup() {
    
    createCanvas(windowWidth, windowHeight);

    ground = createSprite(width / 2, height / 2);
    ground.addImage("ground", groundImg);
    ground.scale = 2;
    ground.velocityX = -(6 + 3*score/100);

    groundInvisible = createSprite(width / 2, height - 130, width, 10);
    groundInvisible.visible = false;
    //groundObstacleInvisible = createSprite(width / 2, height - 115, width, 10);
    //groundObstacleInvisible.visible = false;
    
    humanRun = createSprite(width / 2, height - 210);
    humanRun.addAnimation("humanRun", humanRunAnimation);
    humanRun.addAnimation("humanDie", humanDieAnimation);

    zombieRun = createSprite(100, height - 210);
    zombieRun.addAnimation("zombieRun", zombieRunAnimation);
    zombieRun.addAnimation("zombieAttack", zombieAttackAnimation);
    zombieRun.scale = 0.5;
    zombieRun.setCollider("rectangle", 35, 30);
    zombieRun.debug = false;

    obstaclesGroup = new Group();
}

function draw() {
    background(0);
    //console.log(humanRun.y)
    
    if (obstaclesGroup.isTouching(zombieRun)) {
        zombieRun.velocityY = -12
    }

    if (ground.x < 0){
        ground.x = ground.width / 2;
    }
    
    if (gameState === "play") {
        
        if (keyDown("space") && humanRun.y >= 400) {
            humanRun.velocityY = -12;
        }

        if (frameCount % 10 === 0 && gameState) {
            score += 2;
        }

        spawnObstacle();
    }

    humanRun.velocityY = humanRun.velocityY + 0.8;
    zombieRun.velocityY = zombieRun.velocityY + 0.8;

    humanRun.collide(groundInvisible);
    zombieRun.collide(groundInvisible);
    //obstaclesGroup.collide(groundObstacleInvisible);
    //obstaclesGroup.collide(humanRun);
    //obstaclesGroup.displace(obstaclesGroup);
    obstaclesGroup.displace(humanRun);
    obstaclesGroup.collide(humanRun);

    gameOver();
    
    drawSprites();

    textSize(30);
    fill("yellow");
    text("score:" + score, width / 2, height);
}

function spawnObstacle() {
    if (frameCount % 150 === 0) {
        var obstacle = createSprite(width + 300,height - 150);
        obstacle.velocityX = -(7 + 3*score/100);
        var rand = Math.round(random(1,5));
        switch(rand) {
            case 1: 
                obstacle.addImage(obstacle1Img);
                obstacle.scale = 1.5;
                //obstacle.y += -20;
                break;
            // case 2: 
            //     obstacle.addImage(obstacle2Img);
            //     obstacle.scale = 1.5;
            //     obstacle.y += -5;
            //     break;
            case 3: 
                obstacle.addImage(obstacle3Img);
                obstacle.y += -20;
                break;
            case 4: 
                obstacle.addImage(obstacle4Img);
                obstacle.scale = 1.2;
                break;
            case 5: 
                obstacle.addImage(obstacle5Img);
                obstacle.scale = 1.2;
                obstacle.y += -20;
                break;
            default:
                obstacle.addImage(obstacle1Img);
                obstacle.scale = 1.5;
                //obstacle.y += -20;
                break;
        }

        obstaclesGroup.add(obstacle);
    }

}

function gameOver() {
    
    if (humanRun.bounce(zombieRun) && gameState === "play") {
        gameState = "end";
        obstaclesGroup.setVelocityXEach(0);
        ground.velocityX = 0;

        zombieRun.changeAnimation("zombieAttack", zombieAttackAnimation);
        setTimeout(() => zombieRun.frameDelay = 0, 600);
        humanRun.changeAnimation("humanDie", humanDieAnimation);
        setTimeout(() => humanRun.frameDelay = 0, 900);

    }
}
