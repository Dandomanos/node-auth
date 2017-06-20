<template>
    <div class="celm-form-group" :class="{'error' : hasError }">
        <label :for="field.name">{{field.label}}:</label>
        <input
            v-if="field.type=='password'"
            type="password"
            class="celm-input"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeHolder"
            v-model="field.model"
        >
        <input
            v-else-if="field.type=='email'"
            type="email"
            class="celm-input"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeHolder"
            v-model="field.model"
        >
        <input
            v-else
            type="text"
            class="celm-input"
            :id="field.name"
            :name="field.name"
            :placeholder="field.placeHolder"
            v-model="field.model"
        >
    </div>
</template>

<script>

export default {
    name: 'FormGroupValidate',
    props: ['field', 'errorFields','inputType'],
    computed:{
        hasError() {
            return this.errorFields.map(item => item === this.field.name || item === 'all').filter(Boolean)[0]
        }
    }
}
</script>