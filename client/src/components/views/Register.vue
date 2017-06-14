<template>
    <div class="register">
        <h1>Register</h1>
        <h2>Create a new account.</h2>
        <div class="error" v-if="error">
            {{error.message}}
        </div>
        <form @submit.prevent="submit">
            <div class="form-group">
                <label for="email">Email:</label>
                <input
                    ref="email"
                    id="email"
                    name="email"
                    type="text"
                    class="primary-input"
                    placeholder="Enter your Email"
                    v-model="email"
                >
            </div>
            <div class="form-group">
                <label for="firstName">Firstname:</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    class="primary-input"
                    placeholder="Enter your Firstname"
                    v-model="firstName"
                >
            </div>
            <div class="form-group">
                <label for="lastName">Lastname:</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    class="primary-input"
                    placeholder="Enter your Lastname"
                    v-model="lastName"
                >
            </div>
            <div class="form-group">
                <label for="password">Lastname:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    class="primary-input"
                    placeholder="Enter your Password"
                    v-model="password"
                >
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    class="primary-input"
                    placeholder="Confirm your Password"
                    v-model="confirmPassword"
                >
            </div>
            <div 
                    class="message is-warning"
                    v-if="fetchError" 
                >
                    <div class="message-body">
                        <p>
                            <b>{{fetchError.message}}</b>
                        </p>
                    </div>
                </div>
            <button
                :disabled="!fullFilled || loading"        
                type="submit"
                class="primary-button"
            >Enter</button>
        </form>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
// const debug = require('debug')('app:HOME')
export default {
    data () {
        return {
            email:'',
            password:'',
            confirmPassword:'',
            lastName:'',
            firstName:'',
            error:null
        }
    },
    methods: {
        ...mapActions({
            register:'auth/REGISTER'
        }),
        submit(){
            let data = {
                email:this.email,
                password:this.password,
                firstName:this.firstName,
                lastName:this.lastName
            }
            this.register(data)
        }
    },
    mounted(){
        this.$refs.email.focus()
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError
        }),
        fullFilled(){
            return !!this.email.length && !!this.password.length && !!this.confirmPassword.length && !!this.lastName.length && !!this.firstName.length
        },
        loading(){
            return this.fetchStatus == 'fetching'
        }
    }
}
</script>