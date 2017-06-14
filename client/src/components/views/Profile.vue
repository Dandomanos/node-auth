<template>
    <div class="secretquote">
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
    </div>
</template>

<script>
import {mapState} from 'vuex'
// const debug = require('debug')('PRIVATE')
export default {
    name: 'Profile',
    data () {
        return {
        }
    },
    computed: {
        ...mapState({
            user: state => state.auth.user
        })
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
</style>
