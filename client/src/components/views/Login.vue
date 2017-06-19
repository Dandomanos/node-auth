<template>
    <div class="login" v-if="!user">
        <h1>Login</h1>
        <form @submit.prevent="submit">
            <form-group-validate
                :field="field"
                :errorFields="errorFields"
                v-for="field in formFields"
                :key="field.name"
            >              
            </form-group-validate>
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
                class="primary-button"    
                type="submit"
            >Enter</button>
        </form>
    </div>
    <div v-else>
        <router-link class="primary-button" :to="'/logout'">
                Logout
        </router-link>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormGroupValidate from '../commons/FormGroupValidate'
export default {
    name: 'Login',
    data () {
        return {
            email:'',
            password:'',
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
                    name: 'password',
                    label: 'Password',
                    placeHolder: 'Enter your Password',
                    model: '',
                    type: 'password'
                }
            ]
        }
    },
    components: {
        FormGroupValidate
    },
    mounted(){
        // this.$refs.email.focus()
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError,
            user: state => state.auth.user
        }),
        fullFilled(){
            return this.formFields.map( item => !!item.model.length ).filter( item => item == false ).length<=0
        },
        loading(){
            return this.fetchStatus == 'fetching'
        },
        errorFields(){

            if(this.fetchError && this.fetchError.fields)
                return this.fetchError.fields.map( item => item )

            return []
        }
    },
    methods: {
        ...mapActions({
            login:'auth/LOGIN'
        }),
        submit(){
            let data = {}
            this.formFields.map( item => data[item.name] = item.model )
            this.login({email:data.email,password:data.password})
        }
    }
}
</script>

<style lang="scss">
.message {
    font-size:12px;
    font-family:courier;
    &.is-warning {
        .message-body {
            color:darken(red,10);
            border-color:red;
        }
    }
}

</style>
