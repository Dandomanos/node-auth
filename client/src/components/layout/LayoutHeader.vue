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
@import '../../assets/scss/_const.scss';
header {
    padding:$header-padding;
    background-color:$header-bg-color;
    ul {
        list-style-type: none;
        padding: 0;
        li {
            display: inline-block;
            margin: $header-list-margin;
            a {
                color:$header-font-color;
                font-weight:bold;
            }
        }
    }

    .user {
        margin-top:$header-padding;
        background-color: $background-color;
        padding: $header-padding;
    }
}
</style>