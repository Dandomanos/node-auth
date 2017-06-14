<template>
    <div class="cardContainer" :class="{'isHidden':isHidden}">
        <div class="card">
            <div class="bg-card" :style="style"></div>  
            <span>{{number}} de {{type}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props:['type', 'number'],
    data () {
        return {
            isHidden:false,
        }
    },
    computed: {
        style() {
            return {backgroundImage: 'url(../../static/desk/'+ this.number + '-' + this.type +'.jpg)'}
            // return {backgroundColor: 'red'}
        }
    },
    methods: {
        
    }
}
</script>
<style lang="scss">
.cardContainer {
    width:10%;
    padding:2px;
    display:inline-block;
}
.card {
    background-color:white;
    width:100%;
    height:90px;
    border-radius:3px;
    border:1px solid #ccc;
    overflow:hidden;
    position:relative;
    &.isHidden {
        background-color:blue;
        .bg-card {
            display:none;
        }
    }
    .bg-card {
        position:absolute;
        top:0;
        bottom:0;
        right:0;
        left:0;
        background-size:cover;
    }
}
</style>
