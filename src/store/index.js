import { createStore } from "vuex";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, query, updateDoc, where } from "firebase/firestore";

export default createStore({
  state: {
    loading: true,
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
      context.state.loading = true
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
        context.state.loading = false
        //Toto správně řadí dle timestamp z databáze
        const tempTodosSorted = tempTodos.sort((a, b) => {
          return a.timestamp - b.timestamp;
        });
        context.commit("retrieveTodos", tempTodosSorted);
      });
    },
    async addTodo(context, todo) {
      try {
        const docRef = await addDoc(collection(db, "todos"), {
          title: todo.title,
          completed: false,
          timestamp: new Date(),
        });
        context.commit("addTodo", {
          id: docRef.id,
          title: todo.title,
          completed: false,
        });
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    },
    async deleteTodo(context, id) {
      try {
        await deleteDoc(doc(db, "todos", id));
        context.commit("deleteTodo", id);
      } catch (error) {
        console.error("Error deleting todo: ", error);
      }
    },
    updateTodo(context, todo) {
      const todoRef = doc(db, "todos", todo.id); // Reference na dokument todo
      const updatedTodo = {
        title: todo.title,
        completed: todo.completed,
        timestamp: new Date(),
      };

      setDoc(todoRef, updatedTodo) // Aktualizace dokumentu todo s novými daty
        .then(() => {
          context.commit("updateTodo", todo); // Aktualizace stavu Vuex
        })
        .catch((error) => {
          console.error("Error updating todo: ", error);
        });
    },
    checkAll(context, checked) {
      const todosCollection = collection(db, "todos");

      getDocs(todosCollection)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, { completed: checked })
              .then(() => {
                context.commit("checkAll", checked);
              })
              .catch((error) => {
                console.error("Error updating todo: ", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    },
    updateFilter(context, filter) {
      setTimeout(() => {
        context.commit("updateFilter", filter);
      });
    },
    clearCompleted(context) {
      const todosCollection = collection(db, "todos");

      // Vytvoření dotazu, který vybere pouze dokončené úkoly
      const completedTodosQuery = query(todosCollection, where("completed", "==", true));

      // Získání dokumentů odpovídajících dotazu
      getDocs(completedTodosQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // Smazání dokončeného úkolu
            deleteDoc(doc.ref)
              .then(() => {
                // Aktualizace stavu Vuex
                context.commit("clearCompleted");
              })
              .catch((error) => {
                console.error("Error deleting completed todo: ", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error getting completed todos: ", error);
        });
    },
  },
  modules: {},
});
