function loadMap(m) {
    map = m;
    mapArray = [];
    for (var i = 0; i < map.length; i++) {
        let square = map[i];
        if (mapArray[square.x] == null) {
            mapArray[square.x] = []
        }
        mapArray[square.x][square.y] = square;
    }
}

function getContext(c) {
    let ctx = c.getContext("2d");
    ctx.lineWidth = 1;
    return ctx;
}

function drawImgsOnCanvas(ctx, imgs, oX, oY, dX, dY){
    try {
        ctx.clearRect(oX, oY, dX, dY)
        if ((imgs != null) && (imgs.length > 0)) {
            for (var c = 0; c < imgs.length; c++) {
                let i = imgs[c];
                try{
                    ctx.drawImage(tileSet[i], oX, oY, dX, dY)
                } catch (e) {
                    //alert(e);
                }
            };
        }
    } catch (e) {
        //alert(e);
    }
}

function drawSquare(ctx, x, y, imgs) {
    var oX = dX * x,
        oY = dY * y;
    ctx.beginPath();
    if (document.getElementById("showRedGrid").checked) {
        ctx.strokeStyle = "red";
    } else {
        ctx.strokeStyle = "black";
    }
    if ((sX == x) && (sY == y)) {
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
    } else {
        ctx.fillStyle = "red";
    }
    drawImgsOnCanvas(ctx, imgs, oX, oY, dX, dY)
/*    try {
        ctx.drawImage(tileSet[0], oX, oY, dX, dY)
        if ((imgs != null) && (imgs.length > 0)) {
            for (var c = 0; c < imgs.length; c++) {
                let i = imgs[c];
                try{
                    ctx.drawImage(tileSet[i], oX, oY, dX, dY)
                } catch (e) {
                    //alert(e);
                }
            };
        }
    } catch (e) {
        //alert(e);
    }*/
    if (document.getElementById("showXY").checked) {
        ctx.font = "10px Comic Sans MS";
        ctx.textAlign = "left";
        ctx.fillText("[" + x + "," + y + "]", oX, 10 + oY);
    }
    if (document.getElementById("showGrid").checked) {
        ctx.strokeRect(oX, oY, dX, dY);
    }
    if ((sX == x) && (sY == y)) {
        ctx.strokeRect(oX, oY, dX, dY);
    }
}

function render(sq) {
    let ctx = getContext(document.getElementById("mapCanvas"));
    if (sq == null) {
        for (var i = 0; i < map.length; i++) {
            let square = map[i];
            drawSquare(ctx, square.x, square.y, square.img);
        }
    } else {
        drawSquare(ctx, sq.x, sq.y, sq.img);
    }
    renderPalete();
}

function addToSquare(square, tile, bottom){
    if(bottom){
        if((square.img.length!=0)&&(square.img[0]==tile)){
        } else {
            square.img.unshift(tile);
        }
    } else {
        if((square.img.length!=0)&&(square.img[square.img.length-1]==tile)){
        } else {
            square.img.push(tile);
        }
    }
    render(square);
}
function whereOnCanvas(event){
    let elem = document.getElementById('mapCanvas');
    let elemLeft = elem.offsetLeft,
        elemTop = elem.offsetTop;
    let selemLeft = elem.parentNode.scrollLeft,
        selemTop = elem.parentNode.scrollTop;
    let pelemLeft = elem.parentNode.offsetLeft,
        pelemTop = elem.parentNode.offsetTop;
    let x = selemLeft + (event.pageX - (pelemLeft + elemLeft)),
        y = selemTop + (event.pageY - (pelemTop + elemTop));
    return {x:Math.floor(x / dX, 0),y:Math.floor(y / dY, 0)}
}
function canvasEvent(event) {
    if(event.type=="click"){
        let w = whereOnCanvas(event)
        oSX = sX; oSY = sY;
        sX = w.x; sY = w.y;
        if ((lastImg != null) && (event.ctrlKey == true)) {
            addToSquare(mapArray[sX][sY], lastImg, event.shiftKey);
        }
        if ((lastImg != null) && (event.altKey == true)) {
            if (oSX <= sX) {
                for (var iX = oSX; iX <= sX; iX++) {
                    if (oSY <= sY) {
                        for (var iY = oSY; iY <= sY; iY++) {
                            addToSquare(mapArray[iX][iY], lastImg, event.shiftKey);
                        }
                    } else {
                        for (var iY = sY; iY <= oSY; iY++) {
                            addToSquare(mapArray[iX][iY], lastImg, event.shiftKey);
                        }
                    }
                }
            } else {
                for (var iX = sX; iX <= oSX; iX++) {
                    if (oSY <= sY) {
                        for (var iY = oSY; iY <= sY; iY++) {
                            addToSquare(mapArray[iX][iY], lastImg, event.shiftKey);
                        }
                    } else {
                        for (var iY = sY; iY <= oSY; iY++) {
                            addToSquare(mapArray[iX][iY], lastImg, event.shiftKey);
                        }
                    }
                }
            }
        }
        displaySelectedInfo(mapArray[sX][sY]);
        if (oSX != null) {
            render(mapArray[oSX][oSY]);
        }
        render(mapArray[sX][sY]);                    
    }
}

