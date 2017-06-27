import {mapState,mapActions} from 'vuex'
import {getErrorObject} from '../utils/errors'
// const debug = require('debug')('Form Validator Mixin =>')

export default {
    data () {
        return {
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
            fetchError: state => state.auth.fetchError,
            fetchSuccess: state => state.auth.fetchResult
        }),
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
            clearFetchError:'auth/CLEAR_ERROR',
            clearFetchResult: 'auth/CLEAR_RESULT',
            setFetchError:'auth/SET_ERROR',
            setFetchResult:'auth/SET_RESULT'
        }),
        fullFilled(formFields) {
            return formFields.map( item => !!item.model.length ).filter( item => item == false ).length<=0
        },
        getFormData(formFields) {
            let data = {}
            formFields.map( item => data[item.name] = item.model )
            return data
        },
        setError(error){
            this.setFetchError({error:getErrorObject(error)})
        },
        setSuccess(result) {
            let data = { result:{message: result}}
            this.setFetchResult(data)
        },
        resetForms() {
            this.clearFetchError()
            this.clearFetchResult()
        },
        validateField(type, field) {
            return this.regEx[type].test(field)
        }
    }
}