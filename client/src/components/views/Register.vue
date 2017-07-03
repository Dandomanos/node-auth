<template>
    <div class="register">
        <h1>Register</h1>
        <h2>Create a new account.</h2>
        <form-container
            :formFields="formFields"
            :submit="submit"
            :buttonText="'Create Account'"
        ></form-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import FormContainer from '../commons/FormContainer'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
const formFields = require('../data/registerForm.json')
export default {
    name: 'Register',
    mixins:[FormValidatorMixin],
    data () {
        return {
            formFields
        }
    },
    components: {
        FormContainer
    },
    mounted() {
        this.resetForms()
        this.formFields = this.clearForms(this.formFields)
    },
    methods: {
        ...mapActions({
            register:'auth/REGISTER'
        }),
        submit(){

            // Client Validation
            let data = this.getFormData(this.formFields)

            if(!this.validateField('email', data.email))
                return this.setError('EMAIL_INVALID')

            if(!this.validateField('name', data.firstName))
                return this.setError('FIRSTNAME_INVALID')

            if(!this.validateField('name', data.lastName))
                return this.setError('LASTNAME_INVALID')

            if(!this.validateField('password', data.password))
                return this.setError('PASSWORD_INVALID')

            if(data.password!==data.confirmPassword)
                return this.setError('PASSWORD_NOT_MATCH')
            
            this.register(data)
        },
    },
    computed: {
        isFullFilled() {
            return this.fullFilled(this.formFields)
        }
    }
}
</script>