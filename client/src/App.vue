<template>
  <div id="app">
    <loading v-if="isLoading" />
    <div v-else class="all">
      <router-view class="view two" name="popup"></router-view>
      <navbar @user="user=$event" :user="user" />
      <router-view @user="user=$event" :user="user" class="view one"></router-view>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
import Navbar from './components/Navbar.vue'
import UserServices from './api/UserService'
import Loading from './components/Loading.vue'
export default {
  name: 'App',
  data() {
    return {
      user: null,
      isLoading : true
    }
  },
  components: {
    Navbar,
    Loading
  },
  created () {
    if (this.$cookies.get('token')){
      UserServices.getLoggedUser(this.$cookies.get('token'))
        .then(res => {
          if (res.success) {
            this.user = res.data.user
            console.log('user from app created')
          }
          this.isLoading = false
        });
    }else{
      this.isLoading = false
    }
  },
}
</script>

<style>
#app {
@import url('./assets/css/main.css');

font-family: 'Open Sans', sans-serif;
}
</style>
