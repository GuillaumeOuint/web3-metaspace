<template>
    <button @click="click" type="button" class="py-2 px-4  bg-gradient-to-r from-green-400 to-blue-500 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ">
        <slot/>
    </button>
</template>

<script>
export default {
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>
