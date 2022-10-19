<template>
  <div class="joshua-todo-list">
    <h1>{{ msg }}</h1>
    <div class="container">
      <!-- 輸入框 -->
      <div class="d-flex">
        <input
          v-model.trim="task"
          type="text"
          placeholder="Enter Task Here"
          class="form-control"
        />
        <button @click="submitTask" class="btn btn-warning rounded-20">
          Submit
        </button>
      </div>

      <!-- 任務表 -->
      <table class="table table-bordered mt-5">
        <thead>
          <tr>
            <th scope="col">Task</th>
            <th scope="col">Status</th>
            <th scope="col" class="text-center">Edit</th>
            <th scope="col" class="text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tasks" :key="index">
            <td>
              <div :class="{ 'done-txt': item.status === 'done' }">
                {{ item.name }}
              </div>
              <transition name="bounce">
                <div v-if="item.id === displayIndex">
                  <input v-model="editInput" />
                  <button
                    @click="submitEdit(index)"
                    class="btn btn-primary rounded-20"
                    style="margin: 10px"
                  >
                    OK
                  </button>
                  <button
                    @click="cancelEdit(index)"
                    class="btn btn-danger rounded-20"
                  >
                    Cancel
                  </button>
                </div>
              </transition>
            </td>
            <td
              class="pointer"
              @click="changeStatus(index)"
              :class="{
                'text-danger': item.status === 'to-do',
                'text-warning': item.status === 'in-progress',
                'text-success': item.status === 'done',
              }"
            >
              <span>
                {{ firstCharUpper(item.status) }}
              </span>
            </td>
            <td class="btn-mid">
              <div class="text-center btn-pointer" @click="editTask(index)">
                <span class="fa fa-pen"></span>
              </div>
            </td>
            <td class="btn-mid">
              <div class="text-center btn-pointer" @click="deleteTask(index)">
                <span class="fa fa-trash"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToDoList",
  props: {
    msg: String,
  },
  data() {
    return {
      task: "",
      editInput: "",
      availableStatuses: ["to-do", "in-progress", "done"],
      tasks: [],
      isEditShow: false,
      displayIndex: -1,
    };
  },
  mounted() {
    this.axios
      .get("/api/api/todo_data")
      .then((res) => {
        console.log("API來的資料", res.data);
        this.tasks = res.data.data;
      })
      .catch(() => {
        console.log("GET請求失敗");
      });
    console.log("mounted");
  },
  methods: {
    // 創建任務事件
    submitTask() {
      // 如果輸入框為空白
      if (this.task.length === 0) {
        alert("Please Enter A Task !!! 🙏");
        return;
      }
      this.axios
        .post("/api/api/todo_data", { name: this.task })
        .then((res) => {
          this.tasks = res.data.data;
          console.log(res);
        })
        .catch(() => {
          console.log("POST請求失敗");
        });
      this.task = "";
    },

    // 移除任務事件
    deleteTask(index) {
      const task = this.tasks[index];
      const { id } = task;
      this.axios
        .delete(`/api/api/todo_data/${id}`)
        .then((res) => {
          this.tasks = res.data.data;
        })
        .catch(() => {
          console.log("DELETE請求失敗");
        });
    },

    // 編輯任務按鈕
    editTask(index) {
      this.displayIndex = this.tasks[index].id;
    },

    // 送出編輯按鈕
    submitEdit(index) {
      const task = this.tasks[index];
      task.isEditShow = false;
      if (task.name === this.editInput || this.editInput === "") {
      } else {
        const { id } = task;
        this.axios
          .put(`/api/api/todo_data/${id}`, { name: this.editInput })
          .then((res) => {
            this.tasks = res.data.data;
            console.log(res);
          })
          .catch(() => {
            console.log("PUT請求失敗");
          });
      }
      this.displayIndex = !this.tasks[index].id;
      this.editInput = "";
    },

    // 取消編輯
    cancelEdit(index) {
      this.displayIndex = !this.tasks[index].id;
    },
    // 編輯任務狀態事件
    changeStatus(index) {
      // 指向當前點擊的任務
      const task = this.tasks[index];
      console.log("Task是", task);
      // 總共需迭代的數值
      let statusIndex = this.availableStatuses.indexOf(task.status);

      // 三個狀態迭代
      // eslint-disable-next-line no-multi-assign
      const newStatusIndex = (statusIndex += 1);
      if (newStatusIndex > this.availableStatuses.length-1) statusIndex = 0;
      const { id } = task;
      this.axios
        .put(`/api/api/todo_data/${id}`, {
          status: this.availableStatuses[statusIndex],
        })
        .then((res) => {
          this.tasks = res.data.data;
        })
        .catch(() => {
          console.log("PUT請求失敗");
        });
    },

    // 首字母大寫
    firstCharUpper(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.d-flex {
  justify-content: space-between;
}

.form-control {
  width: 90%;
}

.pointer {
  cursor: pointer;
  width: 160px;
  vertical-align: middle;
}

.done-txt {
  text-decoration: line-through;
}

.btn-pointer {
  cursor: pointer;
  width: 22px;
  margin: 0 auto;
}

.btn-mid {
  vertical-align: middle;
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
