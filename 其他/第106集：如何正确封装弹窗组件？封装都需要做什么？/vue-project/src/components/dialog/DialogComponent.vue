<template>
    <div class="modal">
        <div class="modal-content">
            <div class="title">{{  title  }}</div>
            <div class="btns">
                <button @click="onClick" class="btn">按钮</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    title: string;
    onClick(): void;
}>()
</script>
<style>
body {
    background-color: white;
}
.modal {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.modal-content {
    width: 200px;
    background-color: white;
    padding: 20px 40px;
    border-radius: 4px;
    border: 1px solid #f0f0f0;
}
.title {
    text-align: center;
    margin-bottom: 10px;
    font-size: 24px;
}
.btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btns .btn {
    border: none;
    outline: none;
    padding: 5px 10px;
    font-size: 16px;
    color: white;
    background-color: green;
}
</style>