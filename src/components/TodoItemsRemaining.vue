<template>
    
    <div>{{ remaining }} zbývá</div>
    
</template>

<script>
    export default {
        name: 'todo-remaining',
        computed: {
            remaining() {
                return this.$store.getters.remaining
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>