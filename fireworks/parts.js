// music - skeleton pattern
class Music {
    constructor() {
        this.m_instance = null;
        this.m_switchOn = true;
        this.m_bgmName = "";
    }
    static getInstance() {
        if (!this.m_instance) {
            this.m_instance = new Music();
        }
        return this.m_instance;
    }
    playAudio(audioName) {
        if (this.m_switchOn) {
            frame.asset(audioName).play();
        }
    }
    playBGM(bgmName) {
        if (this.m_switchOn) {
            if (this.m_bgmName == bgmName) {
                return;
            }
            this.m_bgmName = bgmName;
            if (this.m_bgMusic) {
                this.m_bgMusic.stop();
            }
            this.m_bgMusic = frame.asset(bgmName).play({loop: true, volume: .3});
        }
    }
    stopBGM() {
        if (this.m_bgMusic) {
            this.m_bgMusic.stop();
        }
    }
    switch() {
        this.m_switchOn = !this.m_switchOn;
        if (this.m_switchOn) {
            if (this.m_bgMusic) {
                this.m_bgMusic.play();
            }
        } else {
            if (this.m_bgMusic) {
                this.m_bgMusic.stop();
            }
        }
        return this.m_switchOn;
    }
}

class LabelButton extends Container {
    constructor(text, size, color, x, y, parent, handler, blink = false, underIcon = null) {
        super();
        this.m_label = new Label(text, size, "ItcKrist", color).centerReg(this);
        this.nam("labelButton").centerReg(parent).loc(x,y).sha(black.toAlpha(.8), 2, 2, 10);
        this.m_label.tap(() => {
            Music.getInstance().playAudio("hit.mp3");
            this.stopAnimate();
            this.alp(1);
            handler();
        });
        if (underIcon) underIcon.centerReg(this).pos(0, this.m_label.height / 2, CENTER, CENTER);
        if (blink) {
            this.animate({
                props: {alpha: .1},
                rewind: true,
                loop: true
            });
        }
    }
}

class CustomizedButton {
    constructor(parent, size, isVisible, posX, posY, baseX, baseY, icon, bgColor, handler) {
        this.m_parent = parent;
        this.m_holder = new Circle(size/2, bgColor)
            .centerReg(this.m_parent)
            .pos(posX, posY, baseX, baseY)
            .alp(isVisible?config.ui.btnAlpha:0);
        this.m_icon = asset(icon).clone().centerReg(this.m_holder).scaleTo(this.m_holder, 60);
        this.m_handler = handler;
        this.bindEvents();
    }

    bindEvents() {
        this.m_holder.tap(() => {
            Music.getInstance().playAudio("hit.mp3");
            this.m_handler();
        });
    }

    setPos(offsetX, offsetY, baseX, baseY) {
        this.m_holder.pos(offsetX, offsetY, baseX, baseY);
    }

    changeIcon(icon) {
        this.m_icon.dispose();
        this.m_icon = asset(icon).clone().centerReg(this.m_holder).scaleTo(this.m_holder, 60);
    }

    hide() {
        if (this.m_holder.alpha > 0) {
            this.m_holder.animate({
                props: {alpha: 0}
            });
        }
    }

    show() {
        if (this.m_holder.alpha < config.ui.btnAlpha) {
            this.m_holder.animate({
                props: {alpha: config.ui.btnAlpha}
            });
        }
    }

    sleep(time) {
        this.m_holder.noMouse();
        this.m_holder.alp(.3);
        timeout(time, () => {
            this.m_holder.mouse();
            this.m_holder.alp(config.ui.btnAlpha);
        });
    }
}

class WallWindow extends Container {
    constructor(stage) {
        super(stage.width * 2, stage.height);
        this.loc(0, 0, stage);
        // wall
        new Rectangle(stage.width + 50, stage.height, config.scene.wallColor)
            .loc(0, 0, this);
        // window
        const window = asset("window.png");
        window
            .sca(stage.width*2/window.width, stage.height/window.height)
            .loc(0, 0, this);
        // banner
        new Label(config.ui.labTitle, 40, "ItcKrist", white)
            .centerReg(this)
            .loc(stage.width/2, 60);
    }
}

