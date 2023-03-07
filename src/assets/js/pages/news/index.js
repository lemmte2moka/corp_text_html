/**
 * 変数
*****************************************************/
let news = {}
news = {
  jsonPath: {}, // 取得用
  jsonData: {}, // 格納用
  jsonCurrentData: {}, // 絞り込み後のデータ格納用
  categorys: {
    'important': '重要なお知らせ',
    'corporate': '企業情報',
    'products': '商品情報',
  },
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

  news.elem.wrap = document.querySelector('.js-news')
  news.elem.list = document.querySelector('.js-news').querySelector('.js-news-list')
  news.elem.selectWrap = document.querySelector('.js-select')
  news.elem.selectList = document.querySelector('.js-select').querySelector('.js-select-list')
  news.jsonPath = '/assets/json/list.json'
  news.state.number = 10
  news.state.paged = 1
  news.state.offset = 0
  news.state.year = 'all'
  news.init()
  news.yearSelect()
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
      news.jsonData = JSON.parse(xhr.responseText).data
      news.jsonCurrentData = news.jsonData
      news.state.maxPaged = Math.ceil(news.jsonCurrentData.length / news.state.number)
      var _year = []
      for(let i = 0; i <  news.jsonCurrentData.length; i++) {
        _year.push(news.jsonData[i].create_date.slice(0,4));
      }
      var _yearList = _year.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
      news.state.yearList = _yearList
      
      news.generate()
      news.selectGenerate()
      news.allNumSet()
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
  const _h = news.elem.list.clientHeight
  if(_h <= 0) return
  news.elem.list.style.height = _h + 'px'
}

/*
  ニュースリスト生成
*/
news.generate = function () {
  news.reset()
  gsap.to(news.elem.list, {
    opacity: 0,
    duration: 0.1,
    onComplete: () => { 
      news.elem.list.innerHTML = ''
      for (let i = news.state.offset; i < news.jsonCurrentData.length; i++) {
        if(i >= (news.state.number * news.state.paged) || !news.jsonCurrentData[i]) break
        if(news.state.pageType === 'news') {
          news.elem.list.appendChild(news.listHtml(news.jsonCurrentData[i],'news'))
        } else {
          news.elem.list.appendChild(news.listHtml(news.jsonCurrentData[i],'other'))
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
  let _catText = ''

  _li.classList.add('p-news__item')
  _catText = news.categorys[_data.category]
  _catText = '<p class="p-news__tag">'+_catText+'</p>'
  _class = 'p-news__link'

  const _target = (_data.link_target === 'false' || _data.link_target === 'FALSE' || _data.link_target === 'internal')? '' : ' target="_blank"'

	const _inner = '\
    <a class="' +_class+ '" href="' +_data.link_url+ '"'+_target+'>\
      <p class="p-news__media"><img src="' +_data.thumbnail_img+ '" alt="' +_data.thumbnail_alt+ '" class="p-news__media-img"></p>\
      <div class="p-news__detail">\
        <div class="p-news__date-tag">\
          <p class="p-news__date">'+_data.create_date.slice(0,4)+'.'+_data.create_date.slice(5,7)+'.'+_data.create_date.slice(8,10)+'</p>\
          ' +_catText+ '\
        </div>\
        <p class="p-news__title">'+_data.title+'</p>\
      </div>\
    </a>\
  </li>'
  _li.innerHTML = _inner
  return _li
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