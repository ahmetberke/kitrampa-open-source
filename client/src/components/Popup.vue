<template>
  <div class="popup">
    <div class="center-fix">
      <div class="content">
        <div :class="{danger:type.danger}" class="items">
          <div class="quite" @click="quit"><img src="../assets/icons/delete.svg" alt=""></div>
        </div>
        <login @user="this.$emit('user',$event)" v-if="name=='Login'"/>
        <register v-if="name=='Register'"/>
        <email-verificate v-if="name=='EmailVerificate'"/>
      </div>
      <div @click="quit" class="quit"></div>
    </div>
    <div  class="popupbg"></div>
  </div>
</template>

<script>
/* eslint-disable */
import Login from './Popups/Login.vue'
import Register from './Popups/Register.vue';
import EmailVerificate from './Popups/EmailVerificate.vue';

export default {
  components: {
    Login,
    Register,
    EmailVerificate
  },
  data() {
    return {
      isLogin: true,
      type : {
        danger: false
      },
      which : null
    }
  },
  methods: {
    quit(){
      this.$router.push({name:'Home'});
    }
  },
  computed : {
    name() {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
.popupbg {
  position: fixed;
  z-index: 5;
  height: 40em;
  width: 100%;
  background-color: white;
  opacity: 0.8;
}
.center-fix {  
  position: fixed;
  z-index: 6;
  width: 100%;
  height: 600px;
  background: rgba(0, 0, 0, 0.0);
  display:flex;
  justify-content:center;
  align-items: center;
}
.quit {  
  position: fixed;
  z-index: 7;
  width: 100%;
  height: 600px;
  background: rgba(0, 0, 0, 0.0);
}
.content {
  box-shadow: rgba(0, 4, 7, 0.2) 0px 3px 10px, rgba(80, 80, 80, 0.5) 0px 0px 10px;
  background-color: white;
  width: 40%;
  min-width: 400px;
  position: fixed;
  z-index: 8;
  height: auto;
  padding-bottom:30px ;
  border-radius: 15px;
}
.quite {
  cursor: pointer;
  margin-top:10px;
  margin-right:10px;
  float: right;
}

.quite img{
  height: 25px;
  opacity: 0.5;
}

.items{
  background-color: rgb(247, 247, 247);
  height: 45px;
  width: 100%;
  border-radius: 15px;
  margin-bottom: 20px;
}

.danger {
  background-color: #ff3636;
}

.danger img {
  filter: grayscale(0.7) invert(0.1);
  opacity: 1;
}
</style>