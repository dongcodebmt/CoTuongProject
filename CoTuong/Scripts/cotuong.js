﻿var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue! 112',
        total: 0,
        students: [],
        classRoom: '',
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
        getTotal() {
            axios
                .get('/api/Student/getbyId?Id=1')
                .then(response => {
                    this.total = response.data.total;
                    this.students = response.data.data;
                    console.log(this.students);
                })
                .catch(error => {
                    console.log(error)
                })
                .finally()
        },
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
                //console.log();
                //console.log(strMatrix);
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
            if (stopI == startI && stopJ > startJ) {
                for (let i = startJ + 1; i < stopJ; i++) {
                    if (app.chessMatrix[stopI][i].id)
                        return 1;
                }
            }
            if (stopI == startI && stopJ < startJ) {
                for (let i = stopJ + 1; i < startJ; i++) {
                    if (app.chessMatrix[stopI][i].id)
                        return 1;
                }
            }
            if (stopJ == startJ && stopI > startI) {
                for (let i = startI + 1; i < stopI; i++) {
                    if (app.chessMatrix[i][stopJ].id)
                        return 1;
                }
            }
            if (stopJ == startJ && stopI < startI) {
                for (let i = stopI + 1; i < startI; i++) {
                    if (app.chessMatrix[i][stopJ].id)
                        return 1;
                }
            }
            return 0;
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
        anQuanCo(id) {
            var movelist = [{ id: id, top: 999, left: 999, visible: false }];
            var res = axios.post('/api/chess/movenode', movelist).then(response => {
                //this.chessRoom = response.data.data;
                //alert(response);

            })
                .catch(error => {
                    console.log(error)
                })
                .finally();
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
        insertClassRoom() {
            var payload = { Name: this.classRoom };
            var res = axios.post('/api/ClassRoom/insertClassRoom', payload);
            console.log(res.data);
        },
        getchessNode() {
            var res = axios.post('/api/chess/getchessnode').then(response => {
                this.chessNode = response.data.chessnode;
                this.chessMatrix = response.data.matrix;
                this.initMatrix();
                for (var i = 0; i < this.chessNode.length; i++) {
                    this.setChessNodeToMatrix(this.chessNode[i]);
                }
                this.initPrintMatrix();
                //this.chessRoom = response.data.data;

            })
                .catch(error => {
                    console.log(error)
                })
                .finally();
        },
        revert(left, top, id) {
            var node = $("#" + id);
            node.css({ 'top': top + 'px' });
            node.css({ 'left': left + 'px' });
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
        }
    },
    updated: function () {
        var originaltop = 0;
        var originalleft = 0;
        $(".chessnode").draggable({
            start: function (event, ui) {
                originaltop = ui.position.top;
                originalleft = ui.position.left;
            },
            drag: function () {

            },
            stop: function (event, ui) {
                //console.log('x=' + ui.position.top + '  y=' + ui.position.left);

                app.indexStopI = -1;
                app.indexStopJ = -1;
                app.getIndex(ui.position.left, ui.position.top, "stop");
                var movelist = [{ id: this.id, top: app.chessMatrix[app.indexStopI][app.indexStopJ].top, left: app.chessMatrix[app.indexStopI][app.indexStopJ].left, visible: true }];

                if (app.indexStopI != -1 && app.indexStopJ != -1) {

                    app.getIndex(originalleft, originaltop, "start");
                    var flag = false;
                    //Tướng
                    if (this.id.indexOf("chutuongdo") >= 0) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 0 && Math.abs(app.indexStopJ - app.indexStartJ) == 1) ||
                            (Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 0))
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 0 && app.indexStopI <= 2) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("chutuongden") >= 0) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 0 && Math.abs(app.indexStopJ - app.indexStartJ) == 1) ||
                            (Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 0))
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 7 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Sĩ
                    if (this.id.indexOf("sido1") >= 0 || this.id.indexOf("sido2") >= 0) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 1 && Math.abs(app.indexStartJ - app.indexStopJ) == 1)
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 0 && app.indexStopI <= 2) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("siden1") >= 0 || this.id.indexOf("siden2") >= 0) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 1 && Math.abs(app.indexStartJ - app.indexStopJ) == 1)
                            && (app.indexStopJ >= 3 && app.indexStopJ <= 5 && app.indexStopI >= 7 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //tượng
                    if (this.id.indexOf("tuongdo1") >= 0 || this.id.indexOf("tuongdo2") >= 0) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 2 && Math.abs(app.indexStartJ - app.indexStopJ) == 2) &&
                            app.kiemTraDuongCheo(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 4) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("tuongden1") >= 0 || this.id.indexOf("tuongden2") >= 0) {
                        if ((Math.abs(app.indexStartI - app.indexStopI) == 2 && Math.abs(app.indexStartJ - app.indexStopJ) == 2) &&
                            app.kiemTraDuongCheo(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 5 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Xe
                    if (this.id.indexOf("xedo1") >= 0 || this.id.indexOf("xedo2") >= 0 || this.id.indexOf("xeden1") >= 0 || this.id.indexOf("xeden2") >= 0) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Mã
                    if (this.id.indexOf("mado1") >= 0 || this.id.indexOf("mado2") >= 0) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 2) || (Math.abs(app.indexStopI - app.indexStartI) == 2 && Math.abs(app.indexStopJ - app.indexStartJ) == 1)) &&
                            app.kiemTraDuongDiQuanMa(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("maden1") >= 0 || this.id.indexOf("maden2") >= 0) {
                        if (((Math.abs(app.indexStopI - app.indexStartI) == 1 && Math.abs(app.indexStopJ - app.indexStartJ) == 2) || (Math.abs(app.indexStopI - app.indexStartI) == 2 && Math.abs(app.indexStopJ - app.indexStartJ) == 1)) &&
                            app.kiemTraDuongDiQuanMa(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Pháo
                    if (this.id.indexOf("phaodo1") >= 0 || this.id.indexOf("phaodo2") >= 0 || this.id.indexOf("phaoden1") >= 0 || this.id.indexOf("phaoden2") >= 0) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            app.kiemTraDuongThang(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ) == 0 &&
                            (app.indexStopJ >= 0 && app.indexStopJ <= 8 && app.indexStopI >= 0 && app.indexStopI <= 9) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    //Tốt
                    if (this.id.indexOf("totdo1") >= 0 || this.id.indexOf("totdo2") >= 0 || this.id.indexOf("totdo3") >= 0 || this.id.indexOf("totdo4") >= 0 || this.id.indexOf("totdo5") >= 0) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            ((app.indexStartJ == app.indexStopJ && app.indexStopI - app.indexStartI == 1 && app.indexStopI >= 3 && app.indexStopI <= 4) ||
                                ((app.indexStopI - app.indexStartI == 1 || Math.abs(app.indexStopJ - app.indexStartJ) == 1) && app.indexStopI >= 5 && app.indexStopI <= 9)) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }
                    if (this.id.indexOf("totden1") >= 0 || this.id.indexOf("totden2") >= 0 || this.id.indexOf("totden3") >= 0 || this.id.indexOf("totden4") >= 0 || this.id.indexOf("totden5") >= 0) {
                        if ((app.indexStartI == app.indexStopI || app.indexStartJ == app.indexStopJ) &&
                            ((app.indexStartJ == app.indexStopJ && app.indexStopI - app.indexStartI == -1 && app.indexStopI >= 5 && app.indexStopI <= 6) ||
                                ((app.indexStopI - app.indexStartI == -1 || Math.abs(app.indexStopJ - app.indexStartJ) == 1) && app.indexStopI >= 0 && app.indexStopI <= 4)) &&
                            app.hasChessNode(app.chessMatrix[app.indexStopI][app.indexStopJ].left, app.chessMatrix[app.indexStopI][app.indexStopJ].top, app.chessMatrix[app.indexStartI][app.indexStartJ].id) != 1) {

                            flag = app.xuLyNuocDi(app.indexStopI, app.indexStartI, app.indexStopJ, app.indexStartJ, this.id);
                        }
                    }

                    console.log(app.indexStopI + "_" + app.indexStartI + "_" + app.indexStopJ + "_" + app.indexStartJ);

                    if (flag == true) {

                        var res = axios.post('/api/chess/movenode', movelist).then(response => {
                            //this.chessRoom = response.data.data;
                            //alert(response);

                        })
                            .catch(error => {
                                console.log(error)
                            })
                            .finally();
                    }
                    else
                        app.revert(originalleft, originaltop, this.id);
                }
                else {
                    app.revert(originalleft, originaltop, this.id);
                }


            }
        });
    },
    mounted: function () {
        var chat = $.connection.requestlog;
        $.connection.hub.start().done(function () {

        });
        chat.client.postToClient = function (data) {
            $('#discussion').append('<div class="container"><p>Message' + data + '</p></div>');

            var result = [];
            result = JSON.parse(data);
            for (var i = 0; i < result.length; i++) {
                var node = $("#" + result[i].id);
                var startTop = parseInt(node.css('top'), 10);
                var startLeft = parseInt(node.css('left'), 10);
                var hide = result[i].visible;
                if (hide == false) {
                    node.hide();
                } else {
                    node.css({ 'top': result[i].top + 'px' });
                    node.css({ 'left': result[i].left + 'px' });
                    node.css({ 'display': result[i].visible });
                    app.getIndex(startLeft, startTop, "start");
                    app.$set(app.chessMatrix[app.indexStartI][app.indexStartJ], "id", "");

                    app.getIndex(result[i].left, result[i].top, "stop");
                    app.$set(app.chessMatrix[app.indexStopI][app.indexStopJ], "id", result[i].id);

                    app.initPrintMatrix();
                }
                //node.css({ 'top': result[i].top + 'px, left: ' + result[i].left + 'px, display:' + result[i].visible });
                break;
            }
        };
        this.getchessNode();
    }
})