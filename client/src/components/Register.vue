<template>
    <div class="register">
        <h1>Register</h1>
        <p>Create a new account.</p>
        <div class="error" v-if="error">
            {{error.message}}
        </div>
        <form @submit.prevent="submit">
            <div class="form-group">
                <input
                    ref="email"
                    type="text"
                    class="form-control"
                    placeholder="Enter your email"
                    v-model="email"
                >
            </div>
            <div class="form-group">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your firstname"
                    v-model="firstName"
                >
            </div>
            <div class="form-group">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Enter your lastname"
                    v-model="lastName"
                >
            </div>
            <div class="form-group">
                <input
                    type="password"
                    class="form-control"
                    placeholder="Enter your password"
                    v-model="password"
                >
            </div>
            <div class="form-group">
                <input
                    type="password"
                    class="form-control"
                    placeholder="Confirm your password"
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