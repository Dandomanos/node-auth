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
                <form-container
                    :formFields="formFields"
                    :submit="update"
                    :buttonText="'Update Profile'"
                ></form-container>
            </div>
            <div v-else-if="state===2">
                <h1>Change Password</h1>
                <form-container
                    :formFields="passFields"
                    :submit="updatePassword"
                    :buttonText="'Update Password'"
                ></form-container>
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
import FormContainer from '../commons/FormContainer'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import UserProfile from '../commons/UserProfile'
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
        FormContainer,
        UserProfile
    },
    methods: {
        setState(step) {
            this.state = step
            this.resetForms()
            if(step==1)
                this.autofill()

            if(step==2)
                this.clearPass()
        },
        
        update() {

            //Client Validation
            let data = this.getFormData(this.formFields)

            if(!this.validateField('name', data.firstName))
                return this.setError('FIRSTNAME_INVALID')

            if(!this.validateField('name', data.lastName))
                return this.setError('LASTNAME_INVALID')

            this.updateProfile(data)
            this.setSuccess('Profile updated successfully')

        },
        updatePassword() {

            let data = this.getFormData(this.passFields)

            // if(!this.validateField('password', data.password))
            //     return this.setError('PASSWORD_INVALID')

            if(!this.validateField('password', data.newPassword))
                return this.setError('NEW_PASSWORD_INVALID')
            
            if(data.newPassword!==data.confirmNewPassword)
                return this.setError('NEW_PASSWORD_NOT_MATCH')

            this.changePassword(data)
            this.setSuccess('Password updated successfully')

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
