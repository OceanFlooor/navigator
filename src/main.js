/**
 * Created by 83617 on 2020/7/21.
 */
let hashMap = JSON.parse(localStorage.getItem("ravenMap")) || []
let collection = $(".collection")
let add = $("#add")
let search = $(".search-icon")
let searchInput = $("#search-input")
let backdrop = $(".backdrop")
let item = collection.find(".item-container:not(#add)")

render()

add.on("click", (e) => {
  e.stopPropagation()
  let url = window.prompt("请输入添加的网址")
  if (url) {
    hashMap.push(handleUrl(url))
    setStorage()
    render()
  }
})

// 事件代理collection
collection.on("click", (e) => {
  // console.dir(e.target)
  let el = e.target
  if (el === e.currentTarget) return

  while (el && el.dataset && el.dataset.idx === undefined) {
    if (el === e.currentTarget) {
      el = null
      break
    }
    el = el.parentNode
  }
  let idx = el.dataset.idx
  idx && openUrl(hashMap[idx].url)
})

$(".more").on("click", (e) => {
  e.stopPropagation()

  let el = e.target
  while (el && el.dataset && el.dataset.idx === undefined) {
    el = el.parentNode
  }
  let idx = el.dataset.idx

  backdrop.removeClass("dis-none")
  handleDialog(idx)
})

search.on("click", (e) => {
  let searchVal = searchInput.val()

  searchVal.length &&
    $(location).attr("href", `https://cn.bing.com/search?q=${searchVal}`)
})

function handleUrl(url) {
  let userEnter = url
  if (!url.match(/^(http:\/\/)|(https:\/\/)/)) {
    url = "https://" + url
  }
  let domain = url.match(/(?<=(\/\/))[\.\w]*/)[0]
  console.log("输入域名:" + domain)
  return { url, userEnter, domain }
}

function render() {
  let html = ""
  hashMap.map((item, idx) => {
    html += `
    <div class="item-container" data-idx="${idx}">
      <div class="inner">
        <div class="mini-logo">${item.domain[0].toUpperCase()}</div>
        <div class="title">
          <span>${item.domain}</span>
        </div>
      </div>
      <div class="more" data-idx="${idx}">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-more"></use>
        </svg>
      </div>
    </div>
    `
  })

  item.remove()
  $(html).insertBefore(add)
  item = collection.find(".item-container:not(#add)")
}

function handleDialog(idx) {
  let inputSite = $("#inputSite")
  let finish = $(".finish")
  let deleteBtn = $(".delete")
  let hashItem = hashMap[idx]

  inputSite.val(hashItem.url)
  !inputSite.val().length && finish.attr("disabled", "disabled")

  // cancel
  $(".cancel").on("click", () => {
    backdrop.addClass("dis-none")
  })

  inputSite.on("input", (e) => {
    inputSite.val().length
      ? finish.removeAttr("disabled")
      : finish.attr("disabled", "disabled")
  })

  // finish
  finish.on("click", () => {
    hashMap[idx] = handleUrl(inputSite.val())
    backdrop.addClass("dis-none")
    setStorage()
    render()
  })

  deleteBtn.on("click", () => {
    hashMap.splice(idx, 1)
    backdrop.addClass("dis-none")
    setStorage()
    render()
  })
}

function openUrl(url) {
  $(location).attr("href", url)
}

function setStorage() {
  localStorage.setItem("ravenMap", JSON.stringify(hashMap))
}

;(function () {
  let timer
  item.on("touchstart", (e) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      backdrop.removeClass("dis-none")

      let el = e.target
      while (el && el.dataset && el.dataset.idx === undefined) {
        el = el.parentNode
      }
      let idx = el.dataset.idx

      handleDialog(idx)
    }, 500)
  })

  item.on("touchmove", () => {
    clearTimeout(timer)
  })

  item.on("touchend", () => {
    clearTimeout(timer)
  })
})()
