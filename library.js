var plugin = {},
  // async = require.main.require('async'),
  user = require.main.require("./src/user"),
  SocketPlugins = require.main.require("./src/socket.io/plugins");
const Sockets = require.main.require("./src/socket.io/");

let eggWords = [
  "达芬奇",
  "快乐",
  "一起做好玩的游戏",
  "莉莉丝",
  "礼物",
  "牛魔王",
  "喵莉丝",
  "雪花",
  "心心",
  "林克",
  "村长",
  "王师傅",
];

function broadcast(uid, data) {
  Sockets.server.to("uid_" + uid).emit("christmas:gift", data);
}

function handleSocketIO() {
  // console.log('Avatar info', `essence handleSocketIO`);

  SocketPlugins.Christmas = {};
  SocketPlugins.Christmas.upvote = async function (socket, data) {
    console.log(" upvote christmas");
  };

  SocketPlugins.Christmas.post = async function (socket, data) {
    console.log(
      " post christmas",
      "  0 0 0 0 0 - - - - -",
      data,
      socket.id,
      socket.uid,
      "- - -this is socket"
    );
    broadcast(socket.uid, data);
  };
}

async function renderChristmas(req, res) {
  res.render("christmas", {});
}

plugin.init = async function (params) {
  console.log("Avatar info", `christmas init`);
  var app = params.router,
    middleware = params.middleware;

  app.get("/christmas", middleware.buildHeader, renderChristmas);
  // app.get('/api/essence', renderEssenced);
  app.get("/api/christmas", renderChristmas);

  handleSocketIO();
};

plugin.getTopics = async function (hookData) {
  

  for(let topic of hookData.topics) {
    let uid = topic.uid;
    let gift = await user.getUserField(uid, 'christmas:gift');
    console.log('topic,', uid, gift);
    if(!!gift && gift.length === 5) {
      topic.christmas = '<span class="headImg"></span>';
    }
  }
  console.log("Avatar info", `christmas getTopics`, hookData);

  return hookData;
};

plugin.postChristmas = async function (data) {
  console.log(data, "- - -  postChristmas data");
  let uid = data.post.uid;

  let num = Math.floor(Math.random() * 10);
  let type;
  let content = data.post.content;
  if (new RegExp(eggWords.join("|")).test(content)) {
    type = 4;
    num = 100;
  } else if ([0].indexOf(num) > -1) {
    type = 0;
  } else if ([1, 2].indexOf(num) > -1) {
    type = 1;
  } else if ([3, 4, 5].indexOf(num) > -1) {
    type = 2;
  } else if ([6, 7, 8, 9].indexOf(num) > -1) {
    type = 3;
  }

  let gift = await user.getUserField(uid, "christmas:gift");

  if (!gift) {
    gift = [];
    gift.push(type);
  } else if (gift.length && gift.length < 5) {
    gift.push(type);
  }else if (gift.length === 5) {
    return broadcast(uid, { num: 101 });
  }
  let newGift = [...new Set(gift)];
  console.log(num, gift, newGift);
  await user.setUserFields(uid, { "christmas:gift": newGift });
  if (newGift.length === 5) {
    let gifted = await user.getUserField(uid, "christmas:gifted");
    if (!gifted) {
      broadcast(uid, { num: 101 });
      await user.setUserFields(uid, { "christmas:gifted": 1 });
    } else {
      broadcast(uid, { num: 102 });
    }
  }
  broadcast(uid, { num });
};

plugin.upvote = async function (data) {
  let uid = data.uid;
  let gift = await user.getUserField(uid, "christmas:gift");
  console.log("this is upvote gifts", gift);
  let num = Math.floor(Math.random() * 10);
  let type = 3;
  if ([0].indexOf(num) > -1) {
    type = 0;
  } else if ([1, 2].indexOf(num) > -1) {
    type = 1;
  } else if ([3, 4, 5].indexOf(num) > -1) {
    type = 2;
  } else if ([6, 7, 8, 9].indexOf(num) > -1) {
    type = 3;
  }

  if (!gift) {
    gift = [];
    gift.push(type);
  } else if (gift.length && gift.length < 5) {
    gift.push(type);
  }else if (gift.length === 5) {
    return broadcast(uid, { num: 101 });
  }
  let newGift = [...new Set(gift)];
  console.log(num, gift, newGift);
  await user.setUserFields(uid, { "christmas:gift": newGift });

  if (newGift.length === 5) {
    let gifted = await user.getUserField(uid, "christmas:gifted");
    if (!gifted) {
      broadcast(uid, { num: 101 });
      await user.setUserFields(uid, { "christmas:gifted": 1 });
    } else {
      broadcast(uid, { num: 102 });
    }
  }
  broadcast(uid, { num });
};

plugin.getUsers = async function (users) {
  if (users) {
    users = users.map((user) => {
      return {
        ...user,

        picture: "https://i.imgur.com/tTOKboZ.jpg",
      };
    });
    console.log(users, " - - - this is getUsers");
    return users;
  } else {
    return null;
  }
};

module.exports = plugin;