class Desk extends Container {
    constructor() {
        super(400, 400);
        this.nam("desk");
        this.m_top = new Blob({
            points: [[-2,-66.1,0,0,-40,0,40,0],[95.1,-30.9,0,0,-21.3,-33.9,21.4,34],[58.8,80.9,0,0,32.4,-23.5,-32.4,23.5],[-58.8,80.9,0,0,32.4,23.5,-32.4,-23.5],[-95.1,-30.9,0,0,-22.9,32.8,22.4,-32]],
            color: config.scene.deskColor,
            interactive: false
        }).centerReg(this).sca(10);
    }
}

class Shelf extends Container {
    constructor(parent, items, title = "", cols = 4, rows = 4, cellSize = 100) {
        super();

        // scale to the cell size
        loop(items, (item) => {
            const scale = cellSize / item.width;
            item.sca(scale);
            item.setInitialScale(scale);
        });

        // draw slots
        this.m_slots = new Tile({
            obj: new Rectangle(cellSize, cellSize, config.shelf.color, config.shelf.borderColor, config.shelf.borderWidth, config.shelf.corner).sha(black.toAlpha(.8), 0, 0, 6),
            cols: cols,
            rows: rows,
            align: CENTER,
            valign: CENTER,
            spacingH: 10,
            spacingV: 10,
        }).centerReg(this);

        // align items with cells
        this.m_items = new Tile({
            obj: series(items),
            cols: cols,
            rows: rows,
            align: CENTER,
            valign: CENTER,
            spacingH: 10,
            spacingV: 10,
            clone: false
        }).centerReg(this);

        // save original convertPositions for each item in the shelf
        this.m_items.loop(item => {
            item.setInitialPos(item.x, item.y);
            item.setShelf(this);
        });
        // add shelf title
        if (title) {
            new Label(title, 40, "ItcKrist", white).centerReg(this).pos(0, -this.height/2 - 50, CENTER, CENTER);
        }
        // place the shelf in the parent
        this.pos(-800, 0, LEFT, CENTER, parent);
        // save the initial postion of the shelf
        this.m_initialX = this.x;
        this.m_initialY = this.y;
    }

    getItems() {
        return this.m_items;
    }

    show() {
        this.animate({
            props: {x: this.width / 2 + 40},
            ease: "backOut"
        });
    }
    hide() {
        this.animate({
            props: {
                x: this.m_initialX,
                y: this.m_initialY
            }
        });
    }
}

class Whiteboard extends Container {
    // itemInfos:
    //  [[{text:"xxx", color: red}, {text:"xxx", color: red}], [{text:"xxx", color: red}, {text:"xxx", color: red}]]
    constructor(width, height, itemInfos) {
        super(width, height);
        this.nam("whiteboard");
        new Rectangle(width, height, config.scene.whiteboardColor, config.scene.whiteboardBorderColor, 16)
            .centerReg(this)
            .sha(black.toAlpha(.8), 0, 0, 6);
        this.m_eraser = new Rectangle(50, 20, white)
            .pos(40, 8, CENTER, BOTTOM, this)
            .drag();
        this.m_eraser.on("pressmove", () => {
            let hitObj = this.loop(deco => {
                if (deco.name == "deco" && this.m_eraser.hitTestCircleRect(deco)) {
                    return deco;
                }
            });
            if (hitObj.type == "Bitmap") {
                hitObj.dispose();
            }
        });
        new asset("chalkflag.png")
            .nam("deco")
            .sca(.5)
            .pos(9, 9, LEFT, TOP, this)
            .drag();
        new asset("chalkflag.png")
            .clone()
            .nam("deco")
            .ske(0, 180)
            .sca(.5)
            .pos(9, 9, RIGHT, TOP, this)
            .drag();
        new asset("chalkstar.png")
            .nam("deco")
            .sca(.5)
            .pos(30, 40, LEFT, BOTTOM, this)
            .drag();
        new asset("chalkstar.png")
            .clone()
            .nam("deco")
            .sca(.5)
            .pos(30, 60, RIGHT, BOTTOM, this)
            .drag();
        new asset("chalkstar.png")
            .clone()
            .nam("deco")
            .sca(.5)
            .pos(70, -80, RIGHT, CENTER, this)
            .drag();
        new asset("chalkflower.png")
            .nam("deco")
            .sca(.7)
            .pos(-140, 4, CENTER, BOTTOM, this)
            .drag();
        new asset("chalkflower.png")
            .clone()
            .nam("deco")
            .sca(.7)
            .pos(140, 4, CENTER, BOTTOM, this)
            .drag();
        this.setInfo(itemInfos);
    }

