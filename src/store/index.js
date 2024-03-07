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
      }

    ],
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
