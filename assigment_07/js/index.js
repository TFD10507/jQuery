

function get_tasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  // console.log(tasks);
  if (tasks != null) {
    let list_html = "";
    $.each(tasks, function (index, values) { // [{}, {}]
      // console.log(values.name);
      list_html += `
        <li data-id="${values.item_id}">
          <div class="item_flex">
            <div class="left_block">
              <div class="btn_flex">
                <button type="button" class="btn_up">往上</button>
                <button type="button" class="btn_down">往下</button>
              </div>
            </div>
            <div class="middle_block">
              <div class="star_block">
                <span class="star${(values.star >= 1 ? " -on" : "")}" data-star="1"><i class="fas fa-star"></i></span>
                <span class="star${(values.star >= 2 ? " -on" : "")}" data-star="2"><i class="fas fa-star"></i></span>
                <span class="star${(values.star >= 3 ? " -on" : "")}" data-star="3"><i class="fas fa-star"></i></span>
                <span class="star${(values.star >= 4 ? " -on" : "")}" data-star="4"><i class="fas fa-star"></i></span>
                <span class="star${(values.star >= 5 ? " -on" : "")}" data-star="5"><i class="fas fa-star"></i></span>
              </div>
              <p class="para">${values.name}</p>
              <input type="text" class="task_name_update -none" placeholder="更新待辦事項…" value="${values.name}">
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
    // let task_list = document.getElementsByClassName("task_list")[0];
    // task_list.innerHTML = list_html;
    $(".task_list").prepend(list_html);
    // task_list.insertAdjacentHTML("afterbegin", list_html);
  }
}


// 更新 localStorage 中的排序
function items_sort(item_id, direction) {

  let tasks = JSON.parse(localStorage.getItem("tasks"));

  // [{0}, {1}, {2}, {3}]
  // [{0}, {2}, {1}, {3}]
  if (direction == "up") { // 往上
    let current_li_index; // 2
    let current_li_data;  // {2}
    let before_li_data;   // {1}

    tasks.forEach(function (task, i) {
      if (item_id == task.item_id) {
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
  if (direction == "down") { // 往下
    let current_li_index; // 1
    let current_li_data;  // {1}
    let after_li_data;    // {2}

    tasks.forEach(function (task, i) {
      if (item_id == task.item_id) {
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

$(function () {
  get_tasks();
});



// ==== 待辦事項文字框的 focus 事件及 blur 事件觸發 ===== //
$(function () {
  $(".task_name").focus(function () {
    // console.log("e");
    $(this).closest(".task_add_block").addClass("-on");
  });
  $(".task_name").blur(function () {
    $(this).closest(".task_add_block").removeClass("-on");
  });

  $(".task_name").keydown(function (e) {
    if (e.which == 13) {
      $(".task_add").click();
    }
  });

  $(".task_add").on("click", function () {
    let task_text = $(".task_name").val().trim();
    // localStorage.setItem('task_text', task_text);
    // console.log(task_text);
    // 儲存到 localStorage
    let item_id = Date.now(); // timestamp 當做該項的 id
    if (task_text != "") {
      let list_html = `
                <li data-id = "${item_id}"">
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
                    <p class="para">`+ task_text + `</p>
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
      $(".task_list").prepend(list_html);
      $(".task_name").val("");

      // 為抓取資料而命名
      let task = {
        "item_id": item_id,
        "name": task_text, // 新增的待辦事項文字
        "star": 0 // 預設 0
      };
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      if (tasks) { // 若存在
        tasks.unshift(task);
      } else { // 若不存在
        tasks = [task];
      }
      // 儲存到資料庫
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  });
});


// 綁定移除鍵
$(document).on("click", ".btn_delete", function (e) {
  let r = confirm("確認移除？");
  if (r) {
    // 從localstorage移除資料
    let closest_li = $(this).closest("li");
    let item_id = closest_li.attr("data-id");
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    // 準備用來放要存到 localStorage 裡的資料
    let updated_tasks = [];
    $.each(tasks, function (index, values) {
      if (item_id != values.item_id) {
        updated_tasks.push(tasks);
      }
    });

    // 回存至 localStorage
    localStorage.setItem("tasks", JSON.stringify(updated_tasks));

    closest_li.addClass("fade_out");
    setTimeout(function () {
      closest_li.remove();
    }, 1000);
  }

});