    setInfo(itemInfos) {
        // remove old infos
        if (this.m_infos) {
            this.m_infos.dispose();
            this.m_infos = null;
        }
        // check new info
        if (!Array.isArray(itemInfos) || itemInfos.length == 0 || itemInfos[0].length == 0) return;
        // add new info
        let labels = [];
        for (let i = 0; i < itemInfos.length; i ++) {
            for (let j = 0; j < itemInfos[0].length; j ++) {
                let text;
                let color;
                if (typeof itemInfos[i][j] == "string") {
                    text = itemInfos[i][j];
                    color = white;
                } else {
                    text = itemInfos[i][j].text;
                    color = itemInfos[i][j].color ? itemInfos[i][j].color : white;
                }
                labels.push(new Label(text, 20, "ItcKrist", color));
            }
        }
        this.m_infos = new Tile({
            obj: labels,  // ZIM VEE value
            unique: true,   // very important
            cols: itemInfos[0].length,
            rows: itemInfos.length,
            spacingH: 10,
            spacingV: 10,
            align: "left",
        }).addTo(this).pos(20, 20, LEFT, TOP).alp(0);
        animateAlpha(this.m_infos, 1);
    }
}

class PhotoFrame extends Container {
    constructor(width, height, photo) {
        super(width, height);
        this.nam("photoframe");
        new Rectangle(width, height, "#060531", white, 14)
            .centerReg(this)
            .sha(black.toAlpha(.8), 0, 0, 6);
        this.setPhoto(photo);
    }

    setPhoto(photo) {
        // remove old photo
        if (this.m_photo) {
            this.m_photo.dispose();
            this.m_photo = null;
        }
        // show new photo
        this.m_photo = photo.clone().centerReg(this).sca((this.width-50)/photo.width, (this.height-50)/photo.height).alp(0);
        animateAlpha(this.m_photo, 1);
    }
}

class ItemBase extends Container {
    constructor(itemConfig) {
        super(itemConfig.outerSize, itemConfig.outerSize);
        this.nam(itemConfig.name);
        this.m_config = itemConfig;
        this.m_inSlotScaleX = itemConfig.inSlotScaleX || 1;
        this.m_inSlotScaleY = itemConfig.inSlotScaleY || 1;
        this.centerReg();
        this.onPressup();
        this.onPressmove();
        // this.onMouseover();
        this.onTap();
        this.drag({all:true, onTop: false});
    }

    // inital
    setInitialScale(scale) {
        this.m_initialScale = scale;
    }
    setInitialPos(x, y) {
        this.m_initialX = x;
        this.m_initialY = y;
    }
    setShelf(shelf) {
        this.m_shelf = shelf;
    }

