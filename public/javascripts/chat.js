app.chat = (function () {
    $("body").append(app.templates.temChatBox());
    $("#reback").on('click', function () {
        $(".chatBox").removeClass("bounce");
    });

    $('.form').submit(function (e) {
        e.preventDefault();
        if (!$('#inT').val() || $('#inT').val() == " ") {
            return;
        }
        //        socket.emit('chat message', {message:$('#inT').val(),id:window.localStorage["id"]});//自定义id，每次都传给服务器，通过内置的socket.io.engine.id可以实现相同的功能
        app.websocket.sendMsg('chat message', {
            msg: $('#inT').val(),
            id: socket.io.engine.id, //每次都把id发过去，类似cookie的做法，这样可以服务器可以broadcast这个id，当我检测到这个id是我的时候，就可以区分身份了。
            avatar: app.websocket.getAvatar
        });
        $('#inT').val(''); //clear the input value
        $("#inT").select();
        return false;
    });

    $('#inFile').on('change', function (e) {
        var file = e.target.files[0];
        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
            var reader = new FileReader();
            reader.onload = function (ev) {
                app.websocket.sendMsg('image data', {
                    "msg": ev.target.result,
                    "id": socket.io.engine.id,
                    "avatar": app.websocket.getAvatar
                });
            }
            reader.readAsDataURL(file);
        }
    });

    socket.on('chat message', function (userData) {
        /*notice*/
        app.websocket.ifNotice($(".chatBox"), $("#chatNotice"), "bounce");
        /*验证身份*/
        userData = app.websocket.auth(userData);

        $('#messages').append($('<li>').html('<div class="clearfix ' + userData["userName"] + '"><img class="avatar" src="' + userData["avatar"] + '"><div class="chatText">' + userData["msg"] + '</div><div class="chatTime">' + userData["time"] + '</div></div>'));
        $('#messages').scrollTop($("#messages").prop("scrollHeight")); //滚动至底部
    });



    socket.on('image data', function (userData) {
        /*notice*/
        app.websocket.ifNotice($(".chatBox"), $("#chatNotice"), "bounce");
        /*验证身份*/
        userData = app.websocket.auth(userData);

        $('#messages').append($("<li>").html('<div class="clearfix ' + userData["userName"] + '"><img class="avatar" src="' + userData["avatar"] + '"><img src="' + userData["msg"] + '">'));
        $('#messages').scrollTop($("#messages").prop("scrollHeight")); //滚动至底部
    });


    socket.on('cv', function (cvData) {
        var img = new Image();
        app.websocket.ifNotice($(".phoContent"), $("#phoNotice"), "topLayer");
        img.src = cvData["cvShareData"];
        userData = app.websocket.auth(cvData);
        if (userData["userName"] == "other") {
            $("#shareDrag").addClass("act");
            $("#shareDrag")[0].ondragend = function () {
                app.canvasResult.drawImage(img);
                $("#shareDrag").removeClass("act")
            }
        }
    })

    socket.on('doc message', function (userData) {
        /*notice*/
        app.websocket.ifNotice($(".docContent"), $("#docNotice"), "topLayer");
        /*验证身份*/
        userData = app.websocket.auth(userData);
        /*缓存数据*/
        docData[userData["time"]["num"]] = {
            "modTime": userData["time"]["time"],
            "title": userData["msg"]["title"],
            "content": userData["msg"]["content"]
        };

        $(".article").prepend('<ul class="createFileList"><li class="fileName"><a href="#' + userData["time"]["num"] + '">' + userData["msg"]["title"] + '</a></li><li class="modTime">' + userData["time"]["time"] + '</li><li class="modUser">' + userData["id"] + '</li></ul>');
        $("#timeline").prepend('<div class="news"><img class="avatar" src="' + userData["avatar"] + '"><span>分享了一篇文章</span><a href="#' + userData["time"]["num"] + '">' + userData["msg"]["title"] + '</a><span class="chatTime">2014-10-10</span></div>')
    });
    
})();