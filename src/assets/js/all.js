/*!
  * global Variable
  */
var globalCommon;
var device_Flag='pc';
var parameterList=[];
 
var Common={
/*・・・・・・・・・・・各種実行タイミング・・・・・・・・ */ 
/*初回--------------------------------------------*/
initialize:function(){
	Common.changeDevice();//追加（呼び出し）※1
	return Common;
},
/*レンダリング後-------------------------------------*/
render:function(){
Common.scrollHeader();

 return Common;//追加（呼び出し）※2
},
/*ロード後------------------------------------------*/
onLoad:function(){
  Common.megamenuToggle();
  Common.spBugerToggle();
  Common.spSubToggle();
  Common.scrollTop();
  Common.scrollShow();
  Common.setBreadcrumb();
  Common.anchorSmoothScroll();
  Common.accordion();
  Common.matchHeight();
  Common.tab();
  Common.swiperSetting();
	return Common;
},
/*スクロールイベント--------------------------------- */
scroll:function(){
	return Common;
},
/*リサイズ時---------------------------------------- */
resize:function(){
	return Common;
},
/*※1の関数------------------------------------------*/
changeDevice:function(){
  var winW=window.innerWidth;
  if(winW>=768){
		device_Flag='pc';
  }
	else{
	  device_Flag='sp';
  }
},
/*※2の関数------------------------------------------*/
/*--------------------メガメニュー-------------------*/
megamenuToggle:function(){
  var toggleTarget = document.querySelectorAll('.js-megamenu')
  var _overLay = document.querySelector('.js-overlay')
  for(var i = 0; i < toggleTarget.length; i++) {
    toggleTarget[i].addEventListener('mouseenter', (e) => {
      e.target.classList.add('is-open')
      _overLay.classList.add('is-open')
    })
    toggleTarget[i].addEventListener('mouseleave', (e) => {
      e.target.classList.remove('is-open')
      _overLay.classList.remove('is-open')
    })
  }
},
/*※2の関数------------------------------------------*/
/*--------------------ハンバーガーメニュー開閉-------------------*/
spBugerToggle:function(){
  var toggleButton = document.querySelector('.js-drower-box')
  var toggleContent = document.querySelector('.js-drower-content')
  var closeButton = document.querySelector('.js-close-menu')

  toggleButton.addEventListener('click', (e) => {
    toggleButton.classList.toggle('is-open')
    toggleContent.classList.toggle('is-open')
  })
  closeButton.addEventListener('click', (e) => {
    if(toggleContent.classList.contains('is-open')) {
      toggleContent.classList.remove('is-open')
      toggleButton.classList.remove('is-open')
    }
  })
},
/*※2の関数------------------------------------------*/
/*--------------------ドロワー内サブメニュー開閉-------------------*/
spSubToggle:function(){
  var subButton = document.querySelectorAll('.js-toggle')

  for( let i = 0; i < subButton.length; i++) {
    subButton[i].addEventListener('click', (e) => {
      e.target.classList.toggle('is-open')
      if(e.target.nextElementSibling) {
        e.target.nextElementSibling.classList.toggle('is-open')
      }
    })
  }
},
/*※2の関数------------------------------------------*/
/*--------------------パンクズ表示-------------------*/
setBreadcrumb:function(){
  function convertArray(node) {
    const convertResult = Array.prototype.slice.call(node)
    return convertResult;
  }
	if (document.querySelector('head').querySelector('[name="breadcrumb"]') == null) { return false }
	var count = document.querySelector('head').querySelector('[name="breadcrumb"]').content;
	var breadcrumb = document.getElementById('breadcrumb');

	// 元のパンくずのaタグ空にする
	var breadcrumbLink = breadcrumb.querySelectorAll('nav a');
	var breadcrumbLinkArr = convertArray(breadcrumbLink)
	breadcrumbLinkArr.forEach(function(e) {
		e.remove();
	})
	
	// meta要素内のパンくず取得、aタグに入れる
	for(var i = 0; i <= count; i++) {
		var content = document.querySelector('head').querySelector('[name="breadcrumb_' + i + '"]').content;
		var href =  document.querySelector('head').querySelector('[name="breadcrumb_link_' + i + '"]').content;

		var nav = breadcrumb.querySelector('nav');
		var newLink = document.createElement("a");
		var newLinkContent = document.createTextNode(content);
		newLink.appendChild(newLinkContent);
		newLink.setAttribute('href', href);
    newLink.setAttribute('class', 'l-breadcrumb__link');
		nav.appendChild(newLink)

		if(i == count) {
			newLink.setAttribute('class', 'l-breadcrumb__link current');
		}
	}
},
/*※2の関数------------------------------------------*/
/*--------------------ページ内遷移-------------------*/
anchorSmoothScroll:function(){
  let $ancScroll = $('.js-anc')
  $ancScroll.on('click', function() {
    // ヘッダー分調整
    var adjustPc = -130
    var adjustSp = -70

    var speed = 600
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href)
    var positionPc = target.offset().top + adjustPc;
    var positionSp = target.offset().top + adjustSp;
    var breakpoint = 767;
    var lastWW = $(window).width();
    // リサイズ調整
    if (lastWW <= breakpoint) {
      $('body,html').animate({scrollTop:positionSp}, speed, 'swing');
    } else {
      $('body,html').animate({scrollTop:positionPc}, speed, 'swing');
    }
    $('window').on('resize', function() {
        var currentWW = $('window').width();
        if (lastWW <= breakpoint && breakpoint < currentWW) {
          $('body,html').animate({scrollTop:positionPc}, speed, 'swing');
        } else if (currentWW <= breakpoint && breakpoint < lastWW) {
          $('body,html').animate({scrollTop:positionSp}, speed, 'swing');
        }
        lastWW = currentWW;
    });
    return false;
  })
},
/*※2の関数------------------------------------------*/
/*--------------------トップに戻るボタン-------------------*/
scrollTop:function(){
  const $scrollTop = $('.js-scroll-top')
  const scroll_button_toggle = () => {
    const windowScrollTop = $(window).scrollTop()
    if (windowScrollTop <= $(window).height() / 2) {
      $scrollTop.on('animationend', () => {
        $scrollTop.removeClass('is-leave')
        $scrollTop.off('animationend')
      })
      if (!$scrollTop.hasClass('is-enter')) return
      $scrollTop.removeClass('is-enter').addClass('is-leave')
    }
    else {
      if ($scrollTop.hasClass('is-enter')) return
      $scrollTop.addClass('is-enter')
    }
  }

  $scrollTop.on('click', (e) => {
    e.preventDefault()
    $('html, body').animate({
      scrollTop: 0
    }, 600)
  })

  $(window).on('scroll', () => {
    scroll_button_toggle()
  })
  scroll_button_toggle()
},
/*※2の関数------------------------------------------*/
/*--------------------スクロールフェードイン-------------------*/
scrollShow:function(){
  $(window).scroll(function(){
    let $fadeTarget = $('.js-effect-fade, .js-fade-target, .js-fadedown-target');
    $fadeTarget.each(function(){
      var elemPos = $(this).offset().top;
      let scroll = $(window).scrollTop();
      var windowHeight = $(window).height();

      if(scroll > elemPos - windowHeight + 100) {
        $(this).addClass('c-effect-scroll');
      }
    })
  })
},
/*※2の関数------------------------------------------*/
/*--------------------アコーディオン-------------------*/
accordion:function(){
  $.fn.set_accordion = function (options) {
    return this.each(function () {
      const $root = $(this);
      const $button = $root.find('.js-accordion-hook');
      const $content = $root.find('.js-accordion-content');

      function openAccordion() {
        $content.addClass('u-overflow--visible').slideDown(400, () => {
          $content.removeAttr('style').removeClass('u-overflow--visible')
        }).animate({
          'opacity': 1,
        }, {
          queue: false,
          duration: 300
        }, () => {
          $content.removeAttr('style')
        })
        $root.addClass('is-active');
      };

      function closeAccordion() {
        $content.addClass('u-overflow--visible').slideUp(400, () => {
          $content.removeAttr('style').removeClass('u-overflow--visible')
          $root.removeClass('is-active');
        }).animate({
          'opacity': 0,
        }, {
          queue: false,
          duration: 200
        }, () => {
          $content.removeAttr('style')
        })
      };

      function defaultBuild() {
        if ($root.hasClass('is-active')) {
          openAccordion();
        }
      }

      defaultBuild();

      $button.on('click', (e) => {
        if ($root.hasClass('is-active')) {
          closeAccordion();
        } else {
          openAccordion();
        }
      })

    });
  };

  $('.js-accordion').set_accordion();
},
/*※2の関数------------------------------------------*/
/*--------------------matchheght-------------------*/
matchHeight:function(){
  if (!$('.js-match-height')[0]) return
  $('.js-match-height').matchHeight();

  $(window).on('resize', () => {
    $('.js-match-height').matchHeight();
  })
},
/*※2の関数------------------------------------------*/
/*--------------------タブ-------------------*/
tab:function(){
  var $tabList = $('.js-tab-list');
  if(!$tabList[0]) return

  const tabContentToggle = (target) => {
    const $target = $(target)
    $target.siblings('.js-tab-content').removeClass('is-visible').removeAttr('style')
    $target.fadeIn(() => {
      $target.addClass('is-visible').removeAttr('style')
    })
  }
  const $tabButton = $('.js-tab-button')
  $tabButton.on('click', (e) => {
    const $this = $(e.originalEvent.currentTarget)
    const target = $this.data('target').split(',')
    const $parentList = $this.parents('.js-tab-list')
    const current_index = $parentList.children().index($this.parent())

    const tabRelation = $this.data('relation')
    const $tabGroup = $(tabRelation)
    // アニメーション中は処理を受け付けないようにする
    if ($('.js-tab-content').is(':animated') || $this.hasClass('is-active')) return

    // タブボタンのアクティブ状態の切り替え
    if ($tabGroup[0] && $parentList.hasClass(tabRelationClassName)) {
      // 複数のタブを連動させる
      $tabGroup.find('.js-tab-button').removeClass('is-active')
      $tabGroup.each((index, element) => {
        const $element = $(element)
        $element.find('.js-tab-button').eq(current_index).addClass('is-active')
      })
    }
    else {
      // タブ単体で機能させる
      $parentList.find('.js-tab-button').removeClass('is-active')
      $this.addClass('is-active')
    }

    // タブコンテンツの切り替え
    target.forEach((id) => {
      tabContentToggle(id)
    })

  })

  $tabList.each((index, element) => {
    const $element = $(element)
    const $tabButtonFirst = $element.find('.js-tab-button').eq(0)
    $tabButtonFirst.addClass('is-active')
    tabContentToggle($tabButtonFirst.data('target'))
  })
},
/*※2の関数------------------------------------------*/
/*--------------------swiperの設定-------------------*/
swiperSetting:function(){
  const swiperTop = new Swiper(".js-top-swiper", {
    loop: true,
    slidesPerView: "auto",
    // centeredSlides: true,
    effect: "fade",
    // autoplay: {
    //   delay: 5000,
    // },
    speed: 1000,
    // pagination: {
    //   el: ".js-pick-pagenation",
    //   clickable: true,
    //   type: 'progressbar',
    // },
    // navigation: {
    //   nextEl: ".js-pick-next",
    //   prevEl: ".js-pick-prev"
    // },
    breakpoints: {
      768: {
        slidesPerView: "auto",
        // initialSlide: 1,
        centeredSlides: false,
      }
    }
  });

  const swiperNews = new Swiper(".js-news-swiper", {
    loop: false,
    slidesPerView: "auto",
    // centeredSlides: true,
    spaceBetween: 30,
    speed: 1000,
    pagination: {
      el: ".js-news-pagination",
      clickable: true,
      type: 'progressbar',
    },
    navigation: {
      nextEl: ".js-news-next",
      prevEl: ".js-news-prev"
    },
    breakpoints: {
      768: {
        slidesPerView: "auto",
        spaceBetween: 50,
        centeredSlides: false,
      }
    }
  });

  const swiperProduct = new Swiper(".js-product-swiper", {
    loop: false,
    slidesPerView: "auto",
    spaceBetween: 30,
    speed: 1000,
    pagination: {
      el: ".js-product-pagination",
      clickable: true,
      type: 'progressbar',
    },
    navigation: {
      nextEl: ".js-product-next",
      prevEl: ".js-product-prev"
    },
    breakpoints: {
      768: {
        slidesPerView: "auto",
        spaceBetween: 60,
        centeredSlides: false,
      }
    }
  });

  const swiperEmployee = new Swiper(".js-recruit-swiper", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    speed: 1000,
    navigation: {
      nextEl: ".js-recruit-next",
      prevEl: ".js-recruit-prev"
    },
    breakpoints: {
      768: {
        slidesPerView: "auto",
        spaceBetween: 60,
        centeredSlides: false,
      }
    }
  });
},
/*・・・・・・・・・・・・・全イベント実行・・・・・・・・・・ */ 
allEvent:function(){
	document.addEventListener('DOMContentLoaded',function(){
		Common.initialize();
    Common.onLoad();
  })
  window.addEventListener('scroll',function(){
	  Common.scroll();
  })
  window.addEventListener('resize',function(){
	  Common.resize();
  })
  window.addEventListener('popstate',function(){
	  location.reload();
  })
 }
}
Common.allEvent();