<template>
    <div>
        <template v-if="loading">
            Validating User
        </template>
        <form-messages-handler v-else>
        </form-messages-handler>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import FormMessagesHandler from '../commons/FormMessagesHandler'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
// const debug = require('debug')('app:HOME')
export default {
    methods: {
        ...mapActions({
            confirmEmail:'auth/CONFIRM_EMAIL'
        })
    },
    mixins: [FormValidatorMixin],
    components: {
        FormMessagesHandler
    },
    data() {
        return {
            token: '',
        }
    },
    mounted(){
        this.token=this.$route.params.token.replace(/\:/g,'.')
        this.confirmEmail({token:this.token})
    }
}
</script>