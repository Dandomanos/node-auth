<template>
    <div class="Profile-container">
        <h1>Profile</h1>
        <div class="data-user" v-if="user">
            <ul>
                <li><b>ID</b>: {{user._id}}<br></li>
                <li><b>First Name</b>: {{user.firstName}}<br></li>
                <li><b>Last Name</b>: {{user.lastName}}<br></li>
                <li><b>Email</b>: {{user.email}}<br></li>
                <li><b>Role</b>: [{{user.role}}]<br></li>
            </ul>
        </div>
        <div class="profile-edit">
            <button class="primary-button" @click="toggleForm()"  v-if="!formVisible">
                Edit Profile
            </button>
            <div 
            v-else-if="formVisible">
                <h1>Profile Edit Form</h1>
                <form @submit.prevent="update">
                    <form-group-validate
                        :field="field"
                        :errorFields="errorFields"
                        v-for="field in formFields"
                        :key="field.name"
                    >              
                    </form-group-validate>

                    <button class="primary-button" type="submit" :disabled="!profileFilled || loading"  >
                        Update Profile
                    </button>
                    <button class="primary-button" type="button" @click="toggleForm()">
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormGroupValidate from '../commons/FormGroupValidate'
const debug = require('debug')('Profile => ')
export default {
    name: 'Profile',
    data () {
        return {
            formVisible:false,
            formFields:[
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
                
            ]
        }
    },
    components: {
        FormGroupValidate
    },
    computed: {
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError,
            user: state => state.auth.user
        }),
        errorFields(){

            if(this.fetchError && this.fetchError.fields)
                return this.fetchError.fields.map( item => item )

            return []
        },
        profileFilled() {
            return this.formFields.map( item => !!item.model.length ).filter( item => item == false ).length<=0
        },
        loading(){
            return this.fetchStatus == 'fetching'
        }
    },
    methods: {
        toggleForm() {
            this.formVisible = !this.formVisible
            this.autofill()
        },
        update() {
            let data = {}
            this.formFields.map( item => data[item.name] = item.model )
            debug('data', data)
            this.updateProfile({firstName:data.firstName,lastName:data.lastName})
            this.toggleForm()
            debug('updating form')
        },
        autofill() {
            if(this.user)
                this.formFields = this.formFields.map( item => Object.assign({}, item, {model:this.user[item.name]}))
        },
        ...mapActions({
            updateProfile:'auth/UPDATE'
        })
    },
    mounted() {
        
    }
}
</script>

<style lang="scss">
.data-user {
    display: flex;
    align-items: center;
    ul {
        border:1px solid #ccc;
        margin: 0 auto;
        text-align: left;
        padding:1rem;
    }
}
.profile-edit {
    margin:1rem auto;
    padding:1rem;
}
</style>
