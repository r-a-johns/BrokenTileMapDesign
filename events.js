
            var mousePosition = {x:0, y:0};

            document.addEventListener('mousemove', function(mouseMoveEvent){
                mousePosition.x = mouseMoveEvent.pageX;
                mousePosition.y = mouseMoveEvent.pageY;
            }, false);

            document.addEventListener('keyup', function(keyUpEvent){
                keyUpEvent.pageX = mousePosition.x;
                keyUpEvent.pageY = mousePosition.y;
                let w = whereOnCanvas(keyUpEvent);
                switch (keyUpEvent.code) {
                    case  "KeyQ":
                        if((w.x>=0)&&(w.x<saveData.widthInTiles)&&(w.y>=0)&&(w.y<saveData.heightInTiles)){
                            removeTile(w.x, w.y, 0);
                        }
                        break;
                    case "KeyW":
                        if((w.x>=0)&&(w.x<saveData.widthInTiles)&&(w.y>=0)&&(w.y<saveData.heightInTiles)){
                            removeTile(w.x, w.y, saveData.mapArray[w.x][w.y].imgs.length-1);
                        }
                        break;
                    case "KeyC":
                        if((w.x>=0)&&(w.x<saveData.widthInTiles)&&(w.y>=0)&&(w.y<saveData.heightInTiles)){
                            clearSquare(w.x, w.y);
                        }
                        break;
                    case "Digit0":
                    case "Numpad0":
                    case "Digit1":
                    case "Numpad1":
                    case "Digit2":
                    case "Numpad2":
                    case "Digit3":
                    case "Numpad3":
                    case "Digit4":
                    case "Numpad4":
                    case "Digit5":
                    case "Numpad5":
                    case "Digit6":
                    case "Numpad6":
                    case "Digit7":
                    case "Numpad7":
                    case "Digit8":
                    case "Numpad8":
                    case "Digit9":
                    case "Numpad9":
                        let p = keyUpEvent.code[keyUpEvent.code.length-1];
                        if((w.x>=0)&&(w.x<saveData.widthInTiles)&&(w.y>=0)&&(w.y<saveData.heightInTiles)){
                            addPaleteToTile(w.x, w.y, p, keyUpEvent.shiftKey)
                        } else {
                            let t = whichTile(keyUpEvent);
                            if(t!=null){
                                addTileToPalete(t.id, p, event.shiftKey);
                            }
                        }
                        break;
                    case  "KeyH":
                        let t = whichTile(keyUpEvent);
                        if(t!=null){
                            
                            t.parentElement.style.display = "none";
                            //addTileToPalete(t.id, p, event.shiftKey);
                        }
                        let ts = whichTileSet(keyUpEvent);
                        if(ts!=null){
                            ts.parentElement.parentElement.style.display = "none";
                        }
                        //keyUpEvent.srcElement.style.display = "none"
                        break;
                    default:
                        break;
                }

            }, false);
