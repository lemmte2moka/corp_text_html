/**
 * 変数
*****************************************************/
let news = {}
news = {
  jsonPath: {}, // 取得用
  jsonData: {}, // 格納用
  jsonCurrentData: {}, // 絞り込み後のデータ格納用
  state: {
    pageType: 'news',
    number: {}, // 表示件数
    paged: {}, // 現在のページNo
    maxPaged: {}, // 最大ページNo
    offset: {}, // ページ送りの際の表示用
    allNum: {}, // 全件数
    year: {}, // 絞り込み用
    yearList: {} // 絞り込み用
  },
  elem: {
    container: {}, // Newsエリア
    wrap: {}, // Newsエリア
    list: {}, // Newsリスト（出力するエリア）
    selectWrap: {}, // Selectエリア
    selectList: {}, // Selectリスト（出力するエリア）
  },
}

/*****************************************************
 * 処理
*****************************************************/
// 読み込み時実行
document.addEventListener("DOMContentLoaded", function () {
  if(!document.querySelector('.l-breadcrumb__link')) {
    news.state.pageType = 'top'
  } else if(document.querySelectorAll('.l-breadcrumb__link')[1] 
  && document.querySelectorAll('.l-breadcrumb__link')[1].innerText === 'お知らせ') {
    news.state.pageType = 'news'
  } else {
    news.state.pageType = 'other'
  }
  console.log(news.state.pageType)
  if(news.state.pageType === 'news') {
    news.elem.wrap = document.querySelector('.js-news')
    news.elem.list = document.querySelector('.js-news').querySelector('.js-news-list')
    news.elem.selectWrap = document.querySelector('.js-select')
    news.elem.selectList = document.querySelector('.js-select').querySelector('.js-select-list')
    news.state.number = 10
    news.state.year = 'all'
  } else if(news.state.pageType === 'top') {
    news.elem.container = document.querySelector('.js-top-news')
    news.state.number = 5
  }
  news.jsonPath = '/natural-water/19-2/'
  // news.jsonPath = '/natural-water/19-2/index.json'
  news.state.paged = 1
  news.state.offset = 0
  news.init()
  if(news.state.pageType === 'news') {
    news.yearSelect()
  }
})



/*****************************************************
* 関数
*****************************************************/

/*
 JSON読込み
*/
news.init = function(_yearList) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', news.jsonPath)
  xhr.send()
  xhr.onreadystatechange = function() {
    // 通信完了及び通信成功した場合　
    if(xhr.readyState == 4 && xhr.status == 200) {
      news.jsonData = []
      news.jsonData = JSON.parse(xhr.responseText)
      console.log(news.jsonData)
      news.jsonCurrentData = news.jsonData
      console.log(news.jsonCurrentData)
      news.state.maxPaged = Math.ceil(news.jsonCurrentData.length / news.state.number)
      var _year = []
      for(let i = 0; i <  news.jsonCurrentData.length; i++) {
        _year.push(news.jsonData[i].date.slice(0,4));
      }
      var _yearList = _year.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      news.state.yearList = _yearList
      news.generate()
      if(news.state.pageType === 'news') {
        news.selectGenerate()
        news.allNumSet()
      } else if (news.state.pageType === 'top') {
        news.swiperSetting()
      }
      if(!document.querySelector('.js-pagenation')) return
      pagenation.init()
      // データがなかった場合
      if(news.jsonData.lenght === 0) {

      }
      

      // 通信完了及び通信失敗した場合
    }  else if (xhr.readyState == 4 && xhr.status == 404) {

      return
    }
    
  }
}


/*
  reset
*/
news.reset = function () {
  let _h = ''
  if(news.state.pageType === 'top') {
    _h = news.elem.container.clientHeight
  } else {
    _h = news.elem.list.clientHeight
  }
  if(_h <= 0) return
  if(news.state.pageType === 'top') {
    news.elem.container.style.height = _h + 'px'
  } else {
    news.elem.list.style.height = _h + 'px'
  }
  
}

/*
  ニュースリスト生成
*/
news.generate = function () {
  news.reset()
  if(news.state.pageType === 'top') {
    const _wrapperDiv = document.createElement("div")
    _wrapperDiv.classList.add('p-top-news__slider')
    _wrapperDiv.classList.add('swiper-container')
    _wrapperDiv.classList.add('js-news-swiper')
    _wrapperDiv.classList.add('js-effect-fade')
    _wrapperDiv.classList.add('c-effect-fade')
  
    const _listDiv = document.createElement("div")
    _listDiv.classList.add('p-top-news__list')
    _listDiv.classList.add('swiper-wrapper')
    _listDiv.classList.add('js-news-list')
  
    const _prev = document.createElement("div")
    _prev.classList.add('swiper-button-prev')
    _prev.classList.add('c-swiper__button--prev')
    _prev.classList.add('js-news-prev')
  
    const _next = document.createElement("div")
    _next.classList.add('swiper-button-next')
    _next.classList.add('c-swiper__button--next')
    _next.classList.add('js-news-next')

    const _pagenation = document.createElement("div")
    _pagenation.classList.add('swiper-pagination')
    _pagenation.classList.add('c-swiper__pagination')
    _pagenation.classList.add('js-news-pagination')
    
    for (let i = news.state.offset; i < news.jsonData.length; i++) {
      if(i >= (news.state.number * news.state.paged) || !news.jsonData[i]) break
      _listDiv.appendChild(news.listTopHtml(news.jsonData[i]))
    }
    _wrapperDiv.appendChild(_listDiv)
    _wrapperDiv.appendChild(_prev)
    _wrapperDiv.appendChild(_next)
    _wrapperDiv.appendChild(_pagenation)
    news.elem.container.appendChild(_wrapperDiv)
  } else {
    gsap.to(news.elem.list, {
      opacity: 0,
      duration: 0.1,
      onComplete: () => { 
        news.elem.list.innerHTML = ''
        for (let i = news.state.offset; i < news.jsonCurrentData.length; i++) {
          if(i >= (news.state.number * news.state.paged) || !news.jsonCurrentData[i]) break
          if(news.state.pageType === 'news') {
            news.elem.list.appendChild(news.listHtml(news.jsonCurrentData[i]))
          }
        }
        news.elem.list.style.height = ''
        gsap.to(news.elem.list, {
          opacity: 1,
          duration: 0.5
        })
       },
    })
  }
  
}

