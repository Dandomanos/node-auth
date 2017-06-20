<template>
    <div class="register">
        <h1>Register</h1>
        <h2>Create a new account.</h2>

        <form @submit.prevent="submit">
            <form-group-validator
                :field="field"
                :errorFields="errorFields"
                v-for="field in formFields"
                :key="field.name"
            >              
            </form-group-validator>

            <div  class="celm-form-tip is-warning" v-if="fetchError || error" >
                <div class="celm-form-tip-body">
                    <p v-if="fetchError">
                        <b>{{fetchError.message}}</b>
                    </p>
                    <p v-if="error">
                        <b>{{error.message}}</b>
                    </p>
                </div>
            </div>
            <button     
                type="submit"
                class="button celm-button"
                :class="{'is-loading': loading}"
                :disabled="isFullFilled != 1"
            >Enter</button>
        </form>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import FormGroupValidator from '../commons/FormGroupValidator'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
// const debug = require('debug')('app:REGISTER => ')
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
        FormGroupValidator
    },
    methods: {
        ...mapActions({
            register:'auth/REGISTER'
        }),
        submit(){

            // Client Validation
            if(!this.isFullFilled) {
                return this.setError({ message: 'You must fill all fields', fields:['all']})
            }
            let data = this.getFormData(this.formFields)

            if(!this.validateField('email', data.email))
                return this.setError({ message: 'Insert a valid email', fields:['email']})

            if(!this.validateField('name', data.firstName))
                return this.setError({ message: "Your Firstname can't contains numbers and special letters", fields:['firstName']})

            if(!this.validateField('name', data.lastName))
                return this.setError({ message: "Your Lastname can't contains numbres and special letters", fields:['lastName']})

            if(!this.validateField('password', data.password))
                return this.setError({ message: 'Your Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number', fields:['password']})

            if(data.password!==data.confirmPassword)
                return this.setError({ message: 'Your passwords do not match', fields:['password', 'confirmPassword']})

            this.error = null
            
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