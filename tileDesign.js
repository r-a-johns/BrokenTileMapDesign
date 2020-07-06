function getEmptySaveData(){
    let emptySaveData = {
        version: 1,
        tileWidth: 70,
        tileHeight: 70,
        heightInTiles: 50,
        widthInTiles: 50,
        mapArray: emptyMapArray(),
        paleteMap: [
            {p: 0, imgs: []},
            {p: 1, imgs: []},
            {p: 2, imgs: []},
            {p: 3, imgs: []},
            {p: 4, imgs: []},
            {p: 5, imgs: []},
            {p: 6, imgs: []},
            {p: 7, imgs: []},
            {p: 8, imgs: []},
            {p: 9, imgs: []},
        ]
    }
    return emptySaveData;
}

function emptyMapArray() {
    let mapArray = [];
    for (var mapArrayX = 0; mapArrayX < 100; mapArrayX++) {
        mapArray[mapArrayX] = []
        for (var mayArrayY = 0; mayArrayY < 100; mayArrayY++) {
            mapArray[mapArrayX][mayArrayY] = {
                x: mapArrayX,
                y: mayArrayY,
                imgs: []
            };
        }
    }
    return mapArray;
}

function getContext(canvas) {
    let ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    return ctx;
}

function drawImgsOnCanvas(ctx, imgs, cordX, cordY, width, height){
    try {
        ctx.clearRect(cordX, cordY, width, height)
        if ((imgs != null) && (imgs.length > 0)) {
            for (let c = 0; c < imgs.length; c++) {
                let img = imgs[c];
                try{
                    ctx.drawImage(tileSet[img], cordX, cordY, width, height)
                } catch (e) {
                }
            };
        }
    } catch (e) {
    }
}

function drawSquare(ctx, squareX, squareY, imgs, width, height) {
    let cordX = width * squareX,
        cordY = height * squareY;
    ctx.beginPath();
    if (document.getElementById("showRedGrid").checked) {
        ctx.strokeStyle = "red";
    } else {
        ctx.strokeStyle = "black";
    }
    if ((tempData.sX == squareX) && (tempData.sY == squareY)) {
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
    } else {
        ctx.fillStyle = "red";
    }
    drawImgsOnCanvas(ctx, imgs, cordX, cordY, saveData.tileWidth, saveData.tileHeight)
    if (document.getElementById("showXY").checked) {
        ctx.font = "10px Comic Sans MS";
        ctx.textAlign = "left";
        ctx.fillText("[" + squareX + "," + squareY + "]", cordX, 10 + cordY);
    }
    if (document.getElementById("showGrid").checked) {
        ctx.strokeRect(cordX, cordY, saveData.tileWidth, saveData.tileHeight);
    }
    if ((tempData.sX == squareX) && (tempData.sY == squareY)) {
        ctx.strokeRect(cordX, cordY, saveData.tileWidth, saveData.tileHeight);
    }
}

function render(square) {
    let ctx = getContext(document.getElementById("mapCanvas"));
    if (square == null) {
        for (let mapArrayX = 0; mapArrayX < saveData.mapArray.length; mapArrayX++) {
            for (let mapArrayY = 0; mapArrayY < saveData.mapArray[mapArrayX].length; mapArrayY++) {
                let square = saveData.mapArray[mapArrayX][mapArrayY];
                drawSquare(ctx, square.x, square.y, square.imgs, saveData.tileWidth, saveData.tileHeight);
            }
        }
    } else {
        drawSquare(ctx, square.x, square.y, square.imgs, saveData.tileWidth, saveData.tileHeight);
    }
    renderPalete();
}

