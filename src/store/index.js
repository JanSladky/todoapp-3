import { createStore } from "vuex";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default createStore({
  state: {
    filter: "all",
    todos: [],
  },
  getters: {
    remaining(state) {
      return state.todos.filter((todo) => !todo.completed).length;
    },
    anyRemaining(state, getters) {
      return getters.remaining != 0;
    },
    todosFiltered(state) {
      if (state.filter == "all") {
        return state.todos;
      } else if (state.filter == "active") {
        return state.todos.filter((todo) => !todo.completed);
      } else if (state.filter == "completed") {
        return state.todos.filter((todo) => todo.completed);
      }
      return state.todos;
    },
    showClearCompletedButton(state) {
      return state.todos.filter((todo) => todo.completed).length > 0;
    },
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push({
        id: todo.id,
        title: todo.title,
        completed: false,
        editing: false,
      });
    },
    deleteTodo(state, id) {
      const index = state.todos.findIndex((item) => item.id == id);
      state.todos.splice(index, 1);
    },
    updateTodo(state, todo) {
      const index = state.todos.findIndex((item) => item.id == todo.id);
      state.todos.splice(index, 1, {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        editing: todo.editing,
      });
    },
    checkAll(state, checked) {
      state.todos.forEach((todo) => (todo.completed = checked));
    },
    updateFilter(state, filter) {
      state.filter = filter;
    },
    clearCompleted(state) {
      state.todos = state.todos.filter((todo) => !todo.completed);
    },
    retrieveTodos(state, todos) {
      state.todos = todos;
    },
  },
  actions: {
    async retrieveTodos(context) {
      const querySnapshot = await getDocs(collection(db, "todos")).then((querySnapshot) => {
        let tempTodos = [];
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          const data = {
            id: doc.id,
            title: doc.data().title,
            completed: doc.data().completed,
            timestamp: doc.data().timestamp,
          };
          tempTodos.push(data);
        });
        context.commit("retrieveTodos", tempTodos);
      });
    },
    addTodo(context, todo) {
      setTimeout(() => {
        context.commit("addTodo", todo);
      }, 100);
    },
    deleteTodo(context, id) {
      setTimeout(() => {
        context.commit("deleteTodo", id);
      }, 100);
    },
    updateTodo(context, todo) {
      setTimeout(() => {
        context.commit("updateTodo", todo);
      }, 100);
    },
    checkAll(context, checked) {
      setTimeout(() => {
        context.commit("checkAll", checked);
      }, 100);
    },
    updateFilter(context, filter) {
      setTimeout(() => {
        context.commit("updateFilter", filter);
      });
    },
    clearCompleted(context) {
      setTimeout(() => {
        context.commit("clearCompleted");
      }, 20);
    },
  },
  modules: {},
});
