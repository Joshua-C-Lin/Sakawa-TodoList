<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <ToDoList msg="Joshua's To Do List " />
</template>

<script>
import ToDoList from './components/ToDoList.vue';

export default {
  name: 'App',
  components: {
    ToDoList,
  },
};
</script>
