class BasicDrone {
    constructor(parent, posX, posY) {
        // a container hold all parts of the drone
        this.m_holder = new Container(700, 350)
            .centerReg(parent)
            .pos(posX, posY, CENTER, BOTTOM);
        this.makeBody();
        this.makeMainLight();
        this.bindEvents();
        this.autoUpdate();
        this.m_holder.startX = this.m_holder.x;
        this.m_holder.startY = this.m_holder.y;
        this.m_isParking = true;
    }

    // drone
    show() {this.m_holder.alp(1)}
    hide() {this.m_holder.alp(0)}
    isShowed() { return this.m_holder.alpha == 1; }

    // body
    makeBody() {}
    hideBody() {}

    // main light
    makeMainLight() {
        this.m_mainLight = asset("light_orange.png").clone()
            .centerReg(this.m_holder)
            .pos(0, -60, CENTER, CENTER)
            .alp(1)
            .sca(config.drone.mainLightMaxScale)
            .noMouse();
    }
    showMainLight() {
        this.m_mainLight.alp(1);
    }
    hideMainLight() {
        this.m_mainLight.alp(0);
    }
    changeMainLight(alpha, scale) {
        this.m_mainLight.alp(alpha);
        this.m_mainLight.sca(scale);
    }

    // set postion, scale
    setPos(x, y) {
        this.m_holder.loc(x, y);
        this.m_holder.startX = x;
        this.m_holder.startY = y;
    }
    setScale(scale) {
        this.m_holder.sca(scale);
    }
    setDraggable() {
        this.m_holder.drag({all: true});
    }
    getPos() {
        return {x: this.m_holder.x, y: this.m_holder.y};
    }
    isParking() {
        return this.m_isParking;
    }
    doAnimate(animateParams) {
        this.m_holder.animate(animateParams);
    }

    // show move up and down effects
    showMoveUpEffect() {}
    showMoveDownEffect() {}
    showShakingEffect(enable = true) {  // if call this before loc(), cannot change location. ??????
        if (enable) {
            this.m_holder.wiggle("y", this.m_holder.y, .2, .6, .2, .3);
        } else {
            this.m_holder.pauseAnimate();
        }
    }

    // fly to a destination
    flyTo(x, y, z, speed = 500) {
        this.m_isParking = false;
        if (typeof(speed) == "object") {
            speed = rand(speed.min, speed.max);
        }
        if (x === undefined || y === undefined || z === undefined || speed === undefined) {
            zog(`The destination is not correct. x:${x} y:${y} z:${z} speed:${speed}`);
            return;
        }
        let rotation = 0;
        if (x > this.m_holder.x) rotation = computeDroneRotation(speed);
        else if (x < this.m_holder.x) rotation = - computeDroneRotation(speed);
        this.m_holder.animate({
            // props: [ // why use these, y axis cannot be affected??????
            //     {props: {rotation: rotation}, time: .5},
            //     {props: {x: x, y: y, scale:computeDroneScale(z)}, time: 1000/speed},
            //     {props: {rotation: 0}, time: .5},
            // ]
            props: {x: x, y: y, scale:computeDroneScale(z)},
            time: 1000/speed,
            pauseOnBlur: false,
            call: () => {
                // play music
                //Music.getInstance().playShowAudio();
            }
        });
    }

    // fly a distance
    fly(x, y, z, speed) {
        x = this.m_holder.x + x;
        y = this.m_holder.y + y;
        z = (50/this.m_holder.scale - 50) + z;
        this.flyTo(x, y, z, speed);
    }

    // fly back
    flyBack() {
        this.m_isParking = true;
        this.flyTo(this.m_holder.startX, this.m_holder.startY, 0, 300);
    }

