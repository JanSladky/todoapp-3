<template>
  <div class="container">
    <div class="extra-container">
      <todo-filtered></todo-filtered>
      <todo-clear-completed></todo-clear-completed>
    </div>  
    <div>
      
      <input type="text" autofocus class="todo-input" placeholder="Zadej úkol" v-model="newTodo" @keyup.enter="addTodo">
      <div v-if="$store.state.loading" class="lds-ripple"><div></div><div></div></div>
    </div>
        <!-- přidal jsem props :todo abych mohl posílat data z rodiče todolist do dítěte todoitem -->
        <!-- Zde poslouchám na emitnutý evetn z dítěte a pouštím jím normální funkci v rodiči -->
      <todo-item 
        v-for="todo in todosFiltered" 
        :key="todo.id" 
        :todo="todo" 
        :index="index" 
        :checkAll="!anyRemaining" 
      >
      </todo-item>
    <div class="extra-container remaining-wrap">
      <todo-check-all />
      <todo-items-remainig></todo-items-remainig>
    </div>
  </div>
</template>

<script>

import TodoItem from './TodoItem.vue'
import TodoItemsRemainig from './TodoItemsRemaining.vue'
import TodoCheckAll from './TodoCheckAll.vue'
import TodoClearCompleted from './TodoClearCompleted.vue'
import TodoFiltered from './TodoFiltered.vue'

export default {
  name: "todo-list",
  components: {
    TodoItem,
    TodoItemsRemainig,
    TodoCheckAll,
    TodoClearCompleted,
    TodoFiltered,
  },
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
        },
      ]
    };
  },
  /* Computed properties a methody jsou skoro to samé, computed properties můžeme napsat jako metody,  */
  created() {
    this.$store.dispatch('retrieveTodos')
  },
  computed: {
    remaining() {
      return this.$store.getters.remaining
    },
    anyRemaining() {
      return this.$store.getters.anyRemaining
    },
    todosFiltered() {
      return this.$store.getters.todosFiltered
    },
    showClearCompletedButton() {
      return this.$store.getters.showClearCompletedButton
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

        this.$store.dispatch('addTodo', {
            id: this.idForTodo,
            title: this.newTodo,
        })
        this.newTodo = ''
        this.idForTodo++
    },
    removeTodo(index) {
        //Metoda splice z pole todos, vezme index položky na kterou jsem kliknul, a 1 že chci vymazat jeden item
        this.$store.state.todos.splice(index, 1)
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
    /* to data mi reprezuntuje to co emituju z dítěte to index a todo, upraviji jeden prvek to je ta 1ka */
    finishedEdit(data) {
     
      this.$store.state.todos.splice(data.index, 1, data.todo) 
    },
    checkAllTodos(todo) {
      this.$store.state.todos.forEach((todo) => todo.completed = event.target.checked)
    },
    clearCompleted() {
      this.$store.state.todos = this.$store.state.todos.filter(todo => !todo.completed)
    }
  }
};
</script>

<style lang="scss">
  
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
    animation-duration: .4s;
    

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
    padding-top: 14px;
    margin-bottom: 14px;

    button {
      margin-right: 10px;

      .active {
        background: #3FB883;
      }
      &:hover {
        color: #fff;
      }
    }
  }

.extra-container.remaining-wrap {
  border-top: 1px solid lightgrey;
}

button {
  font-size: 14px;
  background-color: white;
  padding: 5px 10px;
  appearance: none;
  border-radius: 5px;
  &:hover {
    background: #3FB883;
  }
  &:focus {
    outline: none;
  }
}
.btn-filter {
  margin: 5px 5px;
 
  &:first-child {
    margin: 5px 5px 5px 0px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* alternativa k nastavení konkrétní animace */
/* .animate__fadeIn, .animate__fadeOut {
  --animate-duration: .5s;
} */


/* Spinner loader */
.lds-ripple {
  /* change color here */
  color: #42B883
}
.lds-ripple,
.lds-ripple div {
  box-sizing: border-box;
}
.lds-ripple {
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: auto;
  margin-bottom: 16px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid currentColor;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 8px;
    height: 8px;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 8px;
    height: 8px;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 8px;
    height: 8px;
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}
</style>