function addToSquare(square, tile, bottom){
    if(bottom){
        if((square.imgs.length!=0)&&(square.imgs[0]==tile)){
        } else {
            square.imgs.unshift(tile);
        }
    } else {
        if((square.imgs.length!=0)&&(square.imgs[square.imgs.length-1]==tile)){
        } else {
            square.imgs.push(tile);
        }
    }
    render(square);
}
function whereOnCanvas(event){
    let elem = document.getElementById('mapCanvas');
    let elemOffsetLeft = elem.offsetLeft,
        elemOffsetTop = elem.offsetTop;
    let elemScrollLeft = elem.parentNode.scrollLeft,
        elemScrollTop = elem.parentNode.scrollTop;
    let elemParentOffsetLeft = elem.parentNode.offsetLeft,
        elemParentOffsetTop = elem.parentNode.offsetTop;
    let x = elemScrollLeft + (event.pageX - (elemParentOffsetLeft + elemOffsetLeft)),
        y = elemScrollTop + (event.pageY - (elemParentOffsetTop + elemOffsetTop));
    return {x:Math.floor(x / saveData.tileWidth, 0),y:Math.floor(y / saveData.tileHeight, 0)}
}
function canvasEvent(event) {
    if(event.type=="click"){
        let where = whereOnCanvas(event)
        let previousSquareX = tempData.sX, previousSquareY = tempData.sY;
        tempData.sX = where.x; tempData.sY = where.y;
        if ((tempData.lastImg != null) && (event.ctrlKey == true)) {
            addToSquare(saveData.mapArray[tempData.sX][tempData.sY], tempData.lastImg, event.shiftKey);
        }
        if ((tempData.lastImg != null) && (event.altKey == true)) {
            if (previousSquareX <= tempData.sX) {
                for (var iX = previousSquareX; iX <= tempData.sX; iX++) {
                    if (previousSquareY <= tempData.sY) {
                        for (var iY = previousSquareY; iY <= tempData.sY; iY++) {
                            addToSquare(saveData.mapArray[iX][iY], tempData.lastImg, event.shiftKey);
                        }
                    } else {
                        for (var iY = tempData.sY; iY <= previousSquareY; iY++) {
                            addToSquare(saveData.mapArray[iX][iY], tempData.lastImg, event.shiftKey);
                        }
                    }
                }
            } else {
                for (var iX = tempData.sX; iX <= previousSquareX; iX++) {
                    if (previousSquareY <= tempData.sY) {
                        for (var iY = previousSquareY; iY <= tempData.sY; iY++) {
                            addToSquare(saveData.mapArray[iX][iY], tempData.lastImg, event.shiftKey);
                        }
                    } else {
                        for (var iY = tempData.sY; iY <= previousSquareY; iY++) {
                            addToSquare(saveData.mapArray[iX][iY], tempData.lastImg, event.shiftKey);
                        }
                    }
                }
            }
        }
        displaySelectedInfo(saveData.mapArray[tempData.sX][tempData.sY]);
        if (previousSquareX != null) {
            render(saveData.mapArray[previousSquareX][previousSquareY]);
        }
        render(saveData.mapArray[tempData.sX][tempData.sY]);                    
    }
}

function displaySelectedInfo(square) {
    document.getElementById('selectedCoordsDiv').innerHTML = "(" + square.x + ", " + square.y + ")"
    document.getElementById('selectedImgDiv').innerHTML = "";
    square.imgs.forEach(function (i, c) {
        let x = document.createElement("div")
        try{
            let z = tileSet[i].cloneNode(true);
            z.setAttribute("onclick", "");
            x.appendChild(z);
        } catch (e){}
        const xsf = '<button onclick="removeTile(' + square.x + ', ' + square.y + ', ' + c + ')"><svg class="bi bi-x-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm9.854 4.854a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clip-rule="evenodd"/></svg></button>';
        const dsf = '<button onclick="moveTile(' + square.x + ', ' + square.y + ', ' + c + ', true)"><svg class="bi bi-dash-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm2 7.5a.5.5 0 000 1h8a.5.5 0 000-1H4z" clip-rule="evenodd"/></svg></button>';
        const psf = '<button onclick="moveTile(' + square.x + ', ' + square.y + ', ' + c + ', false)"><svg class="bi bi-plus-square-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm6.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z" clip-rule="evenodd"/></svg></button>';
        x.innerHTML += xsf + dsf + psf;
        document.getElementById('selectedImgDiv').appendChild(x);
    });
}

function tilePicked(tile, event) {
    if (tempData.sX != null) {
        addToSquare(saveData.mapArray[tempData.sX][tempData.sY], tile, event.shiftKey);
        tempData.lastImg = tile;
        render(saveData.mapArray[tempData.sX][tempData.sY]);
        displaySelectedInfo(saveData.mapArray[tempData.sX][tempData.sY]);
    }
}

function removeTile(squareX, squareY, imgsZ) {
    saveData.mapArray[squareX][squareY].imgs.splice(imgsZ, 1);
    render(saveData.mapArray[squareX][squareY]);
    displaySelectedInfo(saveData.mapArray[tempData.sX][tempData.sY]);
}

