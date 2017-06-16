<template>
    <div class="register">
        <h1>Register</h1>
        <h2>Create a new account.</h2>

        <form @submit.prevent="submit">
            <form-group-validate
                :field="field"
                :errorFields="errorFields"
                v-for="field in formFields"
                :key="field.name"
            >              
            </form-group-validate>

            <div 
                    class="message is-warning" v-if="fetchError || error"
                >
                    <div class="message-body">
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
                class="button primary-button"
                :class="{'is-loading': loading}"
                :disabled="fullFilled != 1"
            >Enter</button>
        </form>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormGroupValidate from '../commons/FormGroupValidate'
const debug = require('debug')('app:REGISTER => ')
export default {
    data () {
        return {
            error:null,
            formFields:[
                {
                    name: 'email',
                    label: 'Email',
                    placeHolder: 'Enter your email',
                    model: '',
                    type: 'email'
                },
                {
                    name: 'firstName',
                    label: 'Firstname',
                    placeHolder: 'Enter your Firstname',
                    model: '',
                    type: 'text'
                },
                {
                    name: 'lastName',
                    label: 'Lastname',
                    placeHolder: 'Enter your Lastname',
                    model: '',
                    type: 'text'
                },
                {
                    name: 'password',
                    label: 'Password',
                    placeHolder: 'Enter your Password',
                    model: '',
                    type: 'password'
                },
                {
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    placeHolder: 'Confirm your Password',
                    model: '',
                    type: 'password'
                }
            ]
        }
    },
    components: {
        FormGroupValidate
    },
    methods: {
        ...mapActions({
            register:'auth/REGISTER',
            clearFetchError:'auth/CLEAR_ERROR'
        }),
        submit(){

            // Client Validation
            if(!this.fullFilled) {
                return this.setError({ message: 'You must fill all fields', fields:['all']})
            }
            let data = {}
            this.formFields.map( item => data[item.name] = item.model )
            debug('data', data)

            if(!this.validateEmail(data.email))
                return this.setError({ message: 'Insert a valid email', fields:['email']})

            if(!this.validatePassword(data.password))
                return this.setError({ message: 'Your Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number', fields:['password']})

            if(data.password!==data.confirmPassword)
                return this.setError({ message: 'Your passwords do not match', fields:['password', 'confirmPassword']})

            this.error = null
            
            this.register(data)
        },
        setError(error){
            this.clearFetchError()
            this.error = error
        },
        validateEmail(email) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        },
        validatePassword(password) {
            let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
            return re.test(password)
        }
    },
    mounted(){
        // this.$refs.email.focus()
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError
        }),
        fullFilled(){
            return this.formFields.map( item => !!item.model.length ).filter( item => item == false ).length<=0
        },
        loading(){
            return this.fetchStatus == 'fetching'
        },
        errorFields(){
            if(this.error && this.error.fields)
                return this.error.fields.map( item => item )

            if(this.fetchError && this.fetchError.fields)
                return this.fetchError.fields.map( item => item )

            return []
        }   
    }
}
</script>