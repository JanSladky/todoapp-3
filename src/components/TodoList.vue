<template>
  <div><input type="text" class="todo-input" placeholder="Zadej úkol" v-model="newTodo" /></div>
</template>

<script>
export default {
  name: "todo-list",
  data() {
    return {
      newTodo: "",
      todos: [
        {
          'id': 1,
          'title': 'Dokonči vue kurz',
          'completed': false,
        },
        {
          'id': 2,
          'title': 'Vyluxovat',
          'completed': true,
        },
        {
          'id': 3,
          'title': 'Umýt okna',
          'completed': false,
        }

      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.todo-input {
  border: 3px solid #3fb883;
  border-radius: 5px;
  height: 40px;
  width: 100%;
  outline: 0;
}
</style>
