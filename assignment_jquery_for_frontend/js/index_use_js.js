"use strict";

function get_tasks(){
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if(tasks){

    let list_html = "";

    tasks.forEach(function(item, i){ // [{}, {}]

      list_html += `
        <li data-id="${item.item_id}">
          <div class="item_flex">
            <div class="left_block">
              <div class="btn_flex">
                <button type="button" class="btn_up">往上</button>
                <button type="button" class="btn_down">往下</button>
              </div>
            </div>
            <div class="middle_block">
              <div class="star_block">
                <span class="star${(item.star >= 1 ? " -on" : "")}" data-star="1"><i class="fas fa-star"></i></span>
                <span class="star${(item.star >= 2 ? " -on" : "")}" data-star="2"><i class="fas fa-star"></i></span>
                <span class="star${(item.star >= 3 ? " -on" : "")}" data-star="3"><i class="fas fa-star"></i></span>
                <span class="star${(item.star >= 4 ? " -on" : "")}" data-star="4"><i class="fas fa-star"></i></span>
                <span class="star${(item.star >= 5 ? " -on" : "")}" data-star="5"><i class="fas fa-star"></i></span>
              </div>
              <p class="para">${item.name}</p>
              <input type="text" class="task_name_update -none" placeholder="更新待辦事項…" value="${item.name}">
            </div>
            <div class="right_block">
              <div class="btn_flex">
                <button type="button" class="btn_update">更新</button>
                <button type="button" class="btn_delete">移除</button>
              </div>
            </div>
          </div>
        </li>
      `;

    });
    let ul_task_list = document.getElementsByClassName("task_list")[0];
    ul_task_list.innerHTML = list_html;

  }

}

