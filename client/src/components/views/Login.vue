<template>
    <div class="login" v-if="!user">
        <h1>Login</h1>
        <form-container
            :formFields="formFields"
            :submit="submit"
            :buttonText="'Enter'"
        ></form-container>
        <router-link class="celm-link" :to="'/recover'">
                Forgot your password
        </router-link>
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
import FormContainer from '../commons/FormContainer'
const formFields = require('../data/loginForm.json')
// const debug = require('debug')('LOGIN =>')
export default {
    name: 'Login',
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
    computed: {
        ...mapState({
            user: state => state.auth.user
        })
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
