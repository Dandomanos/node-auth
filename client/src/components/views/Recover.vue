<template>
    <div class="recover" >
        <h1>Recover password</h1>
        <form-container
            :formFields="formFields"
            :submit="submit"
            :buttonText="'Create new Password'"
        ></form-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import FormContainer from '../commons/FormContainer'
const formFields = require('../data/recoverForm.json')
// const debug = require('debug')('LOGIN =>')
export default {
    name: 'Recover',
    mixins:[FormValidatorMixin],
    data () {
        return {
            formFields
        }
    },
    mounted() {
        this.resetForms()
    },
    components: {
        FormContainer
    },
    methods: {
        ...mapActions({
            recover:'auth/RECOVER_PASSWORD'
        }),
        submit(){
            // Client Validation
            let data = this.getFormData(this.formFields)
            if(!this.validateField('email', data.email))
                return this.setError('EMAIL_INVALID')
                
            this.resetForms()
            this.recover(data)
            this.setSuccess('We has sent and email to ' + data.email + ' with your new password.')
        }
    }
}
</script>