function moveTile(squareX, squareY, imgsZ, moveUp){
    if(moveUp){
        if(imgsZ==0){
            return;
        } else {
            let i1 = saveData.mapArray[squareX][squareY].imgs[imgsZ];
            let i2 = saveData.mapArray[squareX][squareY].imgs[imgsZ-1];
            saveData.mapArray[squareX][squareY].imgs[imgsZ] = i2;
            saveData.mapArray[squareX][squareY].imgs[imgsZ-1] = i1;
        }
    } else {
        if(imgsZ==(saveData.mapArray[squareX][squareY].imgs.length-1)){
            return;
        } else {
            let i1 = saveData.mapArray[squareX][squareY].imgs[imgsZ];
            let i2 = saveData.mapArray[squareX][squareY].imgs[imgsZ+1];
            saveData.mapArray[squareX][squareY].imgs[imgsZ] = i2;
            saveData.mapArray[squareX][squareY].imgs[imgsZ+1] = i1;
        }
    }
    render(saveData.mapArray[squareX][squareY]);
    displaySelectedInfo(saveData.mapArray[tempData.sX][tempData.sY]);
}
function clearSquare(squareX, squareY){
    saveData.mapArray[squareX][squareY].imgs = [];
    render(saveData.mapArray[squareX][squareY]);
    displaySelectedInfo(saveData.mapArray[tempData.sX][tempData.sY]);
}
function export2txt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(saveData)], {
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
            loadSaveData(JSON.parse(text));
            render();
        });
        reader.readAsText(fileList[0]);
    }
}

function validateSaveData(sd){
    if(!((sd.tileWidth!=null)&&(parseInt(sd.tileWidth))&&(parseInt(sd.tileWidth)>0)&&(parseInt(sd.tileWidth)<200))){return false;}
    if(!((sd.tileHeight!=null)&&(parseInt(sd.tileHeight))&&(parseInt(sd.tileHeight)>0)&&(parseInt(sd.tileHeight)<200))){return false;}
    if(!((sd.heightInTiles!=null)&&(parseInt(sd.heightInTiles))&&(parseInt(sd.heightInTiles)>0)&&(parseInt(sd.heightInTiles)<200))){return false;}
    if(!((sd.widthInTiles!=null)&&(parseInt(sd.widthInTiles))&&(parseInt(sd.widthInTiles)>0)&&(parseInt(sd.widthInTiles)<200))){return false;}
    return true;
}

function loadSaveData(sd){
    if(sd.dx==null){
        saveData = getEmptySaveData();
    } else {
        if(validateSaveData(sd)){
            saveData = {
                tileWidth: sd.tileWidth,
                tileHeight: sd.tileHeight,
                heightInTiles: sd.heightInTiles,
                widthInTiles: sd.widthInTiles,
                mapArray: sd.mapArray,
                paleteMap: sd.paleteMap
            }
        } else {
            alert("Error loading save data")
        }    
    }
}

function selectedWidthChanged(){
    saveData.widthInTiles = parseInt(document.getElementById("inputGroupSelectWidth").value);
    document.getElementById("mapCanvas").width = saveData.widthInTiles * saveData.tileWidth;
    render();
}
function selectedHeightChanged(){
    saveData.heightInTiles = parseInt(document.getElementById("inputGroupSelectHeight").value);
    document.getElementById("mapCanvas").height = saveData.heightInTiles * saveData.tileHeight;
    render();
}
function selectedZoomChanged(){
    saveData.tileWidth = parseInt(document.getElementById("inputGroupSelectZoom").value);
    saveData.tileHeight = parseInt(document.getElementById("inputGroupSelectZoom").value);
    document.getElementById("mapCanvas").width = saveData.widthInTiles * saveData.tileWidth;
    document.getElementById("mapCanvas").height = saveData.heightInTiles * saveData.tileHeight;
    render();
}


function renderPalete(){
    for(var i=0;i<saveData.paleteMap.length;i++){
        let canvas = document.getElementById("paleteCanvas-"+i);
        let ctx = getContext(document.getElementById("paleteCanvas-"+i));
        drawImgsOnCanvas(ctx, saveData.paleteMap[i].imgs, 0, 0, canvas.width, canvas.height)
    }
}