    // mouse events
    onPressup() {
        this.on("pressup", () => {
            this.m_labMgr.resetSlotsColor();
            this.m_labMgr.hideGuide();
            if (this.hitTestCircleRect(this.m_labMgr.getFireworks())) {
                this.moveToSlot();
            } else {
                this.moveToShelf();
            }
        });
    }
    onPressmove() {
        this.on("pressmove", () => {
            this.stopEffect();
            if (this.parent != this.m_labMgr.getFireworks()) {
                this.addTo(this.m_labMgr.getFireworks());
            }
            let nearestSlot = this.m_labMgr.getNearestSlot(this, true);
            if (!nearestSlot) return;
            this.m_labMgr.updateGuide(this.x, this.y, nearestSlot.x, nearestSlot.y, this.hitTestCircleRect(this.m_labMgr.getFireworks()));
        });
    }
    onTap() {
        this.tap((e) => {
            this.stopEffect();
            this.showInfo(e.currentTarget);
        });
    }
    onMouseover() {
        this.on("mouseover", (e) => {
            this.showInfo(e.currentTarget);
        });
    }

    // show info
    showInfo(item) {
        this.m_labMgr.getWhiteboard().setInfo(this.m_config.info);
        if (this.m_config.flower) {
            this.m_labMgr.getPhotoFrame().setPhoto(asset(this.m_config.flower));
        }
    }

    // move to shelf
    moveToShelf() {
        if (this.m_slot) {
            this.m_slot.item = null;
            this.m_slot = null;
        }
        this.addTo(this.m_shelf.getItems());
        this.animate({
            props: {
                x: this.m_initialX,
                y: this.m_initialY,
                scale: this.m_initialScale
            },
            ease: "elasticOut",
            time: .2,
            call: () => {
                Music.getInstance().playAudio("back.mp3");
                //this.stopBlink();
            }
        });
    }

    // move to slot
    moveToSlot() {
        // add to the fireworks area
        if (this.parent != this.m_labMgr.getFireworks()) {
            this.addTo(this.m_labMgr.getFireworks());
        }
        // get the nearset slot
        let nearestSlot = this.m_labMgr.getNearestSlot(this);
        if (!nearestSlot) return;
        // if the slot has item, make it back to its shelf first
        if (nearestSlot.item && nearestSlot.item != this) { // not this self
            nearestSlot.item.moveToShelf();
        }
        // if this item has already in a slot
        if (this.m_slot) {  // original slot
            this.m_slot.item = null;
        }
        // save the nearest slot and save item in the slot
        this.m_slot = nearestSlot;
        this.m_slot.item = this;
        // move this to nearest slot
        this.animate({
            props: {
                x: this.m_slot.x,
                y: this.m_slot.y,
                scaleX: this.m_inSlotScaleX,
                scaleY: this.m_inSlotScaleY,
            },
            time: .2,
            call: () => {
                //this.startBlink();
                this.m_labMgr.onSlotChange(this.getSlots());
                Music.getInstance().playAudio("finish.mp3");
            }
        });
    }
    stopMouse() {
        this.noMouse();
    }
    startMouse() {
        this.mouse();
    }
    startBlink() {
        loop(this.m_circles, circle => {
            circle.animate({
                props: {alpha: .5},
                rewind: true,
                loop: true
            });
        });
    }
    stopBlink() {
        loop(this.m_circles, circle => {
            circle.stopAnimate();
            circle.alp(1);
        });
    }
}

class Pad extends ItemBase {
    constructor(itemConfig, labMgr) {
        super(itemConfig);
        this.m_labMgr = labMgr;
        this.m_back = new Circle(itemConfig.realSize/2, config.pad.color, config.pad.borderColor, config.pad.borderWidth)
            .nam(itemConfig.name + "_back")
            .centerReg(this)
            .sha(black.toAlpha(.8), 0, 0, 6);
        this.m_circles = [];
        this.m_slotLevels = [];
        loop(itemConfig.positions, (pos, i) => {
            const circle = new Circle(itemConfig.pipeSize/2, config.pad.pipeColor, config.pad.pipeBorderColor, config.pad.pipeBorderWidth)
                .nam(itemConfig.name + "_" + i)
                .pos(pos[0], pos[1], CENTER, CENTER, this)
                //.sha(black.toAlpha(.8), 0, 0, 6)
                .noMouse();
            this.m_circles.push(circle);
            this.m_slotLevels.push(pos[2]);
        });
    }

