<template>
    <div  class="celm-form-tip is-warning" v-if="fetchError" >
        <div class="celm-form-tip-body">
            <p>
                <b>{{fetchError.message}}</b>
            </p>
        </div>
    </div>
    <div  class="celm-form-tip is-success" v-else-if="fetchSuccess">
        <div class="celm-form-tip-body">
            <p>
                <b>{{fetchSuccess.message}}</b>
            </p>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'form-messages-handler',
    computed:{
        ...mapState({
            fetchError: state => state.auth.fetchError,
            fetchSuccess: state => state.auth.fetchResult
        }),
    }
}
</script>