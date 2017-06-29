<template>
    <form @submit.prevent="submit">
        <form-group-validator
            v-for="field in formFields"
            :field="field"
            :key="field.name"
        >              
        </form-group-validator>
        <form-messages-handler v-if="!loading"
        >
        </form-messages-handler>
        <button
            :disabled="!isFullFilled"
            :class="{ 'is-loading': loading }"
            class="button celm-button"    
            type="submit"
        >{{buttonText}}</button>
    </form>
</template>

<script>
import FormGroupValidator from './FormGroupValidator'
import FormMessagesHandler from './FormMessagesHandler'
import FormValidatorMixin from '../../mixins/FormValidatorMixin.js'
export default {
    name: 'form-container',
    mixins:[FormValidatorMixin],
    props:['submit','formFields', 'buttonText'],
    data () {
        return {
          
        }
    },
    components: {
        FormGroupValidator,
        FormMessagesHandler
    },
    computed: {
        isFullFilled() {
            return this.fullFilled(this.formFields)
        }
    }
}
</script>
