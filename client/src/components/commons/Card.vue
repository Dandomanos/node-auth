<template>
    <button class="button cardContainer" :style="containerStyle" @click="submit()" :disabled="!isAllowed">
        <div class="card">
            <div class="bg-card" :style="cardStyle"></div>  
            <span>{{number}} de {{type}}</span>
        </div>
    </button>
</template>

<script>
// const debug = require('debug')('card')
export default {
    name: 'Card',
    props:['type', 'number','isHidden','length','action','allowed','yourTurn'],
    data () {
        return {
            // isHidden:false,
        }
    },
    computed: {
        url() {
            return this.isHidden ?'url(../../static/desk/hiddenCard.svg)' : 'url(../../static/desk/'+ this.number + '-' + this.type +'.jpg)'
        },
        maxWidth() {
            return (100/this.length) + '%'
        },
        cardStyle() {
            return this.type !== 'Empty' ? {backgroundImage: this.url} : {}
        },
        containerStyle() {
            return {maxWidth:this.maxWidth}
        },
        isAllowed() {
            return this.allowed && this.allowed.length && this.yourTurn && this.allowed.filter( item => item.type === this.type && item.number === this.number).length>0
        }
    },
    methods: {
        submit() {
            this.action({card:{type:this.type, number:this.number}})   
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.cardContainer {
    width:$card-width;
    padding:$card-air;
    display:inline-block;
    border:none;
    height: auto;
    &[disabled] {
        opacity:1;
    }
    &.isHidden {
        .card {
            //add background for hide card
            background-color:blue;
            .bg-card, span {
                display:none;
            }
        }
    }
}
.card {
    background-color:white;
    width:100%;
    height:$card-height;
    border-radius:$card-radius;
    border:$card-border;
    overflow:hidden;
    position:relative;
    span {
        display:none;
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
