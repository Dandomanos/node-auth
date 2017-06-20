<template>
    <footer>
        <small>Developed by Dandomanos</small>
    </footer>
</template>
<script>

export default {
    name: 'Layoutfooter'
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
footer {
    padding:$footer-padding;
    background-color:$footer-bg-color;
    color:$footer-font-color;
    small {
        font-weight:bold;
    }
}
</style>