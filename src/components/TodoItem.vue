<template>
    <div class="todo-item">
        <div class="todo-item-left">
            <!-- Když přijímám data z props z rodiče zde tak už nepotřebuji to todo. a taky nepotřebuji to (todo)-->
            <input type="checkbox" v-model="completed">
            <div class="todo-item-label" v-if="!editing" @dblclick="editTodo" :class="{ completed : completed}">
                {{title}}
            </div>
            <input type="text" v-else v-model="title" @blur="doneEdit" @keyup.enter="doneEdit" @keyup.esc="cancelEdit" class="todo-item-edit" v-focus>
        </div>
                
        <div class="remove-item" @click="removeTodo(index)">
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
        methods: {
            removeTodo(index) {
                /* emitnu event z dítěte do rodiče a nazvu jinak funkci minulým časem */
                this.$emit('removedTodo', index)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>