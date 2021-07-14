(function () {

  var animateTimer = null;
  $(window).on('load', function() {
    $('.dropdown-menu-selector').removeClass('fade');
    if (animateTimer) clearTimeout(animateTimer);
    animateTimer = setTimeout(function() {
      $('.dropdown-menu-selector').removeClass('animate');
    }, 1000);
  })

  // sidebar menu toggle
  $('.sidebar').on('click', '.sub-title', function(e) {
    var $item = $(this).parent('.menu-item');
    $item.toggleClass('collapse');
    if ($item.hasClass('menu-item-1')) {
      if ($item.hasClass('collapse')) {
        $item.nextUntil('.menu-item-1').hide().removeClass('collapse');
      } else {
        $item.nextUntil('.menu-item-1').show();
      }
    } else if ($item.hasClass('menu-item-2')) {
      if ($item.hasClass('collapse')) {
        $item.nextUntil('.menu-item-2').hide().removeClass('collapse');
      } else {
        $item.nextUntil('.menu-item-2').show();
      }
    } else if ($item.hasClass('menu-item-3')) {
      if ($item.hasClass('collapse')) {
        $item.nextUntil('.menu-item-3').hide().removeClass('collapse');
      } else {
        $item.nextUntil('.menu-item-3').show();
      }
    }
  });

    // 侧边栏固定
  function fixAside() {  
      var headerHeight = $('.header').outerHeight() + $('.search-wrapper').outerHeight() + 32;
      var offsetTop = $('.dropdown-menu-selector').height() || 0;
      affixSidebar(headerHeight, offsetTop);
      affix($('.breadcrumb'), headerHeight, 0);
  }

  function affixSidebar(headerHeight, offsetTop) {
    var footerHeight = $('.body-footer').outerHeight();
    var $sidebar = $('.sidebar-wrapper');
    var $breadcrumb = $('.breadcrumb');

    $(window).on('load scroll resize', function () {
      var scrollTop = window.scrollY || window.pageYOffset;

      // sidebar fixed 时跟底部保持的距离
      var offsetBottom = document.body.scrollHeight - scrollTop - window.innerHeight - 32;

      var bottom = 0;
      if (offsetBottom < footerHeight) {
        bottom = footerHeight - offsetBottom;
      }
      // console.log('window.innerHeight:' +  window.innerHeight);
      // console.log(';bottom:' +  bottom);
      // console.log(';offsetTop:' +  offsetTop);
      $sidebar.find('.sidebar').css({
        'height': window.innerHeight - bottom - offsetTop,
      });

      // sidebar fixed
      if (scrollTop > headerHeight) {
        $sidebar.addClass('fixed');
      } else {
        $sidebar.removeClass('fixed');
      }
    });
  }


  function affix($el, headerHeight, offsetTop) {
    $(window).on('load scroll resize', function () {
      if (!$el.length) return;

      var scrollTop = window.scrollY || window.pageYOffset;
      if (scrollTop > headerHeight) {
        $el.css({
          position: 'fixed',
          top: offsetTop,
          left: $el.offset().left,
          right: $('body').width() - $el.offset().left - $el.width(),
        })
      } else {
        $el.removeAttr('style')
      }
    });
  }

  fixAside();

  $('.sidebar [data-label]')
  .on('click',function(e){
    $('.sidebar [data-label]').removeClass('active');
    $('.main-container [data-label]').hide();
    $('.main-container [data-label="'+ $(this).attr('data-label') +'"]').show();
    $('pre[data-label="'+ $(this).attr('data-label') +'"]').html('');
    $(this).addClass('active');
  });

  function obj2Json(obj){
    var _j = {};
    for(var i in obj){
      _j[i] = obj[i];
    }
    return JSON.stringify(_j);
  }


  $('button[data-label]').on('click',function(){
    var logStr = "";
      try{
        var code = $('textarea[data-label="'+ $(this).attr('data-label') +'"]').val();
        var res = eval(code);
        res = res || '';
        if(typeof res == 'object'){
          res = obj2Json(res);
        }
        logStr += "执行成功!" + '\r\n';
        logStr += '执行返回值：' + res + '\r\n';
      }catch(e){
        logStr += e.message;
      }
      $('pre[data-label="'+ $(this).attr('data-label') +'"]').html(logStr);
  });



  $('#btn-goto-phone').on('click',function(){

      window.VhallEnv.appId
      && window.VhallEnv.channelId
      && window.VhallEnv.accessToken
      && window.VhallEnv.accountId
      && (function(){location.href = './index-h5.html?appId=' 
      + window.VhallEnv.appId 
      + '&channelId=' + window.VhallEnv.channelId 
      + '&token=' + window.VhallEnv.accessToken
      + '&accountId=' + window.VhallEnv.accountId
      + '&rd=' + (new Date().getTime())}());

  });


})();

