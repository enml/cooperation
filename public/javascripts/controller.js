 //全局变量
 var app = {},
     img = new Image(),
     noticeNum = 0,
     docData = {},
     socket = io(); //必须在socket.io脚本加载完后才能执行

 //绑定navbar的事件
 $("#navbar").on({
         /*  'mouseover': function (e) {
                e.target.classList.add("mouseover");
            },
            'mouseout': function (e) {
                e.target.classList.remove("mouseover");
            },*/
         'click': function (e) {
             targetObj = $("#" + e.target.id);
             /*为活动标签添加active样式*/
             while ($(".active")[0]) {
                 $(".active").removeClass("active");
             };
             e.target.classList.add("active");
             /*添加动画*/
             $("#container").addClass("bounce");
             setTimeout(function () {
                 $("#container").removeClass("bounce");
             }, 500);
             /*把活动层置顶*/
             while ($(".topLayer")[0]) {
                 $(".topLayer").removeClass("topLayer");
             }


             /*标签被点击则清除相应的notice*/
             app.websocket.clearNotice($("#" + targetObj.data("notice")));
         }
     },
     '#photo,#todo,#document').on('click', '#photo', function (e) {
     app.show.showPhoContent();

 }).on('click', '#todo', function () {
     app.show.showTodoContent();
 }).on('click', '#document', function () {
     app.show.showDocContent();
 }).on('click', '#chat', function () {
     if ($(".chatBox").hasClass("bounce")) {
         $(".chatBox").removeClass("bounce");
     } else {
         $(".chatBox").addClass("bounce");
         app.websocket.clearNotice($("#chatNotice"))
     }
 })


 app.show = (function () {
     function showPhoContent() {
         if (!$(".phoContent").length) {
             $("#container").append(app.templates.temPhoto());
             setTimeout(function () {
                 app.canvasResult = app.canvas();
                 app.dropFile();
                 app.canvasResult.resizeCanvas();
                 $(window).resize(app.canvasResult.resizeCanvas);
                 $("#filterBtnList").on('click', '#gray,#invert,#adjust,#blur,#relief,#kediao,#mirror,#reset', app.canvasResult.callFilter);
                 $("#canvas")[0].ondragstart = function (e) {
                     var dragImg = document.createElement("img");
                     dragImg.src = "images/dragPho.png"
                     e.dataTransfer.setDragImage(dragImg, 100, 100);
                 }
             }, 50) //注意app.canvasResult=app.canvas()这一句，只有这样才能把return的结果放到app里面，直接app.canvas()是没用的
         };
         $("." + targetObj.data("content")).addClass("topLayer"); //*通过nav的data.name找到相对应的wrap，给它添加topLayer*/

     };

     function showTodoContent() {
         if (!$(".todoContent").length) {
             $("#container").append(app.templates.temTodo());
         };
         $("." + targetObj.data("content")).addClass("topLayer"); //*通过nav的data.name找到相对应的wrap，给它添加topLayer*/
         $('#calendar').fullCalendar({
             header: {
                 left: 'prev,next today',
                 center: 'title',
                 right: 'month,agendaWeek,agendaDay'
             },
             //             defaultDate: '2014-09-12',
             selectable: true,
             selectHelper: true,
             select: function (start, end) {
                 var title = prompt('Event Title:');
                 var eventData;
                 if (title) {
                     eventData = {
                         title: title,
                         start: start,
                         end: end
                     };
                     $(".todoWillList").append('<li class="clearfix g"><div class="checkBox"></div><span id="g" class="fa fa-check" style="margin-left: -27px;margin-right: 10px;opacity:0;"></span>' + eventData["title"] + '</li>')
                     //                     $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                 }
                 $('#calendar').fullCalendar('unselect');
             },
             editable: true,
             eventLimit: true, // allow "more" link when too many events
             events: [
                 {
                     title: 'All Day Event',
                     start: '2014-09-01'
    }
   ]
         });
         $(".todoWillList").on('click', '#g', function (e) {
             if (this.style.opacity == '0') {
                 this.style.opacity = 1;
                 setTimeout(function(){
                 },2000)
             } else {
                 this.style.opacity = 0;
             }
             
         });
     };

     function showDocContent() {
         if (!$(".docContent").length) {
             $("#container").append(app.templates.temDocument());
             $("body").append(app.templates.temCreateBox());
             $("#timeline .news").prepend(app.templates.temUserAvatar());
             app.doc();
         };

         $("." + targetObj.data("content")).addClass("topLayer"); //*通过nav的data.name找到相对应的wrap，给它添加topLayer*/
     };

     function showDocDetail(titleVal, contentVal) {
         $('#doc-inT-title').val(titleVal);
         $('#doc-inT-content').val(contentVal);
         $(".modal").addClass("scale");
     };
     return {
         showPhoContent: showPhoContent,
         showTodoContent: showTodoContent,
         showDocContent: showDocContent,
         showDocDetail: showDocDetail
     }
 })();

 function myRoute() {
     var page = window.location.hash;
     if (page) {
         page = page.substring(1);
         if (parseInt(page, 10) > 0) {
             app.show.showDocDetail(docData[page]["title"], docData[page]["content"]);
         } else {
             pageNotFound();
         }
     } else {

     }
 }
 /******************************socket*********************************/

 app.websocket = (function () {
     /*get 随机头像*/
     function getAvatar() {
         return 'images/' + parseInt(Math.random() * 10) + '.png';
     }

     /*验证身份*/
     function auth(userData) {
         if (userData["id"] === socket.io.engine.id) {
             userData["userName"] = 'me';
         } else {
             userData["userName"] = 'other';
         }
         return userData;
     }

     /*websocket发送数据*/
     function sendMsg(name, msgObj) {
         socket.emit(name, msgObj);
     };

     /*消息提示*/
     function ifNotice(o, e, atrr) {
         if (!o.hasClass(atrr)) {
             noticeNum += 1;
             e.html(app.templates.temNotice(noticeNum));
         } else {
             noticeNum = 0;
             e.html("");
         }
     };

     function clearNotice(ele) {
         ele.html("");
     }

     return {
         sendMsg: sendMsg,
         getAvatar: getAvatar(), //确保初始化的时候生成头像id
         auth: auth,
         ifNotice: ifNotice,
         clearNotice: clearNotice
     }
 })();

 function delay() {
     $(".user").html(app.templates.temUserAvatar());
     //头像初始完后发送给服务器保存验证，以防止头像重复
     socket.on("connect", function () {
         //         app.websocket.sendMsg("avatar", app.websocket.getAvatar);
     });

     socket.on('disconnect', function () {
         $(".warning").html(app.templates.temWarningText("warning", "噢，掉线了")).css("color", "#e66").addClass("bounce").fadeIn();
         setTimeout(function () {
             $(".warning").removeClass("bounce")
         }, 500);
     });

     socket.on('reconnect', function () {
         $(".warning").html(app.templates.temWarningText("check", "网络可以用了")).css("color", "#3fb16f").addClass("bounce").fadeIn().fadeOut(5000);
         setTimeout(function () {
             $(".warning").removeClass("bounce")
         }, 500);
     });
     $(window).bind("hashchange", myRoute);


 }