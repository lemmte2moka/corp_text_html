/**
 * 変数
*****************************************************/
let pagenation = {}
pagenation = {
  state: {
    number: 4, // 表示件数
    numberSP: 3, // 表示件数 SP用
    dot: true, // ドットを表示するかどうか
    sp: (window.innerWidth <= 768)? true : false, // SPかどうか
  },
  elem: {
    wrap: document.querySelectorAll('.js-pagenation'), // pagenationエリア
    head: document.querySelector('.c-select'),
    btns: {}
  },
}

/*****************************************************
 * 処理
*****************************************************/
// 読み込み時実行
document.addEventListener("DOMContentLoaded", function () {
  // pagenation.init()
})
window.addEventListener("resize", function () {
	pagenation.resize();
});

/*****************************************************
* 関数
*****************************************************/

/*
 init
*/
pagenation.init = function () {
  if(!document.querySelector('.js-pagenation')) return
  pagenation.set()
  pagenation.update()
  pagenation.eventSet()
  pagenation.numHtml()
  pagenation.disabled()
}

/*
 set
*/
pagenation.set = function () { 
  pagenation.elem.btns = {}
  const _wrap = document.querySelector('.js-pagenation')
  pagenation.elem.btns['prev'] = _wrap.querySelector('.js-pagenation-prev')
  pagenation.elem.btns['next'] = _wrap.querySelector('.js-pagenation-next')
  pagenation.elem.btns['list'] = _wrap.querySelector('.js-pagenation-list')
  pagenation.elem.btns['paged'] = _wrap.querySelectorAll('.js-pagenation-paged')
}

/*
 event
*/
pagenation.eventSet = function () {
  // prev
  pagenation.elem.btns['prev'].querySelector('a').addEventListener("click", function (e) {
    e.preventDefault()
    pagenation.prevnext('prev')
  })
  // next
  pagenation.elem.btns['next'].querySelector('a').addEventListener("click", function (e) {
    e.preventDefault()
    pagenation.prevnext('next')
  })
}
pagenation.eventSetUpdate = function () {
  // page
  for(let i = 0; i < pagenation.elem.btns['paged'].length; i++) {
    pagenation.elem.btns['paged'][i].addEventListener("click", function (e) {
      e.preventDefault()
      pagenation.paged(e)
      return false
    })
  }
}

/*
 prev next
*/
pagenation.prevnext = function (_type) {
  if(_type === 'prev'){
    news.state.paged --
  } else {
    news.state.paged ++
  }
  news.state.offset = news.state.number * (news.state.paged - 1)
  news.generate()
  pagenation.update()
  pagenation.disabled()
  pagenation.numHtml()
  pagenation.scrollTo()
}

/*
 prev next disabled
*/
pagenation.disabled = function () {
  pagenation.elem.btns['next'].classList.remove('is-none')
  pagenation.elem.btns['prev'].classList.remove('is-none')
  if(news.state.paged === 1){
    pagenation.elem.btns['prev'].classList.add('is-disabled')
    if(news.state.maxPaged === 1){
      pagenation.elem.btns['next'].classList.add('is-none')
      pagenation.elem.btns['prev'].classList.add('is-none')
    } else {
      pagenation.elem.btns['next'].classList.remove('is-disabled')
    }
  } else if (news.state.paged === news.state.maxPaged){
    if(news.state.maxPaged !== 1){
      pagenation.elem.btns['prev'].classList.remove('is-disabled')
    }
    pagenation.elem.btns['next'].classList.add('is-disabled')
  } else {
    pagenation.elem.btns['prev'].classList.remove('is-disabled')
    pagenation.elem.btns['next'].classList.remove('is-disabled')
  }
}

/*
 paged
*/
pagenation.paged = function (e) {
  news.state.paged = Number(e.target.innerText)
  news.state.offset = news.state.number * (news.state.paged - 1)
  news.generate()
  pagenation.disabled()
  pagenation.update()
  pagenation.numHtml()
  pagenation.scrollTo()
}

