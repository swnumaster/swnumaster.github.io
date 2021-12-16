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

function animateAlpha(obj, alpha) {
    if (obj.alpha == alpha) return;
    obj.animate({
        props: {alpha}
    });
}

function animateMoveTo(obj, x, y, handler = null) {
    if (obj.x == x && obj.y == y) return;
    if (x === undefined || x === null) x = obj.x;
    if (y === undefined || y === null) y = obj.y;
    if (!handler) handler = () => {};
    obj.animate({
        props: {x: x, y: y},
        call: handler
    });
}

function getAbsoluteLoc(obj) {
    let loc = getAbsoluteLocRecrusive(obj);
    return {
        x: loc.x + obj.regX,
        y: loc.y + obj.regY
    }
}

function getAbsoluteLocRecrusive(obj) {
    if (obj.parent.type == "Stage") {
        return {
            x: obj.x - obj.regX,
            y: obj.y - obj.regY
        };
    } else {
        const pLoc = getAbsoluteLocRecrusive(obj.parent);
        return {x: obj.x - obj.regX + pLoc.x, y: obj.y - obj.regY + pLoc.y};
    }
}