    getBack() {
        return this.m_back;
    }

    getSlots() {
        let slots = [];
        const scaleX = this.m_inSlotScaleX;
        const scaleY = this.m_inSlotScaleY;
        loop(this.m_circles, (circle, i) => {
            slots.push({
                name: this.name + "_slot_" + i,
                x: circle.x * scaleX + (this.x - this.width / 2),
                y: circle.y * scaleY + (this.y - this.height * scaleY / 2),
                obj: circle,
                level: this.m_slotLevels[i],
                item: null
            });
        });
        return slots;
    }

    startEffect() {
    }

    stopEffect() {
    }
}

class Pipe extends ItemBase {
    constructor(itemConfig, labMgr) {
        super(itemConfig);
        this.m_labMgr = labMgr;
        let face = asset(itemConfig.face).clone().centerReg(this).sha(black.toAlpha(.8), 0, 0, 6);
        face.sca(itemConfig.outerSize/face.width);
        this.m_flower = asset(itemConfig.flower).clone().centerReg(this).sca(.2).alp(.8).pos(0, 30, CENTER, CENTER);
        this.reg(null, this.height - 45);

        this.startEffect();
    }

    getSlots() {
        return [];
    }

    startEffect() {
        this.m_flower.pos(0, 0, CENTER, CENTER);
        this.m_flower.animate({
            props: {scale: 1},
            rewind: true,
            loop: true
        });
    }

    stopEffect() {
        this.m_flower.pauseAnimate();
        this.m_flower.sca(.2).pos(0, 30, CENTER, CENTER);
    }
}

class FireworksEmitter extends Container {
    constructor(particle, flower, speedX, speedY, emitInterval, delay) {
        super(10, 10);
        this.nam("emitter").reg(this.width / 2, this.height / 2);
        // emitting speed
        this.m_speedX = speedX ? speedX : config.fireworks.speedX;    // horizontal speed
        this.m_speedY = speedY ? speedY : config.fireworks.speedY;    // vertical speed
        // delay
        this.m_delay = delay ? delay : 0;
        // emitting interval
        this.m_emitInterval = emitInterval ? emitInterval : config.fireworks.emitInterval;
        // objectives
        this.m_particle = particle;
        this.m_flower = flower;
        if (this.m_flower) {
            this.m_flower.alp(0).sca(0);
        }
    }

    run() {
        if (this.m_delay) {
            timeout(this.m_delay, () => {
                this.start();
            });
        } else {
            this.start();
        }
    }

    start() {
        this.m_interval = interval(this.m_emitInterval, () => {
            //Music.getInstance().playAudio("emit.mp3");
            this.emitParticle();
        }, null, true);
    }

    pause() {
        if (this.m_interval) this.m_interval.pause();
    }

