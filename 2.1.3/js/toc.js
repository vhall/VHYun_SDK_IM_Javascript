(function($) {

  $.fn.generateToc = function(opts) {
    var $toc = this;
    var $content = opts.contentContainer || $('.typo');
    var isAffix = opts.affix || false;

    // generate element
    generate($content, isAffix);

    if (isAffix) {
      var $tocContainer = opts.affix.container || $('.main-container');
      $tocContainer.css({
        'position': 'relative',
      });
      $toc.css({
        'width': $tocContainer.outerWidth(),
        'text-align': 'right',
      });

      var startFixTop = $toc.offset().top || 0;
      var offsetTop = opts.offsetTop || 0;
      var offsetRight = document.body.offsetWidth - $toc[0].getBoundingClientRect().right;
      var bgColor = opts.affix.bgColor || 'rgba(255, 255, 255, 0.95)';
      affix($toc, startFixTop, offsetTop, offsetRight, bgColor);

      var scrollOffsetTop = offsetTop + $toc.outerHeight();
      tocScroll($toc, scrollOffsetTop);
    } else {
      var offsetTop = $('.breadcrumb').outerHeight();
      tocScroll($toc, offsetTop);
    }

    // toc dropdown trigger: hover
    $toc.on('mouseenter', '.dropdown-toc .dropdown-trigger', function() {
      $(this).parent('.dropdown').find('.dropdown-body').show();
    }).on('mouseleave', function() {
      $(this).find('.dropdown-body').hide();
    }).on('click', '.toc-item', function() {
      $toc.find('.dropdown-body').hide();
    });

    function generate($content, isAffix) {
      var headers = [];
      var $headings = [];

      var contentTitle = opts.contentTitle || $('#title');
      var titleID = contentTitle.attr('id');
      var titleClass = contentTitle.attr('class');
      var selectorString = titleID ? ('#' + titleID) : ('.' + titleClass);
      var h1Elements = $content.find('h1').not(selectorString);

      var hasH1 = h1Elements.length ? true : false;
      var $elements = hasH1 ?
          $content.find('h1:not(' + selectorString + '), h2, h3') :
          $content.find('h2, h3');

      var sLevel = 0;
      $elements.each(function(index, item) {
        var text = item.innerText;
        if (!text) return;

        var level = parseInt(item.nodeName.substr(1), 10);
        level = hasH1 ? level : level - 1;

        var id = $(this).attr('id') || formatID();
        $(this).attr('id', id);

        headers.push({
          id: id,
          level: level,
          text: text,
        });
      });

      if (headers.length) {
        var $list = $('<ul />');
        $.each(headers, function(index, item) {
          var $a = $('<a />').attr('href', '#' + item.id).text(item.text);
          var $li = $('<li />').attr('class', 'toc-item toc-item-' + item.level).append($a);
          $list.append($li);
        });

        var template = '<div class="dropdown dropdown-toc">' +
          '<div class="dropdown-trigger">' +
            '<span id="toc-current">本页导航</span>' +
            '<span class="icon-down"></span>' +
          '</div>' +
          '<div class="dropdown-body"></div>' +
        '</div>';

        $toc.append(template);
        $toc.find('.dropdown-body').append($list);

        // styles
        $toc.find('.dropdown').css({
          'position': 'relative',
          'float': 'right',
          'width': '240px',
        });
        $toc.find('.dropdown-trigger').css({
          'position': 'relative',
          'display': 'inline-block',
          'font-size': '12px',
          'color': 'rgba(0, 0, 0, 0.65)',
          'cursor': 'pointer',
          'line-height': '30px',
        });
        $toc.find('.dropdown-body').css({
          'display': 'none',
          'position': 'absolute',
          'z-index': 6,
          'top': '100%',
          'right': 0,
          'background-color': '#FFF',
          'width': '100%',
          'min-width': '160px',
          'border': '1px solid #E7E7E7',
          'box-shadow': '0 1px 3px rgba(0, 0, 0, .1)',
          'padding': '10px 0',
          'max-height': '300px',
          'overflow': 'auto',
          'text-align': 'left',
        });
        $('#toc-current').css({
          'display': 'inline-block',
          'vertical-align': 'top',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          'max-width': '200px',
          'margin-right': '8px'
        });
        $toc.find('.icon-down').css({
          'display': 'inline-block',
          'vertical-align': 'middle',
          'width': '12px',
          'height': '14px',
          'background': 'url(https://gw.alipayobjects.com/zos/rmsportal/vdUMLyjzDMVUeclslxwc.svg) no-repeat',
          'background-size': '100%',
          'opacity': '.6'
        });

        $toc.find('.toc-item').css({
          'list-style': 'none',
        });
        $toc.find('.toc-item a').css({
          'display': 'block',
          'padding': '0 16px',
          'font-size': '12px',
          'line-height': '24px',
          'color': 'rgba(0, 0, 0, .65)',
          'white-space': 'nowrap',
          'max-width': '240px',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis'
        });
        $toc.find('.toc-item-2 a').css({
          'padding-left': '32px'
        });
        $toc.find('.toc-item-3 a').css({
          'padding-left': '48px'
        });
        $toc.find('.anchor-toc').css({
          'color': '#108EE9'
        });
      }
    }

    function tocScroll($el, offsetTop) {
      // click to scroll
      $el.on('click', 'a', function(e) {
        e.preventDefault();

        var href = $(this).attr('href');
        if (!$(href).length) return;

        var top = $(href).offset().top - offsetTop;
        $('html, body').animate({
          scrollTop: top + 4,
        });
        $('.dropdown.open').removeClass('open');
        var hash = href.substr(1);
        document.location.hash = encodeURIComponent(hash);
      });

      // toc scroll highlight
      $(window).on('load scroll', function () {
        var pos = $(window).scrollTop() + offsetTop;

        var $firstHeading = null;
        $el.find('a').each(function(i, item) {
          var href = $(item).attr('href');
          if (!href || href === '#' || !$(href).length) return;

          // get first heading
          if (i === 0) {
            $firstHeading = $(href);
          }

          var top = $(href).offset().top;
          if (pos > top - 10) {
            $el.find('a').css({
              'color': 'rgba(0, 0, 0, .65)'
            });
            $(item).css({
              'color': '#108EE9'
            });
            $('#toc-current').text($(item).text());
          }
        });

        if ($firstHeading && $firstHeading.length && pos < $firstHeading.offset().top) {
          $toc.find('a').css({
            'color': 'rgba(0, 0, 0, .65)'
          });
          $('#toc-current').text('本页导航');
        }
      });
    }

    function affix($el, startFixTop, offsetTop, offsetRight, bgColor) {
      $(window).on('load scroll resize', function () {
        if (!$el.length) return;
        var scrollTop = window.scrollY || window.pageYOffset;
        if (scrollTop > startFixTop - offsetTop) {
          $el.css({
            position: 'fixed',
            top: offsetTop,
            right: offsetRight,
            backgroundColor: bgColor
          })
        } else {
          $el.css({
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'transparent'
          })
        }
      });
    }

    // 生成随机 id，由 5 位字母组成
    function formatID() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    }
  };
}(jQuery));
