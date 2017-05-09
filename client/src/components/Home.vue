<template>
    <div class="home">
        <img src="../assets/logo.png">
        <div v-if="data">
          <h1>{{data.title}}</h1>
          <p>
            {{data.content}}
          </p>
        </div>
        <br />
        <button class="btn btn-primary" @click="getQuote()">Get content</button>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data () {
        return {
            msg: 'Welcome to Home view',
            data: false
        }
    },
    methods: {
        getQuote () {
            console.log('quote')
            this.$http
            .get('http://localhost:3000/api/home')
            .then(data => {
              console.log('data', data)
              this.data = data.body
            })
            .catch(error => {
                console.log('error', error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