/*
 ページャー更新
*/
pagenation.update = function () {

  const _paged = news.state.paged
  const _maxPaged = Math.ceil(news.jsonCurrentData.length / news.state.number)
  const _dotNumber = (pagenation.state.dot)? 2:0

  pagenation.elem.btns['list'].innerHTML = ''
  pagenation.state.number = 4
  // i = 表示する数 (pagenation.state.number) + ドット数(2) + 1
  for (let i = 1; i < (pagenation.state.number + _dotNumber + 2); i++) {

    // first（1）1を表示させる(常に表示)
    if(i === 1){
      pagenation.elem.btns['list'].appendChild(pagenation.linkHtml(i))
      continue
    }

    // ドット形成
    if(pagenation.state.sp) { // SP 4以上MAX値-3より下でドットを形成
      if(i === 2 && _paged >= pagenation.state.numberSP && _maxPaged > pagenation.state.numberSP + 1 //２番目の dot
        || i === (pagenation.state.numberSP + 1) && _paged < pagenation.state.numberSP && _maxPaged > pagenation.state.numberSP + 1 //4番目の dot
        || i === (pagenation.state.numberSP + 2) && _paged < (_maxPaged - _dotNumber) && _paged >= pagenation.state.numberSP //5番目の dot
        ){
        pagenation.elem.btns['list'].appendChild(pagenation.dotHtml())
        continue
      }
    } else { // PC 6以上MAX値-4より下でドットを形成
      if(i === 2 && _paged >= pagenation.state.number && _maxPaged > pagenation.state.number + 1 //２番目の dot
        || i === (pagenation.state.number + 1) && _paged < pagenation.state.number && _maxPaged > pagenation.state.number + 1 //5番目の dot
        || i === (pagenation.state.number + 2) && _paged >= pagenation.state.number && _paged < (_maxPaged - 3)){ //7番目の dot
        pagenation.elem.btns['list'].appendChild(pagenation.dotHtml())
        continue
      }
    }

    if(_maxPaged <= i - 1 && _maxPaged <= pagenation.state.number + 1 && !pagenation.state.sp) break
    if(_maxPaged <= i - 1 && _maxPaged <= pagenation.state.numberSP && pagenation.state.sp) break

    // 数字リンク形成
    if(i >= 2 && i <= (pagenation.state.number + 1)){
      let _num = 0
      if(pagenation.state.sp) { // SP
        if(_paged <= pagenation.state.numberSP && _maxPaged <= pagenation.state.numberSP) {
          _num = i 
        
        } else if(_paged >= (_maxPaged - _dotNumber) && _maxPaged > pagenation.state.numberSP) {  //最後3つ
          if(_paged > (_maxPaged - pagenation.state.numberSP) && i < pagenation.state.numberSP + 1) continue
          _num = _maxPaged - (pagenation.state.number - i) - _dotNumber

        } else if(_paged >= pagenation.state.numberSP && _paged < (_maxPaged - _dotNumber) && _maxPaged > pagenation.state.number) {  //真中２つ
          _num = _paged + (i - (pagenation.state.number - _dotNumber) - 1)

        } else{  //最初３つ
          if(_paged <= pagenation.state.numberSP && i > pagenation.state.numberSP ) continue
          _num = i 

        }
      } else { // PC
        // _paged = 1,2,3の時の挙動
        if(_paged <= pagenation.state.number && _maxPaged <= pagenation.state.number) {
          _num = i
          // _paged = maxPaged~maxPaged - 3の時の挙動
        } else if(_paged >= (_maxPaged - (pagenation.state.number - 1)) && _maxPaged > pagenation.state.number + 1) { //最後の４つ
          if(_paged >= (_maxPaged - (pagenation.state.number - 2)) && i < 2) continue
          _num = _maxPaged - (pagenation.state.number - i) - _dotNumber
          
          // _paged = 4~maxPaged - 3の時の挙動
        } else if(_paged >= pagenation.state.number && _paged < (_maxPaged - 3) && _maxPaged > pagenation.state.number) {
          _num = _paged + (i - (pagenation.state.number - 1))
          
        } else{  //最初4つ
          if(_paged <= pagenation.state.number + 1 && i < pagenation.state.number + _dotNumber + 1 && i > pagenation.state.number + 1 ) continue
          _num = i

        }
      }
      pagenation.elem.btns['list'].appendChild(pagenation.linkHtml(_num))
      continue
    }

    // last（max）max値を表示させる(常に表示)
    if(i === (pagenation.state.number + _dotNumber + 1)){
      pagenation.elem.btns['list'].appendChild(pagenation.linkHtml(_maxPaged))
    }
    
  }
  pagenation.set()
  pagenation.eventSetUpdate()
}

/*
 html成形
*/
pagenation.linkHtml = function (_num) {
  const _active = (_num === news.state.paged)? 'is-active ': ''
  const _li = document.createElement("li")
  _li.classList.add('c-pager__item')
  const _a = '<a href="#" class="' +_active+ 'c-pager__num js-pagenation-paged">' +_num+ '</a>'
  _li.innerHTML = _a
  return _li
}
pagenation.dotHtml = function () {
  const _li = document.createElement("li")
  _li.classList.add('c-pager__item')
  const _a = '<a href="#" class="c-pager__dot dot">...</a>'
  _li.innerHTML = _a
  return _li
}

/*
 件数表示
*/
pagenation.numHtml = function() {
  let _numFirst = document.querySelector(".js-num-first")
  let _numEnd = document.querySelector(".js-num-end")
  _numFirst.textContent = ''
  _numEnd.textContent = ''

  _numFirst.textContent = (news.state.paged * 10) - 9
  if(news.state.paged * 10 > news.jsonCurrentData.length) {
    _numEnd.textContent = news.jsonCurrentData.length
  } else {
    _numEnd.textContent = (news.state.paged * 10)
  }
}


/*
 scrollTo
*/
pagenation.scrollTo = function () {
  const _clientRect = pagenation.elem.head.getBoundingClientRect()
  const _y = window.pageYOffset + _clientRect.bottom
  window.scrollTo({
    top: _y,
    left: 0,
    behavior: 'smooth'
  })
}

/*
 resize
*/
pagenation.resize = function () {
  pagenation.state.sp = (window.innerWidth <= 768)? true : false
}