function addPaleteToTile(squareX, squareY, p, bottom){
    for(let i=0;i<saveData.paleteMap[p].imgs.length;i++){
        addToSquare(saveData.mapArray[squareX][squareY], saveData.paleteMap[p].imgs[i], bottom)
    }
    displaySelectedInfo(saveData.mapArray[squareX][squareY]);
}

function addTileToPalete(tile, p, bottom){
    addToSquare(saveData.paleteMap[p], tile, bottom)
}

function clearPalete(p){
    saveData.paleteMap[p].imgs=[];
    render();
}

function whichTile(event){
    let displayedImg = $("#myTabContent .active img");
    for(let i=0;i<displayedImg.length;i++){
        let elem = displayedImg[i];
        eTop = window.scrollY + elem.getBoundingClientRect().top // Y
        eLeft = window.scrollX + elem.getBoundingClientRect().left
        if((event.pageX>=eLeft)&&(event.pageX<(elem.width + eLeft))){
            if((event.pageY>=eTop)&&(event.pageY<(elem.height + eTop))){
                return elem;
            }
        }       
    }
}

function whichTileSet(event){
    let displayedImg = $("#myTab li img");
    for(let i=0;i<displayedImg.length;i++){
        let elem = displayedImg[i];
        eTop = window.scrollY + elem.getBoundingClientRect().top // Y
        eLeft = window.scrollX + elem.getBoundingClientRect().left
        if((event.pageX>=eLeft)&&(event.pageX<(elem.width + eLeft))){
            if((event.pageY>=eTop)&&(event.pageY<(elem.height + eTop))){
                return elem;
            }
        }       
    }
}

function getDefaultTileSet() {
    let defaultTileSet = [];
    for (let tsdI = 0; tsdI < tilesetData.length; tsdI++) {
        ts = tilesetData[tsdI];
        let htmlBlock1 = "";
        let htmlBlock2 = "";
        htmlBlock1 += '<li class="nav-item">'
        htmlBlock1 += '  <a class="nav-link" id="' + ts.set + '-tab" data-toggle="tab" href="#' + ts.set + '" role="tab" aria-controls="' + ts.set + '" aria-selected="true">';
        htmlBlock1 += '    <img src="tilesets/' + ts.icon + '" height="20" width="20" title="' + ts.title + '" />'
        htmlBlock1 += '  </a>';
        htmlBlock1 += '</li>';
        htmlBlock2 += '<div class="tab-pane fade" id="' + ts.set + '" role="tabpanel" aria-labelledby="' + ts.set + '-tab" style="height: 800px; overflow:scroll">';
        htmlBlock2 += '  <div id="tileSet-' + ts.set + '-div" class="card">';
        htmlBlock2 += '    <ul id="tileSet-' + ts.set + '-ul" class="list-group list-group-flush"></ul>';
        htmlBlock2 += '  </div>';
        htmlBlock2 += '</div>';
        document.getElementById("myTab").innerHTML += htmlBlock1;
        document.getElementById("myTabContent").innerHTML += htmlBlock2;
        let tileSetUl = document.getElementById("tileSet-" + ts.set + "-ul")
        if (tileSetUl != null) {
            let tileSubSet = [];
            tileSetUl.innerHTML = "";
            for (let tileSetI = 0; tileSetI < ts.tiles.length; tileSetI++) {
                let tile = ts.tiles[tileSetI];
                if (tileSubSet[tile.subset] == null) {
                    tileSubSet[tile.subset] = document.createElement("li")
                    tileSubSet[tile.subset].setAttribute("class", "list-group-item")
                    tileSetUl.appendChild(tileSubSet[tile.subset]);
                }
                let img = document.createElement("img");
                img.setAttribute("src", "tilesets/" + tile.src);
                img.setAttribute("id", tile.id);
                img.setAttribute("tilesetId", tile.id);
                img.setAttribute("width", 40);
                img.setAttribute("height", 40);
                img.setAttribute("onclick", "tilePicked('" + tile.id + "', event)");
                img.setAttribute("style", "padding: 2px; border: solid 1px black");
                tileSubSet[tile.subset].appendChild(img);
                if (tile.br == true) {
                    tileSubSet[tile.subset].appendChild(document.createElement("br"));
                }
                defaultTileSet[tile.id] = img;
            }
        }
    }
    return defaultTileSet;
}

