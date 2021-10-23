function calcMouseArea(baseX, baseY, mouseX, mouseY) {
    const relativeX = mouseX - baseX;
    const relativeY = mouseY - baseY;
    if (relativeX > 0 && relativeY > 0) { // right,bottom
        return relativeX > relativeY ? "right" : "down";
    } else if (relativeX > 0 && relativeY < 0) {    // right, top
        return relativeX > Math.abs(relativeY) ? "right" : "up";
    } else if (relativeX < 0 && relativeY < 0) {    //
        return Math.abs(relativeX) > Math.abs(relativeY) ? "left" : "up";
    } else if (relativeX < 0 && relativeY > 0) {
        return Math.abs(relativeX) > relativeY ? "left" : "down";
    } else if (relativeX == 0 && relativeY == 0) {
        return "center";
    } else if (relativeX == 0) {
        return relativeY > 0 ? "down" : "up";
    } else if (relativeY == 0) {
        return relativeX > 0 ? "right" : "left";
    }
    return "";
}

function runSprite(obj, label, loop = true, time = .2, labelNext = "", loopNext = true, timeNext = 1.5) {
    if (!time) time = 1;
    zog(label, time);
    obj.run({label: label, loop: loop, time: time, call: () => {
        if (labelNext) {
            obj.run({label: labelNext, loop: loopNext, time: timeNext});
        }
    }});
}

function getSideOfRightTriangle(a, b) {
    return Math.sqrt(a*a + b*b);
}

function getIndex(currentIndex, length) {
    if (currentIndex == undefined) return 0;
    currentIndex ++;
    if (currentIndex >= length) return 0;
    return currentIndex;

}