    // auto update
    autoUpdate() {
        var p1 = new ProportionNew(1, computeDroneScale(1000), config.drone.mainLightMaxScale, config.drone.mainLightMinScale);
        var p2 = new ProportionNew(config.drone.mainLightMaxScale, config.drone.mainLightMinScale, 0, 1);
        Ticker.add(() => {
            let scale = p1.convert(this.m_holder.scale);
            let alpha = p2.convert(this.m_mainLight.scale);
            this.changeMainLight(alpha, scale);
            if (this.m_holder.scale < .5) {
                this.hideBody();
            } else {
                this.hideMainLight();
            }
        });
    }

    // bind events
    bindEvents() {
        if (config.devMode) {
            this.setDraggable();
            this.m_holder.tap(() => {
                this.hide();
            });
        }
    }
}

class SmartDrone extends BasicDrone {
    constructor(parent, posX, posY) {
        super(parent, posX, posY);
    }

    makeBody() {
        this.m_leftSkeleton = this.makeSkeleton();
        this.m_rightSkeleton = this.makeSkeleton(false);
        this.m_leftPropeller = this.makePropeller();
        this.m_rightPropeller = this.makePropeller(false);
        this.m_center = this.makeCenter();
    }
    hideBody() {
        this.m_leftSkeleton.removeFrom();
        this.m_rightSkeleton.removeFrom();
        this.m_leftPropeller.removeFrom();
        this.m_rightPropeller.removeFrom();
        this.m_center.removeFrom();
    }

    showMoveUpEffect() {
        this.m_leftPropeller.animate({
            props: {y: this.m_leftPropeller.y - 10},
            rewind: true
        });
        this.m_rightPropeller.animate({
            props: {y: this.m_leftPropeller.y - 10},
            rewind: true
        });
        this.m_leftSkeleton.animate({
            props: {rotation: 3},
            rewind: true
        });
        this.m_rightSkeleton.animate({
            props: {rotation: 3},
            rewind: true
        });
    }

    showMoveDownEffect() {
        this.m_leftPropeller.animate({
            props: {y: this.m_leftPropeller.y + 10},
            rewind: true
        });
        this.m_rightPropeller.animate({
            props: {y: this.m_leftPropeller.y + 10},
            rewind: true
        });
        this.m_leftSkeleton.animate({
            props: {rotation: -3},
            rewind: true
        });
        this.m_rightSkeleton.animate({
            props: {rotation: -3},
            rewind: true
        });
    }

    // make propeller
    makePropeller(isLeft = true) {
        const offsetX = isLeft ? -220 : 220;
        const propeller = new Container(260, 180)
            .nam("propeller")
            .centerReg(this.m_holder)
            .pos(offsetX, 40, CENTER, CENTER);
        this._makeMotor(propeller);
        this._makeBlade(propeller);
        if (!isLeft) {
            propeller.ske(0, 180);
        }
        return propeller;
    }

    _makeBlade(parent) {
        const blade = new Blob({
            points: [[0, 0], [-130, 0], [-130, 3], [-30, 18], [-15, 10], [0, 10],
                    [15, 10], [30, 18], [130, 3], [130, 0]],
            color: getGradientColor(config.drone.colors[1], 60),
            interactive: false
        }).nam("blade")
            .pos(0, -84, CENTER, CENTER, parent)
            .alp(.1)
            .animate({
                props: {alpha: .04},
                rewind: true,
                loop: true,
                time: .08
            });
        const bladeCopy = blade.clone();
        bladeCopy.addTo(parent).mov(2, 2);
        blade.wiggle("y", blade.y, 1, 1, .1, .1);
        bladeCopy.wiggle("x", blade.x, 1, 1, .1, .1);
    }

    _makeMotor(parent) {
        // roller
        new Rectangle(6, 26, getGradientColor(config.drone.colors[0], 20, false))
            .pos(0, -72, CENTER, CENTER, parent);
        // tip
        new Triangle(20, 13, 13, getGradientColor(config.drone.colors[0], 120, false))
            .pos(0, -89, CENTER, CENTER, parent);
        // motor
        const motor = new Blob({
            points: [[0, 0], [-16, 0], [-16, 54], [6, 158],[26, 158], [16, 54], [16, 0]],
            color: getGradientColor(config.drone.colors[0], 80, false),
            interactive: false
        }).nam("motor").pos(0, -70, CENTER, CENTER, parent);
        // motor protector
        new Rectangle(50, 50, getGradientColor(config.drone.colors[0], 80, false), null, null, 4)
            .pos(0, -30, CENTER, CENTER, parent);
    }

