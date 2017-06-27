<template>
    <div class="celm-data-user-container">
        <h1>Profile</h1>
        <div class="celm-data-user" v-if="user">
            <ul>
                <li><b>ID</b>: {{user._id}}<br></li>
                <li><b>Username</b>: {{user.username}}<br></li>
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
export default {
    name: 'user-profile',
    computed: {
        ...mapState({
            user: state => state.auth.user
        }),
    }
}
</script>
<style lang="scss">
@import '../../assets/scss/_const.scss';
.celm-data-user {
    display: flex;
    align-items: center;
    ul {
        display:block;
        border:$profile-border;
        margin: 0 auto;
        text-align: left;
        padding:$profile-padding;
    }
}
</style>