function displaySelectedInfo(square) {
    document.getElementById('selectedCoordsDiv').innerHTML = "(" + square.x + ", " + square.y + ")"
    document.getElementById('selectedImgDiv').innerHTML = "";
    let imgText = "";
    square.img.forEach(function (i, c) {
        let x = document.createElement("div")
        try{
            let z = tileSet[i].cloneNode(true);
            z.setAttribute("onclick", "");
            x.appendChild(z);
        } catch (e){}

        //imgText += '<img src="' + tileSet[i] +'" width="70" height="70" /> <br/>';
        //z.setAttribute("onclick", "removeTile(" + square.x + ", " + square.y + ", " + c + ")");
        const xsf = '<button onclick="removeTile(' + square.x + ', ' + square.y + ', ' + c + ')"><svg class="bi bi-x-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm9.854 4.854a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clip-rule="evenodd"/></svg></button>';
        const dsf = '<button onclick="moveTile(' + square.x + ', ' + square.y + ', ' + c + ', true)"><svg class="bi bi-dash-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm2 7.5a.5.5 0 000 1h8a.5.5 0 000-1H4z" clip-rule="evenodd"/></svg></button>';
        const psf = '<button onclick="moveTile(' + square.x + ', ' + square.y + ', ' + c + ', false)"><svg class="bi bi-plus-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm6.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z" clip-rule="evenodd"/></svg></button>';
        x.innerHTML += xsf + dsf + psf;
        document.getElementById('selectedImgDiv').appendChild(x);
        //document.getElementById('selectedImgDiv').appendChild(document.createElement("BR"));

    });
    //document.getElementById('selectedImgDiv').innerHTML = imgText;

}

function tilePicked(tile, event) {
    if (sX != null) {
        addToSquare(mapArray[sX][sY], tile, event.shiftKey);
        lastImg = tile;
        render(mapArray[sX][sY]);
        displaySelectedInfo(mapArray[sX][sY]);
    }
}

function removeTile(iX, iY, iZ) {
    //mapArray[iX][iY].img = 
    mapArray[iX][iY].img.splice(iZ, 1);
    render(mapArray[iX][iY]);
    displaySelectedInfo(mapArray[sX][sY]);
}

function moveTile(iX, iY, iZ, up){
    if(up){
        if(iZ==0){
            return;
        } else {
            let i1 = mapArray[iX][iY].img[iZ];
            let i2 = mapArray[iX][iY].img[iZ-1];
            mapArray[iX][iY].img[iZ] = i2;
            mapArray[iX][iY].img[iZ-1] = i1;
        }
    } else {
        if(iZ==(mapArray[iX][iY].img.length-1)){
            return;
        } else {
            let i1 = mapArray[iX][iY].img[iZ];
            let i2 = mapArray[iX][iY].img[iZ+1];
            mapArray[iX][iY].img[iZ] = i2;
            mapArray[iX][iY].img[iZ+1] = i1;
        }
    }
    render(mapArray[iX][iY]);
    displaySelectedInfo(mapArray[sX][sY]);
}

function export2txt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(map)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "data.txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function fileSelected(event) {
    fileList = event.target.files;
    if (fileList == null) {
        alert("Select file to load first!")
    } else {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let text = event.target.result;
            loadMap(JSON.parse(text));
            render();
        });
        reader.readAsText(fileList[0]);
    }
}

function selectedWidthChanged(){
    widthInTiles = parseInt(document.getElementById("inputGroupSelectWidth").value);
    document.getElementById("mapCanvas").width = widthInTiles * dX;
    render();
}
function selectedHeightChanged(){
    heightInTiles = parseInt(document.getElementById("inputGroupSelectHeight").value);
    document.getElementById("mapCanvas").height = heightInTiles * dY;
    render();
}
function selectedZoomChanged(){
    dX = parseInt(document.getElementById("inputGroupSelectZoom").value);
    dY = parseInt(document.getElementById("inputGroupSelectZoom").value);
    document.getElementById("mapCanvas").width = widthInTiles * dX;
    document.getElementById("mapCanvas").height = heightInTiles * dY;
    render();
}


function renderPalete(){
    for(var i=0;i<paleteMap.length;i++){
        let e = document.getElementById("paleteCanvas-"+i);
        let ctx = getContext(document.getElementById("paleteCanvas-"+i));
        drawImgsOnCanvas(ctx, paleteMap[i], 0, 0, e.width, e.height)
    }
}

function addPaleteToTile(x, y, p, bottom){
    for(let i=0;i<paleteMap[p].length;i++){
        addToSquare(mapArray[x][y], paleteMap[p][i], bottom)
    }
}