<template>
    <div class="cardContainer" :style="containerStyle">
        <div class="card">
            <div class="bg-card" :style="cardStyle"></div>  
            <span>{{number}} de {{type}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props:['type', 'number','isHidden','length'],
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
            return {backgroundImage: this.url}
            // return {backgroundColor: 'red'}
        },
        containerStyle() {
            return {maxWidth:this.maxWidth}
        }
    },
    methods: {
        
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.cardContainer {
    width:$card-width;
    padding:$card-air;
    display:inline-block;
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
    // &.isHidden {
    //     //add background for hide card
    //     background-color:blue;
    //     .bg-card {
    //         display:none;
    //     }
    // }
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
