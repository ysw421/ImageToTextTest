const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const showText = document.getElementById('show-text');

var imgWidth = 1;
var imgHeight = 1;
fixedRatioChange();
var z = 1;
const img = new Image();
var x;
var y;
let src;
let imgResize;
let cvImg;
let preeviewImg;
var text;
var resoponsiveness = 60;
var brightness = 0;
var saveBrightness = 0;
var textSize = 0.6;
var listForText = [[1,3],[1,2],[1,1],[1,0],[0,3],[0,2],[0,1],[0,0]];

function get_braile_code(code) {
    if (code == "00000000") {
        //return "   ";
        //return "   ";
        //return "  ";
        return "    ";  //다음, 네이버 댓글
    } else {
        decimal_code = parseInt(code, 2);
        return String.fromCharCode(decimal_code+10240);
    }
}

function get_text() {
    if (document.getElementById("blur").checked) {
        listForText = [[0,0],[0,1],[0,2],[0,3],[1,0],[1,1],[1,2],[1,3]];
    } else {
        listForText = [[1,3],[1,2],[1,1],[1,0],[0,3],[0,2],[0,1],[0,0]];
    }
    text = "";

    for (let j = 0; j < y; j+=2) {
        for (let i = 0; i < x; i+=4) {
            var braileBinaryCode = "";
            for (let k = 0; k < listForText.length; k++) {
                var pixelValue = cvImg.ucharPtr(j + listForText[k][0], i + listForText[k][1]);
                if (255-pixelValue > resoponsiveness) {
                    braileBinaryCode += "1";
                } else {
                    braileBinaryCode += "0";
                }
            }
            text += get_braile_code(braileBinaryCode);
        }
        text += "\n"
    }
    cv.imshow('canvas', preeviewImg);
    document.getElementById("show-text-span").innerText = text;
}

function inputFile(input) {
    var imageType = /image.*/;
    img.onload = e => {
        resoponsiveness = document.getElementById("responsiveness-bubble").innerText;
        
        imgWidth = e.target.width;
        imgHeight = e.target.height;
        if (document.getElementById("type-of-size-1").checked) {
            z = document.getElementById("text-of-size-1").value;
            x = parseInt(e.target.width * z * 0.25) * 8;
            y = parseInt(e.target.height * z * 0.065) * 8;
        } else {
            fixedRatioChange();
            x = parseInt(document.getElementById("text-of-size-2-w-bubble").value) * 4;
            y = parseInt(document.getElementById("text-of-size-2-h-bubble").value) * 2;
        }
        src = cv.imread(img, cv.CV_8UC4);
        imgResize = new cv.Mat();
        try {
            cv.resize(src, imgResize, new cv.Size(x, y), 0, 0, cv.INTER_AREA);
            cvImg = new cv.Mat(x, y, cv.CV_8UC4);
            preeviewImg = new cv.Mat();
            cv.convertScaleAbs(imgResize, cvImg, 1, Number(brightness));
            cv.convertScaleAbs(src, preeviewImg, 1, Number(brightness));
            saveBrightness = brightness;
            cv.cvtColor(cvImg, cvImg, cv.COLOR_RGBA2GRAY);

            get_text();
        } catch (e) {
            alert("이미지 크기를 다시 선택하여 주세요. 오류가 발생하였습니다.");
        }
    }
    const reader = new FileReader()
    reader.onload = e => {
        if (true) {
            const previewImage = document.getElementById("image");
            img.src = e.target.result;
            img.style.filter = `grayscale(0%)`;
            //previewImage.src = img.src;
        }else {
            alert("이미지 파일이 아닙니다.");
        }
    }
    reader.readAsDataURL(input.files[0])
}

function redraw() {
    resoponsiveness = document.getElementById("responsiveness-bubble").innerText;
    brightness = document.getElementById("brightness-bubble").innerText;

    if (document.getElementById("type-of-size-1").checked) {
        z = document.getElementById("text-of-size-1").value;
        x = parseInt(imgWidth * z * 0.25) * 8;
        y = parseInt(imgHeight * z * 0.065) * 8;
    } else {
        x = parseInt(document.getElementById("text-of-size-2-w-bubble").value) * 4;
        y = parseInt(document.getElementById("text-of-size-2-h-bubble").value) * 2;
    }
    imgResize = new cv.Mat();
    try {
        cv.resize(src, imgResize, new cv.Size(x, y), 0, 0, cv.INTER_AREA);
        cvImg = new cv.Mat(x, y, cv.CV_8UC4);
        preeviewImg = new cv.Mat();
        cv.convertScaleAbs(imgResize, cvImg, 1, Number(brightness));
        cv.convertScaleAbs(src, preeviewImg, 1, Number(brightness));
        saveBrightness = brightness;
        cv.cvtColor(cvImg, cvImg, cv.COLOR_RGBA2GRAY);

        saveBrightness = brightness;
        get_text();
    } catch (e) {
        alert("이미지 크기를 다시 선택하여 주세요. 오류가 발생하였습니다.");
    }
}

function copyText() {
    var range, selection, worked;

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(document.getElementById("show-text-span"));
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(document.getElementById("show-text-span"));
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    try {
        document.execCommand('copy');
        alert('복사되었습니다.');
    }
    catch (err) {
        alert('복사할 수 없습니다.');
    }
}

function showExplain(explain) {
    if (explain.style.display == "none") {
        explain.style.display = "block";
    } else {
        explain.style.display = "none";
    }
}

function fixedRatioChange() {
    if (document.getElementById("fixed-ratio").checked) {

        hRatio = parseInt(imgHeight * 0.065 *2 / (imgWidth * 0.25) * parseInt(document.getElementById("text-of-size-2-w-bubble").value));
        document.getElementById("text-of-size-2-h").value = hRatio;
        document.getElementById("text-of-size-2-h-bubble").value = hRatio;
    }
}