    // make skeleton
    makeSkeleton(isLeft = true) {
        // upper skeleton
        const skeleton = new Blob({
            points: [[0, 0], [-220, 50], [-220, 70], [0, 30]],
            color: getGradientColor(config.drone.colors[0], 150),
            interactive: false
        }).nam("skeleton")
            .pos(0, -50, CENTER, CENTER, this.m_holder);
        // support rope
        new Rectangle(220, 7, getGradientColor(config.drone.colors[0], 20))
            .centerReg(skeleton)
            .pos(-110, 70, CENTER, CENTER);
        // for right skeleton
        if (!isLeft) {
            skeleton.ske(0, 180);
        }
        return skeleton;
    }

    // make center
    makeCenter() {
        let center = new Container(700, 350).centerReg(this.m_holder);
        // shell
        new Rectangle(120, 140, getGradientColor(config.drone.colors[0], 200), null, null, 50)
            .centerReg(center)
            .pos(0, -40, CENTER, CENTER);
        // pan base
        new Rectangle(120, 20, getGradientColor(config.drone.colors[0], 50), null, null, 4)
            .centerReg(center)
            .pos(0, 21, CENTER, CENTER);
        // pan connector
        new Rectangle(10, 30, getGradientColor(config.drone.colors[0], 10, false), null, null, 6)
            .centerReg(center)
            .pos(0, 50, CENTER, CENTER);
        // pan
        new Rectangle(50, 20, getGradientColor(config.drone.colors[1], 15), null, null, 6)
            .centerReg(center)
            .pos(0, 42, CENTER, CENTER);
        // camera
        new Rectangle(70, 50, getGradientColor(config.drone.colors[0], 20), null, null, 4)
            .centerReg(center)
            .pos(0, 84, CENTER, CENTER);
        // lens
        new Circle(20, getRadialColor(black, 10, 10, 25), "#848281", 2)
            .centerReg(center)
            .pos(0, 84, CENTER, CENTER);
        // glass
        new Circle(10, getRadialColor(black, 6, 0, 16), "#8c8b89", 2)
            .centerReg(center)
            .pos(0, 84, CENTER, CENTER)
            .alp(.5);
        // high light
        new Circle(15, white)
            .centerReg(center)
            .pos(0, 78, CENTER, CENTER)
            .alp(.1)
            .sca(1, .8);
        // high light
        new Circle(2, white)
            .centerReg(center)
            .pos(0, 78, CENTER, CENTER)
            .sca(1, .8);
        // power light 1
        new Circle(2, config.drone.powerLightColor)
            .centerReg(center)
            .pos(-10, 0, CENTER, CENTER);
        // power light 2
        new Circle(2, config.drone.powerLightColor)
            .centerReg(center)
            .pos(0, 0, CENTER, CENTER);
        // power light 3
        new Circle(2, config.drone.powerLightColor)
            .centerReg(center)
            .pos(10, 0, CENTER, CENTER)
            .animate({
                props: {alpha: .2},
                rewind: true,
                loop: true
            });
        // camera light
        new Circle(2, config.drone.powerLightColor)
            .centerReg(center)
            .pos(26, 70, CENTER, CENTER);
        return center;
    }
}

class FeaturedDrone extends BasicDrone {
    constructor(parent, posX, posY) {
        super(parent, posX, posY);
    }

    makeBody() {
        frame.asset("drone.png").clone()
            .centerReg(this.m_holder)
            .pos(0, -60, CENTER, CENTER)
            .alp(1)
            .sca(.6);
    }
}
