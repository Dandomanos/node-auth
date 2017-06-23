<template>
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
    <div  class="celm-form-tip is-success" v-else-if="success" >
        <div class="celm-form-tip-body">
            <p>
                <b>{{success.message}}</b>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    name: 'form-messages-handler',
    props:['error', 'fetchError', 'success']
}
</script>