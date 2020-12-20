// 四种彩蛋图比例 1:2:3:4
var imgs = [
  // 10%
  "4-圣蛋礼物.png",
  // 20%
  "2-把好玩的游戏给我.png",
  "2-把好玩的游戏给我.png",
  // 30%
  "5-叮叮当.png",
  "5-叮叮当.png",
  "5-叮叮当.png",
  // 40%
  "1-我是圣蛋.png",
  "1-我是圣蛋.png",
  "1-我是圣蛋.png",
  "1-我是圣蛋.png",
];
// 画图专用彩蛋   .puffIn
var imgPic = "3-达芬奇世界.png";
// 出现随机彩蛋
function getImage(rndNum) {
  var classStyle = "";
  if ([0].indexOf(rndNum) > -1) {
    classStyle = "foolishIn";
  }
  if ([1, 2].indexOf(rndNum) > -1) {
    classStyle = "spaceInUp";
  }
  if ([3, 4, 5].indexOf(rndNum) > -1) {
    classStyle = "bounceBox";
  }
  if ([6, 7, 8, 9].indexOf(rndNum) > -1) {
    classStyle = "bounceJump";
  }
  // console.log(rndNum,classStyle)
  var imgValue = imgHtml(classStyle, imgs[rndNum]);
  $("body").append(imgValue);
}

// 动态加载DOM
function imgHtml(classStyle, img) {
  var htmlVal =
    '<div id="paintedImg">' +
    '<span class="close-span"></span>' +
    '<img class="' +
    classStyle +
    '" src="/forum/plugins/nodebb-plugin-christmas-niuniu/static/images/' +
    //   '" src="/forum/plugins/nodebb-plugin-christmas-niuniu/static/images/' +
    img +
    '" alt="img">' +
    "</div>";
  return htmlVal;
}

// 删除动态DOM
function delPaintedImg() {
  $("#paintedImg").remove();
}

// 10以内的随机数字。
function RndNum(n) {
  var rnd = "";
  for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
  return rnd;
}

$("document").ready(function () {
  //   $(window).on("action:ajaxify.end", function (event, data) {
  //     console.log(data, ajaxify.data); // to inspect what is passed back by NodeBB
  //   });
  $(document).on("click", ".close-span", function () {
    $(".close-span").parent().remove();
  });

  $(document).on("click", ".composer-submit", function () {
    let num = RndNum(1);
    console.log("submitted!", num);
    console.log(socket);
  });

  function post(num) {
    socket.emit(
      "plugins.Christmas.post",
      { sid: socket.id, num, uid: app.user.uid },
      function (err, data) {
        if (err) {
          return app.alertError(err);
        }
        console.log(" this client socket data", data);
        app.alertSuccess("post success");
        delPaintedImg();
        getImage(num);
        //  ajaxify.refresh();
      }
    );
  }

  socket.on("christmas:gift", (data) => {
    if (data.num >= 0 && data.num < 10) {
      delPaintedImg();
      getImage(data.num);
    } else if (data.num === 100) {
      delPaintedImg();
      var imgValue = imgHtml("puffIn", imgPic);
      $("body").append(imgValue);
    } else if (data.num === 101) {
      app.alertSuccess(
        "恭喜，你已经集齐所有贺卡！赶紧找运营小姐姐兑换礼品叭！"
      );
    } else if (data.num === 101) {
      return;
    }
  });
});
