<template>
    <div class="login" v-if="!user">
        <h1>Login</h1>
        <form @submit.prevent="submit">
            <form-group-validator
                :field="field"
                :errorFields="errorFields"
                v-for="field in formFields"
                :key="field.name"
            >              
            </form-group-validator>
            <form-messages-handler
                :error="error"
                :fetchError="fetchError"
                :success="success"
            >
            </form-messages-handler>
            <button
                :disabled="!isFullFilled || loading"    
                class="celm-button"    
                type="submit"
            >Enter</button>
        </form>
    </div>
    <div v-else>
        <router-link class="celm-button" :to="'/logout'">
                Logout
        </router-link>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import FormGroupValidator from '../commons/FormGroupValidator'
import FormMessagesHandler from '../commons/FormMessagesHandler'
const formFields = require('../data/loginForm.json')
const debug = require('debug')('LOGIN =>')
export default {
    name: 'Login',
    mixins:[FormValidatorMixin],
    data () {
        return {
            formFields
        }
    },
    components: {
        FormGroupValidator,
        FormMessagesHandler
    },
    mounted(){
        debug('formFields', formFields)
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        isFullFilled() {
            return this.fullFilled(this.formFields)
        }
    },
    methods: {
        ...mapActions({
            login:'auth/LOGIN'
        }),
        submit(){
            let data = this.getFormData(formFields)
            this.login(data)
        }
    }
}
</script>
