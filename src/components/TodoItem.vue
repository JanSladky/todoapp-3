<template>
    <div class="todo-item">
        <div class="todo-item-left">
            <!-- Když přijímám data z props z rodiče zde tak už nepotřebuji to todo. a taky nepotřebuji to (todo)-->
            <!-- Přidal jsem listener na checkbox jestli se něco změní a jestli ano tak emitnu stejný event jako je doneEdit -->
            <input type="checkbox" v-model="completed" @change="doneEdit">
            <div class="todo-item-label" v-if="!editing" @dblclick="editTodo" :class="{ completed : completed}">
                {{title}}
            </div>
            <input type="text" v-else v-model="title" @blur="doneEdit" @keyup.enter="doneEdit" @keyup.esc="cancelEdit" class="todo-item-edit" v-focus>
        </div>
                
        <div class="remove-item" @click="removeTodo(todo.id)">
            &times;
        </div>
    </div>
</template>

<script>
    export default {
        name: 'todo-item',
        props: {
            /* Specifikuji si propsi které posílám a jejich typy todo a index */
            todo: {
                type: Object,
                required: true,

            },
            index: {
                type: Number,
                required: true,
            },
            checkAll: {
                type: Boolean,
                required: true,
            }
        },
       
        /* Zde přenáším data z rodičovského propsu do dítěte a přijímám je zde */
        data() {
            return {
                'id': this.todo.id,
                'title': this.todo.title,
                'completed': this.todo.completed,
                'editing': this.todo.editing,
                'beforeEditCache': '',
            }
        },
         watch: {
            checkAll() {
                /* Varianta 1 zápisu */
                if (this.checkAll) {
                    this.completed = true
                } else {
                    this.completed = this.todo.completed
                } 
                /* Varianta 2 zápisu */
               /*  this.completed = this.checkAll ? true : this.todo.completed */
            }

        },
        methods: {
            removeTodo(id) {
                /* emitnu event z dítěte do rodiče a nazvu jinak funkci minulým časem */
                this.$store.dispatch('deleteTodo', id)
            },
            editTodo() {
                this.beforeEditCache = this.title
                this.editing = true
            },
            doneEdit() {
                if(this.title.trim() == '') {
                this.title = this.beforeEditCache
                }
                this.editing = false
                this.$emit('finishedEdit', {
                    'index': this.index,
                    'todo': {
                        'id': this.id,
                        'title': this.title,
                        'completed': this.completed,
                        'editing': this.editing
                    }
                }) 
            },
            cancelEdit() {
            this.title = this.beforeEditCache
            this.editing = false
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>