    emitParticle() {
        // objectives
        let particle = this.m_particle.clone().centerReg(this);
        let flower = this.m_flower ? this.m_flower.clone().centerReg(this) : null;
        // fixed parameters
        // const speedX = rand(this.m_speedX.min, this.m_speedX.max, null, true);
        const speedX = this.computeSpeedX(this.m_speedX);
        const speedY = rand(this.m_speedY.min, this.m_speedY.max);
        const flowerDuration = rand(config.fireworks.flowerDuration.min, config.fireworks.flowerDuration.max);
        const flowerBaseScale = rand(config.fireworks.flowerBaseScale.min, config.fireworks.flowerBaseScale.max);
        const particleBaseScaleY = rand(config.fireworks.particleBaseScaleY.min, config.fireworks.particleBaseScaleY.max);
        // variables
        let frameCount = 0;
        let preY = 0;
        let isGoingUp = true;
        let deltaYofEachFrame = 0;
        const ticker = Ticker.add(() => {
            frameCount ++;
            if (isGoingUp) {
                const pos = this.computePos(speedX, speedY, frameCount);
                if (pos.y > preY) { // is going up
                    // caculate delta, scale y, alpha
                    deltaYofEachFrame = pos.y > preY ? pos.y - preY : 0;
                    let scaleY = 1;
                    let alpha = 1;
                    if (deltaYofEachFrame && deltaYofEachFrame > config.fireworks.deltaForScaleY) {  // strongly going up
                        scaleY = particleBaseScaleY;
                        alpha =(frameCount % 2) ? .3 : .8;
                    } else {    // near the top
                        scaleY = (deltaYofEachFrame / config.fireworks.deltaForScaleY) * particleBaseScaleY;
                        alpha = scaleY * particleBaseScaleY;
                    }
                    // change particle
                    particle.pos(pos.x, pos.y, CENTER, BOTTOM)
                        .rot(MathUitls.getDegree(pos.x, pos.y))
                        .alp(alpha)
                        //.sca(1, scaleY);
                    // save y
                    preY = pos.y;
                } else {    // stop going up
                    isGoingUp = false;
                    // reset frame count
                    frameCount = 0;
                    // display flower in the particle postion
                    if (flower) {   // has flower, so tiker keep going
                        flower.loc(particle.x, particle.y);
                    } else {    // no flower, so remove ticker
                        Ticker.remove(ticker);
                    }
                     // dispose the particle
                    particle.dispose();
                }
            } else {    // processing flower
                frameCount ++;
                if (frameCount < flowerDuration) {  // flower is going on
                    // alpha: sin(0) ===> sin(PI) ===> sin(PI*2)
                    let alpha = Math.sin(frameCount / flowerDuration * Math.PI);
                    if (frameCount + 2 >= flowerDuration) {
                        alpha = 0;
                    }
                    // scale: 0 ===> 1
                    let scale = frameCount / flowerDuration;
                    flower.alp(alpha * config.fireworks.flowerBaseAlpha).sca(scale * flowerBaseScale);
                } else {    // flower is end
                    Ticker.remove(ticker);
                    flower.dispose();
                }
            }
        });
    }

    computePos(speedX, speedY, tickCount) {
        const time = tickCount / config.fireworks.frameRate;
        return {
            x: time * speedX,
            y: speedY * time - .5 * config.fireworks.gravity * time * time
        };
    }

    computeSpeedX(speedX) {
        const min = speedX.min;
        const max = speedX.max;
        if (min >= 0 && max > 0) {
            return rand(min, max);
        } else if (min < 0 && max <= 0) {
            return -rand(-max, -min);
        } else if (min < 0 && max > 0) {
            return rand(0, 1, true) == 0 ? -rand(0, -min) : rand(0, max);
        }
        return 0;
    }
}

class Laser {
    constructor(parent, x, y, type = 1, direction = "up") {
        this.m_parent = parent;
        this.m_direction = direction;
        this.m_laser = frame.asset(`laser${type}.png`).clone().reg(169, 11).alp(0);
        this.m_laser.rot(90);
        this.m_laser.pos(x - this.m_laser.height / 2, y - this.m_laser.width / 2, CENTER, BOTTOM, parent);
    }

    turnOn() {
        let rotation = 0;
        if (this.m_direction == "up") {
            rotation = this.m_laser.rotation + 180;
        } else if (this.m_direction == "down") {
            rotation = this.m_laser.rotation - 180
        }
        this.m_laser.alp(1);
        this.m_laser.animate({
            props: {rotation: rotation},
            rewind: true,
            loop: true,
            time: rand(4, 6),
        });
    }

    turnOff() {
        this.m_laser.animate({
            props: {alpha: 0},
            time: .5,
        });
    }
}
