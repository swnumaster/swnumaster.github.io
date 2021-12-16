class CustomizedButton {
    constructor(parent, size, isVisible, posX, posY, baseX, baseY, icon, handler) {
        this.m_parent = parent;
        this.m_holder = new Circle(size/2, red)
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
        if (this.m_holder.alpha < .8) {
            this.m_holder.animate({
                props: {alpha: config.ui.btnAlpha}
            });
        }
    }
}

// music - skeleton pattern
class Music {
    constructor() {
        this.m_instance = null;
        this.m_switchOn = true;
    }
    static getInstance() {
        if (!this.m_instance) {
            this.m_instance = new Music();
        }
        return this.m_instance;
    }
    playAudio(audioName, volume = 1) {
        if (this.m_switchOn) {
            frame.asset(audioName).play({volume: volume});
        }
    }
    playBGM(bgmName) {
        if (this.m_switchOn) {
            if (this.m_bgMusic) {
                this.m_bgMusic.stop();
            }
            this.m_bgMusic = frame.asset(bgmName).play({loop: true, volume: .2});
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

function getGradientColor(color, size, isVertical=true) {
    return new GradientColor(
        [color, color.lighten(.8)], // colors
        [0, 1], // ratios
        0, 0,   // x0, y0
        isVertical?0:size, isVertical?size:0    // x1, y1
    );
}

function getRadialColor(color, x, y, r) {
    return new RadialColor(
        [color, color.lighten(.8)], // colors
        [0, 1], // ratios
        x, y, r,  // x0, y0, r0
        0, 0, 0 // x1, y1, r1
    );
}

function computeDroneScale(z) {
    return 50 / (z + 50);
}

function computeDroneRotation(speed) {
    return Math.min(speed / 50 * 1.5, 5);
}

function getIndex(currentIndex, length) {
    if (currentIndex == undefined) return 0;
    currentIndex ++;
    if (currentIndex >= length) return undefined;
    return currentIndex;
}

function getRandomPos(width, height, offsetStart = 0, offsetEnd = 0) {
    if (offsetStart > 0 && offsetEnd > 0) {
        let x = rand(-offsetEnd, width + offsetEnd);
        let y = 0;
        if (x > -offsetStart && x < width + offsetStart) {
            y = rand(0, 1) ? rand(-offsetEnd, -offsetStart) : rand(height + offsetStart, height + offsetEnd);
        } else {
            y = rand(-offsetEnd, height + offsetEnd);
        }
        return {x, y};
    }
    return {x: rand(0, width), y: rand(0, height)};
}

function getParkingPos(parkingArea, i) {    // from CENTER, BOTTOM
    const width = (parkingArea.countOfEachRow - 1) * parkingArea.spaceH;
    const row = Math.floor(i / parkingArea.countOfEachRow);
    const col = i % parkingArea.countOfEachRow;
    return {
        x: col * parkingArea.spaceH - width / 2,
        y: row * parkingArea.spaceV + parkingArea.offsetFromBottom
    }
}

function convertPositions(positions) {
    let posArray = [];
    loop(positions, pos => {
        posArray.push(`[${Math.floor(pos.x)},${Math.floor(pos.y)}]`);
    });
    return "[" + posArray.join(",") + "]";
}

class ProportionNew {
    constructor(start1, end1, start2, end2) {
        this.m_start1 = start1;
        this.m_end1 = end1;
        this.m_start2 = start2;
        this.m_end2 = end2;
    }
    convert(val) {
        return ((val - this.m_start1) * (this.m_end2 - this.m_start2)) / (this.m_end1 - this.m_start1) + this.m_start2;
    }
}

function animateAlpha(obj, alpha) {
    obj.animate({
        props: {alpha}
    })
}
