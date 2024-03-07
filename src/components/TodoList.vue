<template>
  <div class="container">
    <div class="extra-container">
      <div>
        <!-- :class je condition class ta funguje s nastaveným filtrem což je data property -->
        <button class="btn-filter" :class="{ active: filter == 'all'}" @click="filter = 'all'"> vše</button>
        <button class="btn-filter" :class="{ active: filter == 'active'}" @click="filter = 'active'"> aktivní</button>
        <button class="btn-filter" :class="{ active: filter == 'completed'}" @click="filter = 'completed'"> hotové</button>
      </div>
      <div>
        <transition name="fade">
          <button v-if="showClearCompletedButton" @click="clearCompleted">Clear completed</button>
        </transition>
      </div>
    </div>  
    <div>
      <input type="text" v-focus class="todo-input" placeholder="Zadej úkol" v-model="newTodo" @keyup.enter="addTodo">
    </div>

    <transition-group name="fade" enter-active-class="animate__animated animate__fadeInUp" leave-active-class="animate__animated animate__fadeOut">
        <!-- přidal jsem props :todo abych mohl posílat data z rodiče todolist do dítěte todoitem -->
        <!-- Zde poslouchám na emitnutý evetn z dítěte a pouštím jím normální funkci v rodiči -->
      <todo-item v-for="(todo, index) in todosFiltered" :key="todo.id" :todo="todo" :index="index" :checkAll="!anyRemaining" @removedTodo="removeTodo" @finishedEdit="finishedEdit">
       
      </todo-item>
    </transition-group>

    <div class="extra-container remaining-wrap">
      <!-- Přidání další computed properties !anyRemaining -->
      <!-- Přidání eventu @change kvůli možnosti zaškrnout vše checkboxem -->
      <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos">Označit vše</label></div>
      <!-- Remaining je property a musím ji přidat do stavu-->
      <div>{{ remaining }} zbývá</div>
    </div>
  </div>
</template>

<script>

import TodoItem from './TodoItem.vue'

export default {
  name: "todo-list",
  components: {
    TodoItem
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
  computed: {
    remaining() {
      return this.$store.state.todos.filter(todo => !todo.completed).length
    },
    anyRemaining() {
      return this.remaining != 0
    },
    todosFiltered() {
      if(this.$store.state.filter == 'all') {
        return this.$store.state.todos
      } else if(this.$store.state.filter == 'active') {
        return this.$store.state.todos.filter(todo => !todo.completed)
      } else if(this.$store.state.filter == 'completed') {
        return this.$store.state.todos.filter(todo => todo.completed)
      }
      return this.$store.state.todos
    },
    showClearCompletedButton() {
      return this.$store.state.todos.filter(todo => todo.completed).length > 0
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

        this.$store.state.todos.push({
            id: this.idForTodo,
            title: this.newTodo,
            completed: false,

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
    background: lightgreen;
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
.active {
  background: lightgreen;
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
</style>
