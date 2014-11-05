app.templates = (function () {



    function temPhoto() {
        return '<div class="wrap phoContent"><div class="share" id="shareDrag" draggable="true"></div><div class="share" id="shareDrop"></div><aside id="aside"><div class="vline gradient-top"></div><div class="vline gradient-main"></div><div class="vline gradient-down"></div><div id = "drop-area" ><span class = "drop-instructions" > 将文件拖拽到这里 </span> <span class="drop-over">Drop files here!</span ></div><div class = "input" ><a class = "fa fa-folder-open-o" href = "javascript:;" > 上传 </a><input id="files-upload" type="file" multiple accept="*.*" name="file"></div ><div class = "input" id="share"><a class = "fa fa-cloud-upload" href = "javascript:;" > 分享</a></div ><ul id="file-list"><header>已添加文件：</header ></ul></aside><section id="showDetail"><canvas id="canvas" width="700" height="500" draggable="true">您的浏览器不支持canvas</canvas><div id="filterBtnList"><button data-name="grayColor" id="gray">灰白</button><button data-name="invertColor" id="invert">反色</button><button data-name="adjustColor" id="adjust">复古</button><button data-name="blurImage" id="blur">虚化</button><button data-name="reliefImage" id="relief">浮雕</button><button data-name="kediaoImage" id="kediao">刻雕</button><button data-name="mirrorImage" id="mirror">反转</button><button data-name="resetImage" id="reset">复原</button></div></section></div>'
    };

    function temTodo() {
        return '<div class="wrap todoContent"><aside id="aside"><div class="vline gradient-top"></div><div class="vline gradient-main"></div><div class="vline gradient-down"></div><div class="todoList"><div class="todoWill"><header><span class="fa fa-clock-o" style="margin-right:10px;"></span>未来的任务:</header><ul class="todoWillList"></ul></div><div class="todoDone"><header><span class="fa fa-check-square" style="margin-right:10px;"></span>已完成的任务:</header><ul class="todoDoneList"></ul></div></div></aside><section id="showDetail"><div id="calendar"></div></section></div>'
    };

    function temDocument() {
        return '<div class="wrap docContent"><aside id="aside"><div class="vline gradient-top"></div><div class="vline gradient-main"></div><div class="vline gradient-down"></div><div id="timeline"><div class="news"><span>user1分享了一篇文章</span><span class="chatTime">2014-10-10</span></div><div class="news"><span>user1修改了一篇文章</span><span class="chatTime">2014-10-18</span></div></div></aside><section id="showDetail"><div class="toolbar clearfix"><div class="create tool"><i class="fa fa-plus"></i><span>新建</span></div><div class="upload tool"><i class="fa fa-cloud-upload"></i><span>上传</span></div><div class="tags tool"><i class="fa fa-tags"></i><span>标签</span></div></div><ul class="createFileList"><li class="fileName">文件名</li><li class="modTime">修改时间</li><li class="modUser">修改人</li></ul><div class="article"></div></section></div>'
    };

    function temCreateBox() {
        return '<div class="modal"><form action="" class="createContent"><a class="fa fa-times right close"></a><input type="text" placeholder="标题..." autocomplete="off" id="doc-inT-title"><textarea placeholder="分享点什么..." class="contentEdit" id="doc-inT-content"></textarea><div class="submitBar"><button class="right">完成</button></div></form></div>'
    };

    function temChatBox() {
        return '<div class="chatBox"><span class="fa fa-angle-up" id="reback"></span><ul id="messages" class="clearfix"></ul><form action="" class="form"><input id="inT" autocomplete="off" type="text" placeholder="请输入聊天内容..."><div id="sendImg"><span class="fa fa-image over"></span><input id="inFile" type="file"></div><button>发送</button></form></div>'
    };

    function temWarningText(type, text) {
        return '<div class="warningText"><span class="fa fa-' + type + '"></span>' + text + '</div>';
    };

    function temNotice(num) {
        return '<span class="noticeText">' + num + '</span>';
    };

    function temUserAvatar() {
        return '<img class="avatar" src="' + app.websocket.getAvatar + '">';
    }

    //    functiontem

    return {
        temPhoto: temPhoto,
        temTodo: temTodo,
        temDocument: temDocument,
        temCreateBox: temCreateBox,
        temWarningText: temWarningText,
        temChatBox: temChatBox,
        temNotice: temNotice,
        temUserAvatar: temUserAvatar
    }

})();
setTimeout(delay(), 10);