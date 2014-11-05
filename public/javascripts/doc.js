app.doc = function () {
    $('.create.tool').on('click', function () {
        $(".modal").addClass("scale");
        $('#doc-inT-title').val("");
        $("#doc-inT-content").val("");
    });
    $(".close").on('click', function () {
        $(".modal").removeClass("scale");
        $(".modal").addClass("rescale");
        setTimeout(function () {
            $(".modal").removeClass("rescale")
        }, 500);
        window.location.hash = "";
    });

    $(".createContent").on('submit', function (e) {
        e.preventDefault();
        app.websocket.sendMsg('doc message', {
            msg: {
                title: $('#doc-inT-title').val(),
                content: $("#doc-inT-content").val()
            },
            id: socket.io.engine.id, //每次都把id发过去，类似cookie的做法，这样可以服务器可以broadcast这个id，当我检测到这个id是我的时候，就可以区分身份了。
            avatar: app.websocket.getAvatar
        });
        $(".modal").removeClass("scale");
        $(".modal").addClass("rescale");
        setTimeout(function () {
            $(".modal").removeClass("rescale")
        }, 500);

        $('#doc-inT-title').val("");
        $("#doc-inT-content").val("");
    });
}