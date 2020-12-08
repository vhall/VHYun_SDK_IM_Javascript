"use strict";
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);

if (isMobile) {
  (function (doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function recalc() {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;

        if (clientWidth >= 640) {
          docEl.style.fontSize = '100px';
        } else {
          docEl.style.fontSize = 100 * (clientWidth / 640) * 2 + 'px';
        }
      };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);
}

window.onload = function () {
  // var vConsole = new VConsole();
  $("input[name=accountId]").val("chat".concat(Math.floor(1000 + Math.random() * 9000)));
  $("head").append("<link rel=\"stylesheet\" href=\"./css/".concat(isMobile ? "newUI_h5" : "newUI_pc", ".css\">"));
  isMobile && $("head").append("<meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui\">");
  var from = getQueryString("from") || ""; // 通过url传参跳转进入

  var isDisable;
  var isDisable_all;
  layui.use('form', function () {
    if (from !== "") {
      $("#toNew").css("visibility", "hidden");
      $(".login").hide();
      $(".main").show();
      var loading = layer.load(0, {
        shade: [0.1, '#fff']
      });
      var accountId = "chat".concat(Math.floor(1000 + Math.random() * 9000));
      VhallChat.createInstance(_defineProperty({
        appId: getQueryString('appId'),
        accountId: getQueryString('accountId'),
        token: getQueryString('token'),
        channelId: getQueryString('channelId')
      }, "accountId", accountId), function (msg) {
        layer.close(loading);
        $(".channelId-text>span").text(getQueryString('channelId'));
        window.chat = msg.message;
        isDisable = msg.disable;
        isDisable_all = msg.disable_all;
        setInputState(canInput(isDisable, isDisable_all));
        listen(accountId);
        return;
      });
    }

    layui.form.on('submit(formDemo)', function (data) {
      var href = window.document.location.href;
      var url = href.split("//")[0] + "//";
      var urlarr = href.split("//")[1].split('/').splice(0, window.location.href.split("//")[1].split('/').length - 1);

      for (var i in urlarr) {
        url += "".concat(urlarr[i], "/");
      }

      ;
      url = url + "demo.html";
      $("#toNew").attr('href', "".concat(url, "?appId=").concat(data.field.appId, "&accountId=").concat(data.field.accountId, "&token=").concat(data.field.token, "&channelId=").concat(data.field.channelId, "&from=demo"));
      var loading = layer.load(0, {
        shade: [0.1, '#fff']
      });
      VhallChat.createInstance({
        appId: data.field.appId,
        accountId: data.field.accountId,
        token: data.field.token,
        channelId: data.field.channelId
      }, function (msg) {
        $(".channelId-text>span").text(data.field.channelId);
        layer.close(loading);
        $(".login").hide();
        $(".main").show();
        window.chat = msg.message;
        isDisable = msg.disable;
        isDisable_all = msg.disable_all;
        setInputState(canInput(isDisable, isDisable_all));
        listen(data.field.accountId);
      }, function (err) {
        console.error(err);
      });
    });
  });
  $(document).on('click', '.cancleDisable', function () {
    var username = $(this).attr("data-name");
    window.chat.setDisable({
      type: VhallChat.TYPE_PERMIT,
      targetId: username
    }, function () {
      layer.msg("取消禁言成功");
    }, function (err) {
      layer.msg(err.msg);
    });
  });
  $(document).on('click', '.setDisable', function () {
    var username = $(this).attr("data-name");
    window.chat.setDisable({
      type: VhallChat.TYPE_DISABLE,
      targetId: username
    }, function () {
      layer.msg("禁言成功");
    }, function (err) {
      layer.msg(err.msg);
    });
  });
  $(".switchBtn").click(function (e) {
    document.querySelector(".switchBtn > input").checked = !document.querySelector(".switchBtn > input").checked;

    if (document.querySelector(".switchBtn > input").checked) {
      window.chat.setDisable({
        type: VhallChat.TYPE_DISABLE_ALL
      }, function () {
        layer.msg("开启全体禁言");
      }, function (err) {
        layer.msg(err.msg);
      });
    } else {
      window.chat.setDisable({
        type: VhallChat.TYPE_PERMIT_ALL
      }, function () {
        layer.msg("关闭全体禁言");
      }, function (err) {
        layer.msg(err.msg);
      });
    }

    e.preventDefault();
  });
  $(".tabbar-item").click(function () {
    $(".tabbar-item").removeClass("active");
    this.classList.add("active");

    if (this.classList.contains("chatroom")) {
      $(".chatList").show();
      $(".onlineList").hide();
    } else {
      $(".chatList").hide();
      $(".onlineList").show();
    }
  });
  $("#chatContext").keyup(function (event) {
    if (event.keyCode === 13) {
      var text = $(this).val();
      if (text !== "") {
        window.chat.emitChat({
          data: text,
          context: {},
          inspection: true
        }, function () {
          layer.msg("发送成功");
          $('#chatContext').val("");
        }, function (err) {
          layer.msg("发送失败");
        });
      }
    }
  }).on('blur', function () {
    $(window).scrollTop(0);
  });
  $("#sendMsg").click(function () {
    var text = $('#chatContext').val();

    if (text !== "") {
      window.chat.emitChat({
        data: text,
        context: {},
        inspection: true
      }, function () {
        layer.msg("发送成功");
        $('#chatContext').val("");
      }, function () {
        layer.msg("发送失败");
      });
    }
  });

  function updateUserList() {
    $(".onlineBox .online-item").remove();
    $(".disabled-list .disabled-item").remove();
    window.chat.getOnlineInfo({
      currPage: 1,
      pageSize: 10
    }, function (res) {
      var onlineList = res.onlineList;
      var channelDisable = res.channelDisable;
      $(".userCount").text("(" + onlineList.length + ")");
      for (var index = 0; index < onlineList.length; index++) {
        var item = onlineList[index];
        $(".onlineBox").append(
          '<div class="online-item">' +
          '<div class="avatar">' +
          '<img src="./images/avatar.png">' +
          '<p>' + item.accountId + '</p>' +
          '</div>' +
          '<button data-name="' + item.accountId + '" class="layui-btn  layui-btn-sm ' + (item.isDisable ? "cancleDisable layui-btn-danger" : "setDisable layui-btn-normal") + '" >' +
          (item.isDisable ? "解除禁言" : "禁言") +
          '</button>' +
          '</div>'
        );
      }
      // for (var item of onlineList) {
      //   $(".onlineBox").append(
      //     '<div class="online-item">' +
      //     '<div class="avatar">' +
      //     '<img src="./images/avatar.png">' +
      //     '<p>' + item.accountId + '</p>' +
      //     '</div>' +
      //     '<button data-name="' + item.accountId + '" class="layui-btn  layui-btn-sm ' + (item.isDisable ? "cancleDisable layui-btn-danger" : "setDisable layui-btn-normal") + '" >' +
      //     (item.isDisable ? "解除禁言" : "禁言") +
      //     '</button>' +
      //     '</div>'
      //   );
      // }
    }, function (err) {
      console.log(err);
    });
  }

  function setInputState(val) {
    if (val) {
      $("#chatContext").val("");
      $("#sendMsg").removeAttr("disabled");
      $("#chatContext").removeAttr("disabled");
      $("#sendMsg").removeClass("disabledBtn");
    } else {
      $("#chatContext").val("您已被禁言~");
      $("#chatContext").attr("disabled", true);
      $("#sendMsg").addClass("disabledBtn");
    }
  }

  function canInput(p, all) {
    return !p && !all;
  }

  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

  function scrollToBottom() {
    var ele = document.querySelector('.chatList');
    ele.scrollTop = ele.scrollHeight;
  }

  function listen(accountId) {
    var count = 0;
    document.querySelector(".switchBtn > input").checked = isDisable_all;
    window.chat.onChat(function (res) {
      switch (res.type) {
        case VhallChat.TYPE_TEXT:
          count++;
          var str = "<div class=\"chat-item\">\n      <img src=\"./images/avatar.png\" alt=\"\">\n      <div class=\"chat-item-content\">\n        <div class=\"chat-item-title\">\n          <span class=\"chat-item-name\">".concat(res.user_id, "</span>\n          <span class=\"chat-item-date\">").concat(res.date_time, "</span>\n        </div>\n        <p class=\"chat-item-text\">").concat(res.text_content, "</p>\n      </div>\n    </div>");
          $(".chatroomCount").text("(".concat(count, ")"));
          $(".chatList").append(str);
          scrollToBottom();
          break;

        case VhallChat.TYPE_DISABLE:
          updateUserList();

          if (res.target_id === accountId) {
            isDisable = true;
            setInputState(canInput(isDisable, isDisable_all));
          }

          break;

        case VhallChat.TYPE_DISABLE_ALL:
          document.querySelector(".switchBtn > input").checked = true;
          isDisable_all = true;
          setInputState(canInput(isDisable, isDisable_all));
          break;

        case VhallChat.TYPE_PERMIT:
          updateUserList();

          if (res.target_id === accountId) {
            isDisable = false;
            setInputState(canInput(isDisable, isDisable_all));
          }

          break;

        case VhallChat.TYPE_PERMIT_ALL:
          document.querySelector(".switchBtn > input").checked = false;
          isDisable_all = false;
          setInputState(canInput(isDisable, isDisable_all));
          break;

        default:
          break;
      }
    });
    window.chat.getHistoryList({
      currPage: 1,
      // 当前页
      pageSize: 200,
      // 每页大小
      startTime: dayjs().subtract(14, "day").format('YYYY/MM/DD'),
      // 查询开始时间  格式为：2017/01/01
      endTime: dayjs().format('YYYY/MM/DD')
    }, function (res) {
      $(".chatroomCount").text("(".concat(res.list.length, ")"));
      count = res.list.length;
      var messageList = res.list.sort(function (a, b) {
        return a < b ? 1 : -1;
      });

      for (var i in messageList) {
        if (messageList[i].type === VhallChat.TYPE_TEXT) {
          $(".chatList").append("<div class=\"chat-item\">\n                <img src=\"./images/avatar.png\" alt=\"\">\n                <div class=\"chat-item-content\">\n                  <div class=\"chat-item-title\">\n                    <span class=\"chat-item-name\">".concat(messageList[i].third_party_user_id, "</span>\n                    <span class=\"chat-item-date\">").concat(messageList[i].date_time, "</span>\n                  </div>\n                  <p class=\"chat-item-text\">").concat(messageList[i].data, "</p>\n                </div>\n              </div>"));
        }
      }

      scrollToBottom();
    }, function (err) {
      console.warn(err);
    });
    window.chat.join(function (res) {
      updateUserList();
    });
    window.chat.leave(function (res) {
      updateUserList();
    });
  }
};