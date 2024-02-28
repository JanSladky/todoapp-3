<template>
  <div><input type="text" class="todo-input" placeholder="Zadej úkol" v-model="newTodo" @keyup.enter="addTodo"></div>
  <div v-for="(todo, index) in todosFiltered" :key="todo.id" class="todo-item">
    <div class="todo-item-left">
        <input type="checkbox" v-model="todo.completed">
        <div class="todo-item-label" v-if="!todo.editing" @dblclick="editTodo(todo)" :class="{ completed : todo.completed}">
            {{todo.title}}
        </div>
        <input type="text" v-else v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" class="todo-item-edit" v-focus>
    </div>
        
    <div class="remove-item" @click="removeTodo(index)">
        &times;
    </div>
  </div>
  <div class="extra-container">
    <!-- Přidání další computed properties !anyRemaining -->
    <!-- Přidání eventu @change kvůli možnosti zaškrnout vše checkboxem -->
    <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos">Označit vše</label></div>
    <!-- Remaining je property a musím ji přidat do stavu-->
    <div>{{ remaining }} zbývá</div>
  </div>
  <div class="extra-container">
    <div>
      <!-- :class je condition class ta funguje s nastaveným filtrem což je data property -->
      <button :class="{ active: filter == 'all'}" @click="filter = 'all'"> vše</button>
      <button :class="{ active: filter == 'active'}" @click="filter = 'active'"> aktivní</button>
      <button :class="{ active: filter == 'completed'}" @click="filter = 'completed'"> hotové</button>
    </div>
    <div>

    <button v-if="showClearCompletedButton" @click="clearCompleted">Clear completed</button>
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
      filter: 'all',

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
  /* Computed properties a methody jsou skoro to samé, computed properties můžeme napsat jako metody,  */
  computed: {
    remaining() {
      return this.todos.filter(todo => !todo.completed).length
    },
    anyRemaining() {
      return this.remaining != 0
    },
    todosFiltered() {
      if(this.filter == 'all') {
        return this.todos
      } else if(this.filter == 'active') {
        return this.todos.filter(todo => !todo.completed)
      } else if(this.filter == 'completed') {
        return this.todos.filter(todo => todo.completed)
      }
      return this.todos
    },
    showClearCompletedButton() {
      return this.todos.filter(todo => todo.completed).length > 0
    }
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
    },
    checkAllTodos(todo) {
      this.todos.forEach((todo) => todo.completed = event.target.checked)
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
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
.completed {
  text-decoration: line-through;
  color: grey;
  cursor: pointer;
}
.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;

}
button {
  font-size: 14px;
  background-color: white;
  appearance: none;
  &:hover {
    background: lightgreen;
  }
  &:focus {
    outline: none;
  }
}
.active {
  background: lightgreen;
} 
</style>