// 更新 localStorage 中的排序
function items_sort(item_id, direction){

  let tasks = JSON.parse(localStorage.getItem("tasks"));

  // [{0}, {1}, {2}, {3}]
  // [{0}, {2}, {1}, {3}]
  if(direction == "up"){ // 往上
    let current_li_index; // 2
    let current_li_data;  // {2}
    let before_li_data;   // {1}

    tasks.forEach(function(task, i){
      if(item_id == task.item_id){
        current_li_index = i; // 取得點擊的那項 li 的索引值
        current_li_data = task; // 取得點擊到的那項 li 的資料
        before_li_data = tasks[i - 1]; // 取得點擊到的那項 li 的前一項資料
      }
    });

    tasks[current_li_index - 1] = current_li_data;
    tasks[current_li_index] = before_li_data;
  }

  // [{0}, {1}, {2}, {3}]
  // [{0}, {2}, {1}, {3}]
  if(direction == "down"){ // 往下
    let current_li_index; // 1
    let current_li_data;  // {1}
    let after_li_data;    // {2}

    tasks.forEach(function(task, i){
      if(item_id == task.item_id){
        current_li_index = i; // 取得點擊的那項 li 的索引值
        current_li_data = task; // 取得點擊到的那項 li 的資料
        after_li_data = tasks[i + 1]; // 取得點擊到的那項 li 的下一項資料
      }
    });

    tasks[current_li_index] = after_li_data;
    tasks[current_li_index + 1] = current_li_data;
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener("DOMContentLoaded", function(){

  // ******************* 從 localStorage 取得資料 ******************* //
  get_tasks();

  // ==== 待辦事項文字框的 focus 事件及 blur 事件觸發 ===== //
  var input_task_name = document.getElementsByClassName("task_name")[0];

  input_task_name.addEventListener("focus", function(){
    this.closest("div.task_add_block").classList.add("-on");
  });
  input_task_name.addEventListener("blur", function(){
    this.closest("div.task_add_block").classList.remove("-on");
  });


  // ==== text 欄位新增待辦事項 ===== //
  input_task_name.addEventListener("keyup", function(e){
    console.log( e.which );
    if(e.which == 13){
      let button_task_add = document.getElementsByClassName("task_add")[0];
      button_task_add.click();
    }
  });

  // 按下新增按鈕
  var button_task_add = document.getElementsByClassName("task_add")[0];
  button_task_add.addEventListener("click", function(){
    let task_text = (input_task_name.value).trim();
    // let task_text = input_task_name.value;

    if(task_text != ""){

      let item_id = Date.now(); // timestamp 當做該項的 id


      let list_html = `
        <li data-id="${item_id}">
          <div class="item_flex">
            <div class="left_block">
              <div class="btn_flex">
                <button type="button" class="btn_up">往上</button>
                <button type="button" class="btn_down">往下</button>
              </div>
            </div>
            <div class="middle_block">
              <div class="star_block">
                <span class="star" data-star="1"><i class="fas fa-star"></i></span>
                <span class="star" data-star="2"><i class="fas fa-star"></i></span>
                <span class="star" data-star="3"><i class="fas fa-star"></i></span>
                <span class="star" data-star="4"><i class="fas fa-star"></i></span>
                <span class="star" data-star="5"><i class="fas fa-star"></i></span>
              </div>
              <p class="para">` + task_text + `</p>
              <input type="text" class="task_name_update -none" placeholder="更新待辦事項…" value="${task_text}">
            </div>
            <div class="right_block">
              <div class="btn_flex">
                <button type="button" class="btn_update">更新</button>
                <button type="button" class="btn_delete">移除</button>
              </div>
            </div>
          </div>
        </li>
      `;

      let ul_task_list = document.getElementsByClassName("task_list")[0];
      ul_task_list.insertAdjacentHTML("afterbegin", list_html);
      input_task_name.value = "";


      // ******************* 儲存資料到 localStorage ******************* //
      let task = {
        "item_id": item_id,
        "name": task_text,
        "star": 0
      };
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      console.log(tasks);

      if(tasks){ // 若存在
        tasks.unshift(task); // [{}, {}]
      }else{ // 若不存在
        tasks = [task];
      }
      localStorage.setItem("tasks", JSON.stringify(tasks));

    }

  });
});


// ==== 移除待辦事項 ===== //
document.addEventListener("click", function(e){
  //console.log(e);
  //if(e.target.getAttribute("id") == "abc"){
  if(e.target.classList.contains("btn_delete")){
    let r = confirm("確認移除？");
    if (r){

      // ******************* 從 localStorage 移除資料 ******************* //
      let item_id = e.target.closest("li").getAttribute("data-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      let updated_tasks = [];
      tasks.forEach(function(task, i){
        if(item_id != task.item_id){
          updated_tasks.push(task);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(updated_tasks));

      e.target.closest("li").classList.add("fade_out");
      setTimeout(function(){
        e.target.closest("li").remove();
      }, 1000);
    }

  }
});

// ==== 清空待辦事項 ===== //
var button_btn_empty = document.getElementsByClassName("btn_empty")[0];
button_btn_empty.addEventListener("click", function(){
  let r = confirm("確認清空？")
  if (r){

    // ******************* 從 localStorage 移除資料 ******************* //
    localStorage.clear();


    let ul_task_list = document.getElementsByClassName("task_list")[0];
    for(let i = 0; i < ul_task_list.children.length; i++){
      ul_task_list.children[i].classList.add("fade_out");
    }
    setTimeout(function(){
      ul_task_list.innerHTML = "";
    }, 1000);

  }
});

// ==== 更新待辦事項 ===== //
document.addEventListener("click", function(e){
  if(e.target.classList.contains("btn_update")){

    let update_task_name = (e.target.closest("li").querySelector("input.task_name_update").value).trim();
    //console.log(update_task_name);
    if(update_task_name == ""){
      alert("請輸入待辦事項");
    }else{
      e.target.closest("li").querySelector("p.para").innerHTML = update_task_name;
      if(e.target.closest("li").querySelector("p.para").classList.contains("-none")){
        e.target.closest("li").querySelector("p.para").classList.remove("-none");
      }else{
        e.target.closest("li").querySelector("p.para").classList.add("-none");
      }

      e.target.closest("li").querySelector("input.task_name_update").value = update_task_name;
      if(e.target.closest("li").querySelector("input.task_name_update").classList.contains("-none")){
        e.target.closest("li").querySelector("input.task_name_update").classList.remove("-none");
      }else{
        e.target.closest("li").querySelector("input.task_name_update").classList.add("-none");
      }

      // ******************* 更新 localStorage 中，name 的資料 ******************* //

      let item_id = e.target.closest("li").getAttribute("data-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.forEach(function(task, i){
        if(item_id == task.item_id){
          tasks[i].name = update_task_name;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

    }

  }
});

// ==== 排序 ===== //
document.addEventListener("click", function(e){

  // 往上
  //console.log( e.target.closest("li").previousElementSibling );
  if(e.target.classList.contains("btn_up") && e.target.closest("li").previousElementSibling ){
    let li_el = e.target.closest("li");
    let item_id = li_el.getAttribute("data-id");
    let clone_html = li_el.outerHTML; // <li>...</li>
    li_el.previousElementSibling.insertAdjacentHTML("beforebegin", clone_html);
    li_el.remove();

    // ******************* 更新 localStorage 中的排序 ******************* //
    items_sort(item_id, "up");
  }


  // 往下
  if(e.target.classList.contains("btn_down") && e.target.closest("li").nextElementSibling){
    let li_el = e.target.closest("li");
    let item_id = li_el.getAttribute("data-id");
    let clone_html = li_el.outerHTML; // <li>...</li>
    li_el.nextElementSibling.insertAdjacentHTML("afterend", clone_html);
    li_el.remove();

    // ******************* 更新 localStorage 中的排序 ******************* //
    items_sort(item_id, "down");
  }

});

// ==== 星號的重要性 ===== //
document.addEventListener("click", function(e){

  //console.log(e.target);

  if(e.target.closest("span")){
    let span_el = e.target.closest("span");
    if(span_el.classList.contains("star")){

      let current_star = parseInt(span_el.getAttribute("data-star"));
      let star_span = span_el.closest("div.star_block").querySelectorAll("span.star");
      //console.log(star_span);
      // [span, span, span, span, span]
      star_span.forEach(function(star_item, i){

        if( parseInt(star_item.getAttribute("data-star")) <= current_star ){
          star_span[i].classList.add("-on");
        }else{
          star_span[i].classList.remove("-on");
        }

      });

      // ******************* 更新 localStorage 中的 star 資料 ******************* //
      let item_id = span_el.closest("li").getAttribute("data-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.forEach(function(task, i){
        if(item_id == task.item_id){
          tasks[i].star = current_star;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

    }
  }

});
