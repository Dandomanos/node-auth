<template>
    <div class="login">
        <h1>Login</h1>
        <p>Log in to your account to get some great quotes.</p>
        <div class="error" v-if="error">
            {{error.message}}
        </div>
        <form @submit.prevent="submit">
            <div class="form-group">
                <input
                    ref="email"
                    type="text"
                    class="form-control"
                    placeholder="Enter your username"
                    v-model="email"
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
            <div 
                    class="message is-warning"
                    v-if="fetchError" 
                >
                    <div class="message-body">
                        <p>
                            <b>{{fetchError.msg}}</b>
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
export default {
    name: 'Login',
    data () {
        return {
            email:'',
            password:'',
            error:null
        }
    },
    mounted(){
        this.$nextTick(()=>
            this.$refs.email.focus()
        )
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError
        }),
        fullFilled(){
            return !!this.email.length && !!this.password.length
        },
        loading(){
            return this.fetchStatus == 'fetching'
        }
    },
    methods: {
        ...mapActions({
            login:'auth/LOGIN'
        }),
        submit(){
            this.login({email:this.email,password:this.password})
        }
    }
}
</script>

<style>
.error {
    color:red;
}

.form-control {
    width:100%;
    max-width:200px;
    padding:10px;
    margin:0 auto;
    margin-bottom:5px;
}

button {
    width:auto;
    padding:10px;
    text-transform:uppercase;
    cursor:pointer;
}
.message {
    font-size:12px;
    font-family:courier;
}
.is-warning {
    color:orangered;
}
</style>
