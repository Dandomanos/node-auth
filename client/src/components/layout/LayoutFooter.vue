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
$primary: #42b983;
footer {
    padding:1rem;
    background-color:lighten($primary,40);
    color:darken($primary,15);
    small {
        font-weight:bold;
    }
}
</style>