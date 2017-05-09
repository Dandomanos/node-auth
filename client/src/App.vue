<template>
    <div id="app">
        <nav>
          <div class="container">
            <ul class="nav">
              <li v-for="link in menu">
                <router-link :to="link.path">
                  {{link.title}}
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <router-view></router-view>
    </div>
</template>

<script>
export default {
  data () {
        return {
            menu : [
              {
                title: 'Home',
                path: '/home'
              },
              {
                title: 'Login',
                path: '/login'
              },
              {
                title: 'Sign Up',
                path: '/signup'
              },
              {
                title: 'Secret Quote',
                path: 'secretquote'
              },
              {
                title: 'Logout',
                path: '/login'
              }
            ]
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
