const express = require('express');

const router = express.Router();

// 自行建立的 data
const data = [];

// GET 請求
router.get('/todo_data', (req, res) => {
  // 使用 res.send() 方法設置響應傳送 { success: true, data }
  // 使用 res.end() 方法結束響應
  // 這裏可以直接在 send() 後 .end() 也可以換行寫 res.end()
  // res.header('Access-Control-Allow-Origin', ['*']);
  res.send({ success: true, data }).end();
});

// POST 請求
router.post('/todo_data', (req, res) => {
  // req.body 是前端傳來的資料
  const newTask = {
    name: '',
    status: '',
    id: 0,
  };
  // 後端要處理新增 資料
  newTask.id = new Date().getTime();
  newTask.name = req.body.name;
  newTask.status = 'to-do';
  // 把資料加到 data 中
  data.push(newTask);
  // 傳響應告訴前端已新增成功
  // res.header('Access-Control-Allow-Origin', '*');
  res.send({ success: true, data }).end();
});

// put請求
router.put('/todo_data/:id', (req, res) => {
  // 首先通過 req.params.id 獲取傳入的 id
  const { id } = req.params;

  const task = data.find((item) => item.id === Number(id));

  if (!task) {
    // res.header('Access-Control-Allow-Origin', '*');
    res.send({ success: false, msg: 'Item ID not found!!!' }).end();
    return;
  }
  const modifiedProperties = req.body;
  Object.assign(task, modifiedProperties);
  // res.header('Access-Control-Allow-Origin', ['*']);
  res.send({ success: true, data }).end();
});

// DELETE 請求
router.delete('/todo_data/:id', (req, res) => {
  // 首先通過 req.params.id 獲取傳入的 id
  const { id } = req.params;
  // 然後遍歷 data 找出 id 符合的那筆資料 將它刪除
  const index = data.findIndex((item) => item.id === Number(id));
  // 最後傳送響應告訴前端已刪除成功
  if (index === -1) {
    res.send({ success: false, msg: 'Item ID not found!!!' }).end();
    return;
  }
  data.splice(index, 1);
  res.send({ success: true, data }).end();
});

/* GET home page. */
router.get('/getlist', (req, res) => {
  res.render('index', { title: 'Express Joshua' });
  console.log(data);
});

module.exports = router;
