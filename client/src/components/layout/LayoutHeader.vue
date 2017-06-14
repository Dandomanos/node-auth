<template>
    <header>
        <navigation></navigation>
        <user></user>
    </header>
</template>
<script>
import Navigation from '../commons/Navigation'
import User from '../commons/User'
export default {
    name: 'Layoutheader',
    data () {
        return {
            
        }
    },
    components: {
        Navigation,
        User
    }
}
</script>
<style lang="scss">
$primary: #42b983;
header {
    padding:1rem;
    background-color:lighten($primary,40);
    ul {
        list-style-type: none;
        padding: 0;
        li {
            display: inline-block;
            margin: 0 10px;
            a {
                color:darken($primary,15);
                font-weight:bold;
            }
        }
    }

    .user {
        margin-top:1rem;
        background-color: white;
        padding: 1rem;
    }
}
</style>