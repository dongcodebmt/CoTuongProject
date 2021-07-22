var app = new Vue({
    el: '#app',
    data: {
        roomId: 0,
        namePlayer: null,
        player: true,
        isOver: false,
        pos: 0,
        mem: [],
        chessNode: [],
        chessMatrix: [[]],
        indexStartI: -1,
        indexStartJ: -1,
        indexStopI: -1,
        indexStopJ: -1,
        originalX: 106,
        originalY: 61,
        squares: 74
    },
    methods: {
        initMatrix() {
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 8; j++) {
                    this.$set(this.chessMatrix[i], j, this.initPoint(this.getXValue(j), this.getYValue(i), ""));
                }
            }
        },
        initPrintMatrix() {
            for (var i = 0; i <= 9; i++) {
                var strMatrix = "";
                for (var j = 0; j <= 8; j++) {
                    strMatrix += '  ' + "(" + this.chessMatrix[i][j].top + ',' + this.chessMatrix[i][j].left + "-" + this.chessMatrix[i][j].id + ")";
                }
            }
        },
        initPoint(left, top, chessNodeId) {
            let temp = {};
            temp.top = top;
            temp.left = left;
            temp.id = chessNodeId;
            return temp;
        },
        getXValue(index) {
            return this.originalX + (index * this.squares);
        },
        getYValue(index) {
            return this.originalY + (index * this.squares);
        },
        hasChessNode(left, top, id) {
            this.indexStopI = -1;
            this.indexStopJ = -1;
            this.getIndex(left, top, "stop");
            var idPointStop = this.chessMatrix[this.indexStopI][this.indexStopJ].id;

            if (idPointStop == "") {
                return 0; /// khong co quan co nao tai vi tri nay
            }
            if (id.indexOf("do") >= 0) {
                if (idPointStop.indexOf("do") >= 0) {
                    return 1; //quan cung loai do
                }
                else
                    return -1; //quan khac loai
            }
            if (id.indexOf("den") >= 0) {
                if (idPointStop.indexOf("den") >= 0) {
                    return 1; //quan cung loai den
                }
                else
                    return -1; //quan khac loai
            }

        },
        setChessNodeToMatrix(chessNode) {
            this.indexStopI = -1;
            this.indexStopJ = -1;

            this.getIndex(chessNode.left, chessNode.top, "stop");
            if (this.indexStopI == -1 && this.indexStopI == -1) {
                return;
            }
            this.$set(this.chessMatrix[this.indexStopI][this.indexStopJ], "id", chessNode.id);
        },
        getIndex(left, top, typeofMove) {
            if (typeofMove == "stop") {
                this.indexStopI = -1;
                this.indexStopJ = -1;
            }
            if (typeofMove == "start") {
                this.indexStartI = -1;
                this.indexStartJ = -1;
            }
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 8; j++) {
                    if (Math.abs(this.chessMatrix[i][j].top - top) < 20 && Math.abs(this.chessMatrix[i][j].left - left) < 20) {
                        if (typeofMove == "stop") {
                            this.indexStopI = i;
                            this.indexStopJ = j;
                            return;
                        }
                        if (typeofMove == "start") {
                            this.indexStartI = i;
                            this.indexStartJ = j;
                            return;
                        }
                    }
                }
            }
        },
        getchessNode() {
            axios.post('/api/chess/getchessnode').then(response => {
                this.chessNode = response.data.chessnode;
                this.chessMatrix = response.data.matrix;
                this.initMatrix();
                for (var i = 0; i < this.chessNode.length; i++) {
                    this.setChessNodeToMatrix(this.chessNode[i]);
                }
                this.initPrintMatrix();
            }).catch(error => {
                console.log(error)
            }).finally();
        },
        revert(left, top, id) {
            var node = $("#" + id);
            node.css({ 'top': top + 'px' });
            node.css({ 'left': left + 'px' });
        },
        getChessBoard() {
            var listChessNode = [];
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 8; j++) {
                    if (this.chessMatrix[i][j].id) {
                        var node = { id: this.chessMatrix[i][j].id, src: $("#" + this.chessMatrix[i][j].id).children('img').attr('src').substring(1), top: this.chessMatrix[i][j].top, left: this.chessMatrix[i][j].left, visible: 'inline' };
                        listChessNode.push(node);
                    }
                }
            }
            var data = { player: this.player, data: listChessNode };
            return JSON.stringify(data);
        },
        setChessBoard(data) {
            res = JSON.parse(data);
            this.chessNode = [];
            this.player = res.player;
            axios.post('/api/chess/getchessnode').then(response => {
                this.chessNode = res.data;
                this.chessMatrix = response.data.matrix;
                this.initMatrix();
                for (var i = 0; i < this.chessNode.length; i++) {
                    this.setChessNodeToMatrix(this.chessNode[i]);
                }
                this.initPrintMatrix();
            }).catch(error => {
                console.log(error)
            }).finally();
        },
        saveChessBoard() {
            var listChessNode = this.getChessBoard();
            var fileToSave = new Blob([listChessNode], {
                type: 'application/json'
            });

            saveAs(fileToSave, "chess.json");
        },
        loadChessBoard() {
            var fr = new FileReader();
            fr.onload = function (evt) {
                app.setChessBoard(evt.target.result);
            };
            fr.readAsText(document.getElementById('file').files[0]);
        },
        reloadBoard() {
            this.chessNode = [];
            this.player = true;
            this.getchessNode();
        },
        kiemTraDuongCheo(stopI, startI, stopJ, startJ) {
            if (stopI > startI && stopJ > startJ) {
                if (app.chessMatrix[stopI - 1][stopJ - 1].id)
                    return 1;
            }
            if (stopI > startI && stopJ < startJ) {
                if (app.chessMatrix[stopI - 1][stopJ + 1].id)
                    return 1;
            }
            if (stopI < startI && stopJ > startJ) {
                if (app.chessMatrix[stopI + 1][stopJ - 1].id)
                    return 1;
            }
            if (stopI < startI && stopJ < startJ) {
                if (app.chessMatrix[stopI + 1][stopJ + 1].id)
                    return 1;
            }
            return 0;
        },
        kiemTraDuongThang(stopI, startI, stopJ, startJ) {
            var check = 0;
            if (stopI == startI && stopJ > startJ) {
                for (let i = startJ + 1; i < stopJ; i++) {
                    if (app.chessMatrix[stopI][i].id)
                        check++;
                }
            }
            if (stopI == startI && stopJ < startJ) {
                for (let i = stopJ + 1; i < startJ; i++) {
                    if (app.chessMatrix[stopI][i].id)
                        check++;
                }
            }
            if (stopJ == startJ && stopI > startI) {
                for (let i = startI + 1; i < stopI; i++) {
                    if (app.chessMatrix[i][stopJ].id)
                        check++;
                }
            }
            if (stopJ == startJ && stopI < startI) {
                for (let i = stopI + 1; i < startI; i++) {
                    if (app.chessMatrix[i][stopJ].id)
                        check++;
                }
            }
            return check;
        },
        kiemTraDuongDiQuanMa(stopI, startI, stopJ, startJ) {
            if ((stopI - startI) == 2) {
                if (app.chessMatrix[startI + 1][startJ].id)
                    return 1;
            }
            if ((stopI - startI) == -2) {
                if (app.chessMatrix[startI - 1][startJ].id)
                    return 1;
            }
            if ((stopJ - startJ) == 2) {
                if (app.chessMatrix[startI][startJ + 1].id)
                    return 1;
            }
            if ((stopJ - startJ) == -2) {
                if (app.chessMatrix[startI][startJ - 1].id)
                    return 1;
            }
            return 0;
        },
        chongTuong(stopJ, id) {
            var check = 0;
            var flag = false;
            for (let i = 0; i <= 9; i++) {
                if (app.chessMatrix[i][stopJ].id && !(app.chessMatrix[i][stopJ].id.indexOf("chutuong") >= 0)) {
                    check++;
                }
                if (app.chessMatrix[i][stopJ].id.indexOf("chutuong") >= 0 && app.chessMatrix[i][stopJ].id != id) {
                    flag = true;
                }
            }
            if (flag == true && check < 1) {
                return false;
            }
            return true;
        },
        anQuanCo(id) {
            if (id.indexOf("chutuongdo") >= 0) {
                alert("Đen thắng");
                isOver = true;
            }
            if (id.indexOf("chutuongden") >= 0) {
                alert("Đỏ thắng")
                isOver = true;
            }
            var movelist = [{ id: id, top: 999, left: 999, visible: false }];
            app.sendMoveList(movelist);
        },
        xuLyNuocDi(stopI, startI, stopJ, startJ, id) {
            if (app.hasChessNode(app.chessMatrix[stopI][stopJ].left, app.chessMatrix[stopI][stopJ].top, app.chessMatrix[startI][startJ].id) == -1) {
                app.anQuanCo(app.chessMatrix[stopI][stopJ].id);
            }
            var node = $("#" + id);
            node.css({ 'top': app.chessMatrix[stopI][stopJ].top + 'px' });
            node.css({ 'left': app.chessMatrix[stopI][stopJ].left + 'px' });
            app.$set(app.chessMatrix[startI][startJ], "id", "");

            return true;
        },
        sendMoveList(movelist) {
            axios.post('/api/chess/movenode', {
                group: this.roomId,
                name: $('#hName').val(),
                movelist: movelist
            }).then(response => {
            }).catch(error => {
                console.log(error)
            }).finally();
        },
        loadClient(chatHub) {
            chatHub.client.message = function (group, name, msg) {
                $('#contentMsg').append(
                    '<div class="chat-message-right">' +
                    '<div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">' +
                    '<div class="font-weight-bold mb-1"><b>' + name + '</b></div> ' + msg +
                    '</div></div><div style="height: 1rem"></div>'
                );
            }
            chatHub.client.connect = function (group, name) {
                app.namePlayer = name;
            }
        },
        saveMove() {
            if (this.pos + 1 >= this.mem.length) {
                this.mem.push(this.getChessBoard());
                this.pos++;
            } else {
                app.mem.splice(app.pos);
                app.mem.push(app.getChessBoard());
                app.pos++;
            }
        },
        undoMove() {
            if (app.pos >= 0) {
                app.setChessBoard(app.mem[--app.pos]);
            }
        },
        redoMove() {
            if (this.pos < this.mem.length) {
                this.pos = this.pos + 1;
                this.setChessBoard(this.mem[this.pos]);
            }
        }
    },
    updated: function () {
        var originaltop = 0;
        var originalleft = 0;
        $(".chessnode").draggable({
            start: function (event, ui) {
                $(this).css("z-index", "1000");
                originaltop = ui.position.top;
                originalleft = ui.position.left;
            },
            drag: function () {

            },
            stop: function (event, ui) {
                $(this).css("z-index", "auto");
                app.indexStopI = -1;
                app.indexStopJ = -1;
                app.getIndex(ui.position.left, ui.position.top, "stop");
                var movelist;
                try {
                    movelist = [{
                        id: this.id, top: app.chessMatrix[app.indexStopI][app.indexStopJ].top, left: app.chessMatrix[app.indexStopI][app.indexStopJ].left, visible: true
                    }];
                } catch (error) {
                    app.revert(originalleft, originaltop, this.id);
                }


                //Các nước đi của từng quân cờ
                if (app.indexStopI != -1 && app.indexStopJ != -1) {
                    app.getIndex(originalleft, originaltop, "start");
                    var flag = false;
                    //Tướng
                    if (this.id.indexOf("chutuongdo") >= 0 && app.player == true) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 0 && Math.abs(app.indexStopJ - app.indexStartJ) == 1) ||
                            (Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 0)) &&
                            (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 0 && app.indexStopI <= 2) &&
                            app.chongTuong(app.indexStopJ, this.id) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("chutuongden") >= 0 && app.player == false) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 0 && Math.abs(app.indexStopJ - app.indexStartJ) == 1) ||
                            (Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 0))
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 7 && app.indexStopI <= 9) &&
                            app.chongTuong(app.indexStopJ, this.id) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Sĩ
                    if ((this.id.indexOf("sido1") >= 0 || this.id.indexOf("sido2") >= 0) && app.player == true) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 1 && Math.abs(app.indexStartJ - app.indexStopJ) == 1)
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 0 && app.indexStopI <= 2) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if ((this.id.indexOf("siden1") >= 0 || this.id.indexOf("siden2") >= 0) && app.player == false) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 1 && Math.abs(app.indexStartJ - app.indexStopJ) == 1)
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 7 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //tượng
                    if ((this.id.indexOf("tuongdo1") >= 0 || this.id.indexOf("tuongdo2") >= 0) && app.player == true) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 2 && Math.abs(app.indexStartJ - app.indexStopJ) == 2) &&
                            app.kiemTraDuongCheo(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 4) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if ((this.id.indexOf("tuongden1") >= 0 || this.id.indexOf("tuongden2") >= 0) && app.player == false) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 2 && Math.abs(app.indexStartJ - app.indexStopJ) == 2) &&
                            app.kiemTraDuongCheo(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 5 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Xe
                    if ((this.id.indexOf("xedo1") >= 0 || this.id.indexOf("xedo2") >= 0) && app.player == true) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) != 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if ((this.id.indexOf("xeden1") >= 0 || this.id.indexOf("xeden2") >= 0) && app.player == false) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) != 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Mã
                    if ((this.id.indexOf("mado1") >= 0 || this.id.indexOf("mado2") >= 0) && app.player == true) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 2) || (Math.abs(app.indexStopI - app.indexStartI) == 2 && Math.abs(app.indexStopJ - app.indexStartJ) == 1)) &&
                            app.kiemTraDuongDiQuanMa(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if ((this.id.indexOf("maden1") >= 0 || this.id.indexOf("maden2") >= 0) && app.player == false) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 2) || (Math.abs(app.indexStopI - app.indexStartI) == 2 && Math.abs(app.indexStopJ - app.indexStartJ) == 1)) &&
                            app.kiemTraDuongDiQuanMa(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Pháo
                    if ((this.id.indexOf("phaodo1") >= 0 || this.id.indexOf("phaodo2") >= 0) && app.player == true) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            if (app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                                app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) == 0) {
                                flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                            }
                            if (app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 1 && app.chessMatrix[app.indexStopI][app.indexStopJ].id) {
                                flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                            }
                        }
                    }
                    if ((this.id.indexOf("phaoden1") >= 0 || this.id.indexOf("phaoden2") >= 0) && app.player == false) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            if (app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                                app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) == 0) {
                                flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                            }
                            if (app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 1 && app.chessMatrix[app.indexStopI][app.indexStopJ].id) {
                                flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                            }
                        }
                    }
                    //Tốt
                    if ((this.id.indexOf("totdo1") >= 0 || this.id.indexOf("totdo2") >= 0 || this.id.indexOf("totdo3") >= 0 || this.id.indexOf("totdo4") >= 0 || this.id.indexOf("totdo5") >= 0) && app.player == true) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            ((app.indexStartJ == app.indexStopJ && app.indexStopI - app.indexStartI == 1 && app.indexStopI >= 3 && app.indexStopI <= 4) ||
                                ((app.indexStopI - app.indexStartI == 1 || Math.abs(app.indexStopJ - app.indexStartJ) == 1) && app.indexStopI >= 5 && app.indexStopI <= 9)) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if ((this.id.indexOf("totden1") >= 0 || this.id.indexOf("totden2") >= 0 || this.id.indexOf("totden3") >= 0 || this.id.indexOf("totden4") >= 0 || this.id.indexOf("totden5") >= 0) && app.player == false) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            ((app.indexStartJ == app.indexStopJ && app.indexStopI - app.indexStartI == -1 && app.indexStopI >= 5 && app.indexStopI <= 6) ||
                                ((app.indexStopI - app.indexStartI == -1 || Math.abs(app.indexStopJ - app.indexStartJ) == 1) && app.indexStopI >= 0 && app.indexStopI <= 4)) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }

                    if (flag == true)
                        app.sendMoveList(movelist);
                    else
                        app.revert(originalleft, originaltop, this.id);
                } else {
                    app.revert(originalleft, originaltop, this.id);
                }


            }
        });
    },
    mounted: function () {
        let searchParams = new URLSearchParams(window.location.search);
        this.roomId = searchParams.get('roomid');

        var chatHub = $.connection.requestlog;
        this.loadClient(chatHub);

        $.connection.hub.start().done(function () {
            //chatHub.server.connect(this.roomId);
            $("#btnLogin").click(function (e) {
                var name = $('#txtName').val();
                chatHub.server.connect(app.roomId, name);
                $('#bodyLogin').remove();
                $('#bodyChessBoard').show();
                app.mem.push(app.getChessBoard());
                e.preventDefault();
            });

            $('#btnSend').click(function (e) {
                var msg = $('#txtMessage').val();
                chatHub.server.message(app.roomId, app.namePlayer, msg);
                $('#txtMessage').val('').focus();
                e.preventDefault();
            });

            //Undo redo
            $('#btnUndo').click(function (e) {
                axios.post('/api/chess/undo', {
                    group: app.roomId
                });
            });

            $('#btnRedo').click(function (e) {
                axios.post('/api/chess/redo', {
                    group: app.roomId
                });
            });
        });
        chatHub.client.postToClient = function (group, name, data) {
            if (name == "::undo") {
                app.undoMove();
            } else if (name == "::redo") {
                app.redoMove();
            } else {
                //$('#contentMsg').append("<li><strong>" + name + "</strong>: " + data + "</li>");
                var result = [];
                result = JSON.parse(data);
                if (result[0].visible == true) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id.indexOf("do") >= 0) {
                            app.player = false;
                        } else {
                            app.player = true;
                        }
                        var node = $("#" + result[i].id);
                        var startTop = parseInt(node.css('top'), 10);
                        var startLeft = parseInt(node.css('left'), 10);
                        node.css({ 'top': result[i].top + 'px' });
                        node.css({ 'left': result[i].left + 'px' });
                        node.css({ 'display': result[i].visible });
                        app.getIndex(startLeft, startTop, "start");
                        app.$set(app.chessMatrix[app.indexStartI][app.indexStartJ], "id", "");

                        app.getIndex(result[i].left, result[i].top, "stop");
                        app.$set(app.chessMatrix[app.indexStopI][app.indexStopJ], "id", result[i].id);

                        app.initPrintMatrix();
                        app.saveMove();
                        //node.css({ 'top': result[i].top + 'px, left: ' + result[i].left + 'px, display:' + result[i].visible });
                        break;
                    }
                } else {
                    $("#" + result[0].id).remove();
                }
            }
        };
        this.getchessNode();
    }
})