
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
    if ($(task_text) != "") {
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
                    <p class="para">`+ $(task_text) + `</p>
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
      $(".task_name").val() = "";

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