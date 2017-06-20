<template>
    <div class="Profile-container">
        <h1>Profile</h1>
        <div class="celm-data-user" v-if="user">
            <ul>
                <li><b>ID</b>: {{user._id}}<br></li>
                <li><b>First Name</b>: {{user.firstName}}<br></li>
                <li><b>Last Name</b>: {{user.lastName}}<br></li>
                <li><b>Email</b>: {{user.email}}<br></li>
                <li><b>Role</b>: [{{user.role}}]<br></li>
            </ul>
        </div>
        <div class="celm-profile-edit">
            <button class="celm-button" @click="toggleForm()"  v-if="!formVisible">
                Edit Profile
            </button>
            <div 
            v-else-if="formVisible">
                <h1>Profile Edit Form</h1>
                <form @submit.prevent="update">
                    <form-group-validator
                        :field="field"
                        :errorFields="errorFields"
                        v-for="field in formFields"
                        :key="field.name"
                    >              
                    </form-group-validator>

                    <div  class="celm-form-tip is-warning" v-if="fetchError || error" >
                        <div class="celm-form-tip-body">
                            <p v-if="fetchError">
                                <b>{{fetchError.message}}</b>
                            </p>
                            <p v-else-if="error">
                                <b>{{error.message}}</b>
                            </p>
                        </div>
                    </div>
                    <div  class="celm-form-tip is-success" v-else-if="profileUpdated" >
                        <div class="celm-form-tip-body">
                            <p>
                                Profile Updated succesfully
                            </p>
                        </div>
                    </div>
                    <button class="celm-button" type="submit" :disabled="!profileFilled || loading"  >
                        Update Profile
                    </button>
                    <button class="celm-button" type="button" @click="toggleForm()">
                        Back
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
import FormGroupValidator from '../commons/FormGroupValidator'
// const debug = require('debug')('Profile => ')
const formFields = require('../data/editProfileForm.json')
export default {
    name: 'Profile',
    mixins:[FormValidatorMixin],
    data () {
        return {
            formVisible:false,
            formFields,
            profileUpdated:false
        }
    },
    components: {
        FormGroupValidator
    },
    methods: {
        toggleForm() {
            this.formVisible = !this.formVisible
            this.autofill()
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

            this.profileUpdated = false
            this.error = null
            this.updateProfile(data)
            this.profileUpdated = true
        },
        autofill() {
            if(this.user)
                this.formFields = this.formFields.map( item => Object.assign({}, item, {model:this.user[item.name]}))
        },
        ...mapActions({
            updateProfile:'auth/UPDATE'
        })
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
        profileFilled() {
            return this.fullFilled(this.formFields)
        }
    },
}
</script>

<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-data-user {
    display: flex;
    align-items: center;
    ul {
        border:$profile-border;
        margin: 0 auto;
        text-align: left;
        padding:$profile-padding;
    }
}
.celm-profile-edit {
    margin:$profile-padding auto;
    padding:$profile-padding;
}
</style>
