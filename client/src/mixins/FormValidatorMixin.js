import {mapState,mapActions} from 'vuex'
// const debug = require('debug')('Form Validator Mixin =>')

export default {
    data () {
        return {
            error:null,
            regEx: {
                email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                name: /^[-'a-zA-ZÀ-ÖØ-öø-ſ ]+$/
            },
        }
    },
    computed:{
        ...mapState({
            fetchStatus: state => state.auth.fetchStatus,
            fetchError: state => state.auth.fetchError
        }),
        loading(){
            return this.fetchStatus == 'fetching'
        }
    },
    mounted() {
        this.clearFetchError()
        this.error = null
    },
    methods: {
        ...mapActions({
            clearFetchError:'auth/CLEAR_ERROR'
        }),
        fullFilled(formFields) {
            return formFields.map( item => !!item.model.length ).filter( item => item == false ).length<=0
        },
        getFormData(formFields) {
            let data = {}
            formFields.map( item => data[item.name] = item.model )
            return data
        },
        errorFields(){
            if(this.error && this.error.fields)
                return this.error.fields.map( item => item )

            if(this.fetchError && this.fetchError.fields)
                return this.fetchError.fields.map( item => item )

            return []
        },
        setError(error){
            this.clearFetchError()
            this.error = error
        },
        validateField(type, field) {
            return this.regEx[type].test(field)
        }
    }
}