/*
  セレクトリスト生成
*/
news.selectGenerate = function() {
  for (let i = 0; i < news.state.yearList.length; i++) {
    news.elem.selectList.appendChild(news.selectHtml(news.state.yearList[i]))
  }
}

/*
  全件表示
*/
news.allNumSet = function() {
  let _allNumArea = document.querySelector('.js-all-num')
  _allNumArea.textContent = ''
  let _allNum = news.jsonCurrentData.length

  _allNumArea.textContent= _allNum
}

/*
 ニュースリストhtml成形
*/
news.listHtml = function (_data) {
  const _li = document.createElement("li")

  let _class = ''
  let _img = ''

  if(!_data.img) {
    _img = '\
    <p class="p-news__media"><img src="/natural-water/assets/img/news/img_news_item.jpg" alt="' +_data.description+ '" class="p-news__media-img"></p>\
    '
  } else {
    _img = '\
    <p class="p-news__media"><img src="' +_data.thumbnail+ '" alt="' +_data.description+ '" class="p-news__media-img"></p>\
    '
  }
  _li.classList.add('p-news__item')
  _class = 'p-news__link'

	const _inner = '\
    <a class="' +_class+ '" href="' +_data.url+ '"target="_blank">\
      '+ _img +'\
      <div class="p-news__detail">\
        <div class="p-news__date-tag">\
          <p class="p-news__date">'+_data.date.slice(0,4)+'.'+_data.date.slice(5,7)+'.'+_data.date.slice(8,10)+'</p>\
        </div>\
        <p class="p-news__title">'+_data.title+'</p>\
      </div>\
    </a>\
  </li>'
  _li.innerHTML = _inner
  return _li
}

/*
 ニュースリストhtml成形
*/
news.listTopHtml = function (_data) {
  const _div = document.createElement("div")

  let _class = ''
  let _img = ''

  if(!_data.img) {
    _img = '\
    <p class="p-top-news__media"><img src="/natural-water/assets/img/news/img_news_item.jpg" alt="' +_data.description+ '" width="380" height="240" class="p-top-news__img"></p>\
    '
  } else {
    _img = '\
    <p class="p-top-news__media"><img src="' +_data.thumbnail+ '" alt="' +_data.description+ '" width="380" height="240" class="p-top-news__img"></p>\
    '
  }
  _div.classList.add('p-top-news__item')
  _div.classList.add('swiper-slide')
  _class = 'p-top-news__link'

  // const _target = (_data.link_target === 'false' || _data.link_target === 'FALSE' || _data.link_target === 'internal')? '' : ' target="_blank"'

	const _inner = '\
    <a class="' +_class+ '" href="' +_data.url+ '"target="_blank">\
      '+ _img +'\
      <div class="p-top-news__date-tag">\
        <p class="p-news__date">'+_data.date.slice(0,4)+'.'+_data.date.slice(5,7)+'.'+_data.date.slice(8,10)+'</p>\
      </div>\
      <p class="p-top-news__title">'+_data.title+'</p>\
    </a>\
  </li>'
  _div.innerHTML = _inner
  return _div
}

/*
 セレクトリストhtml成形
*/
news.selectHtml = function(_yearList) {
  const _option = document.createElement("option")
  
  let _value = _yearList
  _option.text = _yearList + '年'
  _option.value = _value

  return _option
}

/*
 セレクト変更
*/
news.yearSelect = function() {
  let _select = document.querySelector('.js-select-list')


  _select.addEventListener("change", () => {
    let _selectedValue = _select.value;
    news.state.year = _selectedValue
    news.jsonCurrentData = ''
    news.state.paged = 1
    news.state.offset = 0
    news.state.maxPaged = ''
    if(_selectedValue == 'all') {
      news.jsonCurrentData = news.jsonData
    } else {
      news.jsonCurrentData = news.jsonData.filter(function(item, index){
        if ((item.create_date).indexOf(_selectedValue) >= 0) return true;
      });
    }
    news.state.maxPaged = Math.ceil(news.jsonCurrentData.length / news.state.number)
    news.allNumSet()
    news.generate()
    pagenation.disabled()
    pagenation.update()
    pagenation.numHtml()
  });
}

news.swiperSetting = function() {
  const swiperNews = new Swiper(".js-news-swiper", {
    loop: false,
    slidesPerView: "auto",
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
}