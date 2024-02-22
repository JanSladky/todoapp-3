<template>
  <div><input type="text" class="todo-input" placeholder="Zadej úkol" v-model="newTodo" @keyup.enter="addTodo"></div>
  <div v-for="(todo, index) in todos" :key="todo.id" class="todo-item">
    <div class="todo-item-left">
        <div class="todo-item-label" v-if="!todo.editing" @dblclick="editTodo(todo)">
            {{todo.title}}
        </div>
        <input type="text" v-else v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" class="todo-item-edit" v-focus>
    </div>
        
    <div class="remove-item" @click="removeTodo(index)">
        &times;
    </div>
  </div>
</template>

<script>
export default {
  name: "todo-list",
  data() {
    return {
      newTodo: "",
      idForTodo: 3,
      beforeEditCache: '',
      todos: [
        {
          'id': 1,
          'title': 'Dokonči vue kurz',
          'completed': false,
          'editing': false
        },
        {
          'id': 2,
          'title': 'Vyluxovat',
          'completed': true,
          'editing': false
        },
        {
          'id': 3,
          'title': 'Umýt okna',
          'completed': false,
          'editing': false
        }

      ],
    };
  },
  directives: {
    focus: {
        mounted: (el) => el.focus()
    } 
           
        },
  methods: {
    addTodo() {
        // Přidání kontroly že je řetězec prázdný tak nepřidávat novou položku
        if(this.newTodo.trim().length == 0) {
            return
        }

        this.todos.push({
            id: this.idForTodo,
            title: this.newTodo,
            completed: false,

        })
        this.newTodo = ''
        this.idForTodo++
    },
    removeTodo(index) {
        //Metoda splice z pole todos, vezme index položky na kterou jsem kliknul, a 1 že chci vymazat jeden item
        this.todos.splice(index, 1)
    },
    editTodo(todo) {
        this.beforeEditCache = todo.title
        todo.editing = true
    },
    doneEdit(todo) {
        if(todo.title.trim() == '') {
          todo.title = this.beforeEditCache
        }
        todo.editing = false
    },
    cancelEdit(todo) {
      todo.title = this.beforeEditCache
      todo.editing = false
    }
  }
};
</script>

<style lang="scss" scoped>
* {
    font-size: 20px;
}
.todo-input {
  border: 3px solid #3fb883;
  border-radius: 5px;
  //height: 40px;
  width: 100%;
  outline: 0;
  padding: 10px 20px;
height: 60px;
}
.todo-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0px;
    

}
.remove-item {
    color: #D70009;
    cursor: pointer;
}
.todo-item-left {
    display: flex;
    align-items: center;
}
.todo-item-label {
    padding: 10px;
    border: 1px solid white;
    margin-left: 12px;
}
.todo-item-edit {
    padding: 18px;
    outline: 0;
     border: 3px solid #3fb883;
    border-radius: 5px;
    height: 60px;
    width: 100%;
    margin-left: 12px;
}
</style>
