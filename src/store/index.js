import { createStore } from 'vuex'

export default createStore({
  state: {
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
  },
  getters: {
    remaining(state) {
      return state.todos.filter(todo => !todo.completed).length
    },
    anyRemaining(state, getters) {
      return getters.remaining != 0
    },
    todosFiltered(state) {
      if(state.filter == 'all') {
        return state.todos
      } else if(state.filter == 'active') {
        return state.todos.filter(todo => !todo.completed)
      } else if(state.filter == 'completed') {
        return state.todos.filter(todo => todo.completed)
      }
      return this.$store.state.todos
    },
    showClearCompletedButton(state) {
      return this.$store.state.todos.filter(todo => todo.completed).length > 0
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
