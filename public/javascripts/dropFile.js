app.dropFile = function () {
    var filesUpload = document.getElementById("files-upload"),
        dropArea = document.getElementById("drop-area"),
        fileList = document.getElementById("file-list"),
        shareDrag = document.getElementById("shareDrag"),
        shareDrop = document.getElementById("shareDrop");
    /*    $("#aside").on({
        'mouseover': function (e) {
            e.target.classList.add("mouseover");
        },
        'mouseout':function(e){
            e.target.classList.remove("mouseover");
        }
    }, '.input');
    */
    $("#share").on("click", function () {
        var cvShareData = app.canvasResult.toDataURL();
        app.websocket.sendMsg('cv', {
            cvShareData: cvShareData,
            id: socket.io.engine.id
        })
        $(".warning").html(app.templates.temWarningText("check", "已发送")).css("color", "#3fb16f").addClass("bounce").fadeIn().fadeOut(2500);
        setTimeout(function () {
            $(".warning").removeClass("bounce")
        }, 500);
    })

    $(document).on({
        dragleave: function (e) {
            e.preventDefault();
            e.stopPropagation();
        },
        dragenter: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        dragover: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        drop: function (e) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

    function showFile(file) {
        var li = document.createElement("li"),
            //                    div = document.createElement("div"),
            reader,
            //                    progressBarContainer = document.createElement("div"),
            //                    progressBar = document.createElement("div"),
            //                    xhr,
            fileInfo;


        /*                progressBarContainer.className = "progress-bar-container";
                progressBar.className = "progress-bar";
                progressBarContainer.appendChild(progressBar);
                li.appendChild(progressBarContainer);*/



        /*             // Uploading - for Firefox, Google Chrome and Safari
                xhr = new XMLHttpRequest();

                // Update progress bar
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
                    } else {
                        // No data to calculate on
                    }
                }, false);

                // File uploaded
                xhr.addEventListener("load", function () {
                    progressBarContainer.className += " uploaded";
                    progressBar.innerHTML = "Loaded!";
                }, false);

                xhr.open("post", "upload/upload.php", true);

                // Set appropriate headers
                xhr.setRequestHeader("Content-Type", "multipart/form-data");
                xhr.setRequestHeader("X-File-Name", file.fileName);
                xhr.setRequestHeader("X-File-Size", file.fileSize);
                xhr.setRequestHeader("X-File-Type", file.type);


                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                            alert(xhr.responseText);
                            xhr = null;
                        }
                    }
                }
 
                // Send the file (doh)
                if ("getAsBinary" in file) {
                    //FF 3.5+
                    xhr.sendAsBinary(file.getAsBinary());
                } else {
                    xhr.send(file);
                }*/
        /*
                   If the file is an image and the web browser supports FileReader,
                   present a preview in the file list
               */

        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
            reader = new FileReader();
            reader.onload = (function (theImg) {
                return function (evt) {
                    theImg.src = evt.target.result;
                };
            }(img));
            reader.readAsDataURL(file);
//                        fileList.prepend(img);
            img.onload = function () {
                app.canvasResult.start(this)
            }
        }

        // Present file info and append it to the list of files
        fileInfo = "<p> <strong>" + file.name + " </strong><span>( " + parseInt(file.size / 1024, 10) + " kb/ " + file.type + ")</span></p>";
        li.innerHTML = fileInfo;
        fileList.appendChild(li);
    }
    //check uploaded files
    function traverseFiles(files) {
        if (typeof files !== "undefined") {
            for (var i = 0, l = files.length; i < l; i++) {
                showFile(files[i]);
            }
        } else {
            fileList.innerHTML = "No support for the File API in this web browser";
        }
    }
    //handle the input event
    filesUpload.addEventListener("change", function () {
        traverseFiles(this.files);
    }, false);
    //handle the dropArea box event
    dropArea.addEventListener("dragleave", function (evt) {
        var target = evt.target;

        if (target && target === dropArea) {
            this.className = "";
        }
        evt.preventDefault();
        evt.stopPropagation();
    }, false);

    dropArea.addEventListener("dragenter", function (evt) {
        this.className = "over";
        evt.preventDefault();
        evt.stopPropagation();
    }, false);

    dropArea.addEventListener("dragover", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }, false);

    dropArea.addEventListener("drop", function (evt) {
        traverseFiles(evt.dataTransfer.files);
        this.className = "";
        evt.preventDefault();
        evt.stopPropagation();
    }, false);

    /*绑定边栏drag and drop事件*/
    shareDrag.addEventListener('dragstart', function (e) {
        var dragImg = document.createElement("img");
        dragImg.src = "images/dragPho.png"
        e.dataTransfer.setDragImage(dragImg, 100, 100);
    });
    shareDrop.addEventListener('dragenter', function (evt) {
        this.classList.add("over");
        evt.preventDefault();
        evt.stopPropagation();
    });
    shareDrop.addEventListener('dragleave', function (evt) {
        this.classList.remove("over");
        evt.preventDefault();
        evt.stopPropagation();
    });
    shareDrop.addEventListener('drop', function (evt) {
        this.classList.remove("over");
        evt.preventDefault();
        evt.stopPropagation();
        var cvShareData = app.canvasResult.toDataURL();
        app.websocket.sendMsg('cv', {
            cvShareData: cvShareData,
            id: socket.io.engine.id
        });
        $(".warning").html(app.templates.temWarningText("check", "已发送")).css("color", "#3fb16f").addClass("bounce").fadeIn().fadeOut(2500);
        setTimeout(function () {
            $(".warning").removeClass("bounce")
        }, 500);
    });

}