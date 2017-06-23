<template>
    <div class="Profile-container">
        <user-profile></user-profile>
        <div class="celm-profile-edit">
            <template v-if="state===0">
                <button class="celm-button" @click="setState(1)">
                    Edit Profile
                </button>
                <button class="celm-button" @click="setState(2)">
                    Change Password
                </button>
            </template>
            
            <div v-if="state===1">
                <h1>Profile Edit Form</h1>
                <form @submit.prevent="update">
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
                    <button class="celm-button" type="submit" :disabled="!profileFilled || loading"  >
                        Update Profile
                    </button>
                </form>
            </div>
            <div v-else-if="state===2">
                <h1>Change Password</h1>
                <form @submit.prevent="updatePassword">
                    <form-group-validator
                        :field="field"
                        :errorFields="errorFields"
                        v-for="field in passFields"
                        :key="field.name"
                    >              
                    </form-group-validator>
                    <form-messages-handler
                        :error="error"
                        :fetchError="fetchError"
                        :success="success"
                    >
                    </form-messages-handler>
                    <button class="celm-button" type="submit" :disabled="!passwordFilled || loading"  >
                        Update Password
                    </button>
                </form>
            </div>
            <template v-if="state!=0">
                <button class="celm-button" type="button" @click="setState(0)">
                    Back
                </button>
            </template>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import FormGroupValidator from '../commons/FormGroupValidator'
import FormMessagesHandler from '../commons/FormMessagesHandler'
import UserProfile from '../commons/UserProfile'
// const debug = require('debug')('Profile => ')
const formFields = require('../data/editProfileForm.json')
const passFields = require('../data/changePasswordForm.json')
export default {
    name: 'Profile',
    mixins:[FormValidatorMixin],
    data () {
        return {
            state:0,//0 init //1 editprofile //2 changePassword
            formFields,
            passFields
        }
    },
    components: {
        FormGroupValidator,
        FormMessagesHandler,
        UserProfile
    },
    methods: {
        toggleForm() {
            this.formVisible = !this.formVisible
            this.autofill()
        },
        setState(step) {
            this.state = step
            this.resetForms()
            if(step==1)
                this.autofill()

            // if(step==2)
            //     this.clearPass()
        },
        
        update() {
            //Client Validation
            if(!this.profileFilled) {
                return this.setError({ message: 'You must fill all fields', fields:['all']})
            }
            let data = this.getFormData(this.formFields)

            if(!this.validateField('name', data.firstName))
                return this.setError({ message: "Your Firstname can't contains numbers and special letters", fields:['firstName']})

            if(!this.validateField('name', data.lastName))
                return this.setError({ message: "Your Lastname can't contains numbres and special letters", fields:['lastName']})

            this.error = null
            this.updateProfile(data)
            this.setSuccess({message:'Profile updated successfully'})

        },
        updatePassword() {
            if(!this.passwordFilled)
                return this.setError({ message: 'You must fill all fields', fields:['all']})

            let data = this.getFormData(this.passFields)

            if(!this.validateField('password', data.password))
                return this.setError({ message: 'Your Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number', fields:['password']})

            if(!this.validateField('password', data.newPassword))
                return this.setError({ message: 'Your Password must contains minimum eight characters, at least one uppercase letter, one lowercase letter and one number', fields:['newPassword']})
            
            if(data.newPassword!==data.confirmNewPassword)
                return this.setError({ message: 'Your passwords do not match', fields:['newPassword', 'confirmNewPassword']})

            this.error = null
            this.changePassword(data)
            this.setSuccess({message:'Profile updated successfully'})

        },
        autofill() {
            if(this.user && this.formFields)
                this.formFields = this.formFields.map( item => Object.assign({}, item, {model:this.user[item.name]}))
        },
        clearPass() {
            this.passFields = this.passFields.map(item =>  Object.assign({}, item, {model:''}))
        },
        ...mapActions({
            updateProfile:'auth/UPDATE',
            changePassword:'auth/CHANGE_PASSWORD'
        })
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        profileFilled() {
            return this.fullFilled(this.formFields)
        },
        passwordFilled() {
            return this.fullFilled(this.passFields)
        }
    },
}
</script>

<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-profile-edit {
margin:$profile-padding auto;
padding:$profile-padding;
}
</style>
