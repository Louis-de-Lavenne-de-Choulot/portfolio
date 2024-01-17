function dropdown(str) {
    if (document.getElementById(str).style.display == "none" || document.getElementById(str).style.display == "") {
        document.getElementById(str).style.display = "flex"
    } else {
        document.getElementById(str).style.display = "none";
    }
}

function image() {
    if ((document.getElementById("headImg").src).includes("image/gtPictures/KnightOpen.png")) {
        document.getElementById("headImg").src = "image/gtPictures/Knight.png";
    } else {
        document.getElementById("headImg").src = "image/gtPictures/KnightOpen.png"
    }
}

function _click(e) {
    console.log(e)
    let x = Math.floor(10 * e.offsetX / e.target.clientWidth);
    let y = Math.floor(10 * e.offsetY / e.target.clientHeight);
    let s = Math.min(1, Math.min(document.body.clientWidth, document.body.clientHeight) / 500)
    window.location = `${window.location}?x=${x}&y=${y}&s=${s}`;
}