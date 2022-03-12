"use strict";

function get_tasks(){
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if(tasks){

    let list_html = "";

    $.each(tasks, function(i, item){
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

    $("ul.task_list").html(list_html);
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

$(function(){

  // ******************* 從 localStorage 取得資料 ******************* //
  get_tasks();

  // ==== 待辦事項文字框的 focus 事件及 blur 事件觸發 ===== //
  $("input.task_name").on("focus", function(){
    $(this).closest("div.task_add_block").addClass("-on");
  });

  $("input.task_name").on("blur", function(){
    $(this).closest("div.task_add_block").removeClass("-on");
  });


  // ==== text 欄位新增待辦事項 ===== //
  $("input.task_name").on("keyup", function(e){
    //console.log( e.which );
    if(e.which == 13){
      $("button.task_add").click();
    }
  });

  // 按下新增按鈕
  $("button.task_add").on("click", function(){
    let task_text = $.trim($("input.task_name").val());

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

      $("ul.task_list").prepend(list_html);
      $("input.task_name").val("");


      // ******************* 儲存資料到 localStorage ******************* //
      let task = {
        "item_id": item_id,
        "name": task_text,
        "star": 0
      };
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      //console.log(tasks);

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
$(document).on("click", "button.btn_delete", function(e){
  //console.log(e);
  let r = confirm("確認移除？");

  if (r){
    // ******************* 從 localStorage 移除資料 ******************* //
    let item_id = $(this).closest("li").attr("data-id");
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    let updated_tasks = [];
    tasks.forEach(function(task, i){
      if(item_id != task.item_id){
        updated_tasks.push(task);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(updated_tasks));

    $(this).closest("li").addClass("fade_out");
    setTimeout(function(){
      //console.log(this); // window
      e.target.closest("li").remove();
    }, 1000);
  }

});

// ==== 清空待辦事項 ===== //
$("button.btn_empty").on("click", function(){
  let r = confirm("確認清空？")
  if (r){

    // ******************* 從 localStorage 移除資料 ******************* //
    localStorage.clear();

    $("ul.task_list").children("li").addClass("fade_out");
    setTimeout(function(){
      $("ul.task_list").html("");
    }, 1000);

  }
});

// ==== 更新待辦事項 ===== //
$(document).on("click", "button.btn_update", function(e){
  //console.log(this);

  if($(this).attr("data-edit") == undefined){ // 進入編輯狀態

    $(this).attr("data-edit", true);
    $(this).closest("li").find("p.para").toggleClass("-none");
    $(this).closest("li").find("input.task_name_update").toggleClass("-none");

  }else{
    let update_task_name = ($(this).closest("li").find("input.task_name_update").val()).trim();
    if(update_task_name == ""){
      alert("請輸入待辦事項");
    }else{
      $(this).closest("li").find("p.para").html(update_task_name).toggleClass("-none");
      $(this).closest("li").find("input.task_name_update").val(update_task_name).toggleClass("-none");
      $(this).removeAttr("data-edit");

      // ******************* 更新 localStorage 中，name 的資料 ******************* //

      let item_id = $(this).closest("li").attr("data-id");
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      $.each(tasks, function(i, task){
        if(item_id == task.item_id){
          tasks[i].name = update_task_name;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));

    }
  }
});

// ==== 排序 ===== //
// 往上
$(document).on("click", "button.btn_up", function(e){
  //console.log(this);
  //console.log( $(this).closest("li").is(":first-child") );

  if( !$(this).closest("li").is(":first-child") ){
    let li_el = $(this).closest("li");
    let item_id = $(li_el).attr("data-id");
    let clone_html = $(li_el).clone(); // <li>...</li>
    $(li_el).prev().before(clone_html);
    $(li_el).remove();

    // ******************* 更新 localStorage 中的排序 ******************* //
    items_sort(item_id, "up");
  }
});

// 往下
$(document).on("click", "button.btn_down", function(e){
  if(!$(this).closest("li").is(":last-child")){
    let li_el = $(this).closest("li");
    let item_id = $(li_el).attr("data-id");
    let clone_html = $(li_el).clone(); // <li>...</li>
    $(li_el).next().after(clone_html);
    $(li_el).remove();

    // ******************* 更新 localStorage 中的排序 ******************* //
    items_sort(item_id, "down");
  }
});

// ==== 星號的重要性 ===== //
$(document).on("click", "span.star", function(){
  //console.log(this);

  let current_star = parseInt($(this).attr("data-star"));
  let star_span = $(this).closest("div.star_block").find("span.star");
  //console.log(star_span);

  $.each(star_span, function(i, star_item){
    if( parseInt($(this).attr("data-star")) <= current_star ){
      $(this).addClass("-on");
    }else{
      $(this).removeClass("-on");
    }
  });

  // ******************* 更新 localStorage 中的 star 資料 ******************* //
  let item_id = $(this).closest("li").attr("data-id");
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  $.each(tasks, function(i, task){
    if(item_id == task.item_id){
      tasks[i].star = current_star;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));

});
