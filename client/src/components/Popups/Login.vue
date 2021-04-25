<template>
  <div class="login">
      <div v-if="!isLoading" class="cont">
        <div class="area">
          <h3><span style="color:#F67D48;">@</span> E-posta</h3>
          <input v-model="email" @keyup="finishEmail" class="input-text" type="text" placeholder="email">
          <div v-if="errors.email.length>0" class="errors">
            <p v-for="error in errors.email" :key="error">- {{error}}</p>
          </div>
        </div>
        <div class="area">
          <h3><span style="color:#5571ff;">*</span> Password</h3>
          <input @keyup="finishPassword" v-model="password" class="input-text" type="password" placeholder="password">
          <div v-if="errors.password.length>0" class="errors">
            <p v-for="error in errors.password" :key="error">- {{error}}</p>
          </div>
        </div>
        <div class="area">
          <div @click="login" v-if="emailOk && passwordOk" class="btn button bg-blue"><b>Giriş Yap</b></div>
          <div v-else  class="btn button disable"><b>Giriş Yap</b></div>
        </div>
      </div>
      <loading :isPopup="true" v-else/>
    </div>
</template>

<script>
/* eslint-disable */ 
import UserService from '../../api/UserService.js';
import Loading from '../Loading.vue';

  export default {
  components: { Loading },
    data() {
      return {
        isLoading : true,
        email : "",
        password : "",
        errors: {
          email : [],
          password: []
        },
        emailOk : false,
        passwordOk : false
      }
    },
    created() {
      this.isLoading = false
    },
    methods: {
      finishEmail() {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.errors.email = []
        if (this.email.length == 0) {
          this.errors.email.push("*Bu alan gerekli.")
        }
        if (this.email.length != 0){
          if (!re.test(this.email.toLowerCase())) {
            this.errors.email.push("E-posta adresi geçerli değil.")
          }
        }
        if (this.errors.email == 0){
          this.emailOk = true;
        }else{
          this.emailOk = false;
        }
      },
      finishPassword() {
        this.errors.password = []
        if (this.password.length == 0) {
          this.errors.password.push("Bu alan boş bırakılamaz.")
        }
        if (this.errors.password == 0) {
          this.passwordOk = true;
        }else{
          this.passwordOk = false;
        }
      },
      login() {
        this.finishEmail()
        this.finishPassword()
        if (this.emailOk && this.passwordOk) {
          UserService.Login(this.email, this.password, this.$cookies.get('token'))
            .then(res => {
              console.log(res)
              if (res.success){
                this.$cookies.set("token",res.data.token);
                if (this.$route.params.isFirst){
                  this.$router.push({name:'Address', params: {user: res.data.user}});
                }else{
                  this.$router.push({name:'Home', params: {user: res.data.user}});
                }
              }else{
                if (res.code == "111") {
                  this.$router.push({name:'Home'});
                }else if (res.code == "112") {
                  this.errors.email.push("Bu eposta adresi ile kayıtlı kullanıcı bulunamadı.");
                }else if (res.code == "113") {
                  this.errors.password.push("Şifre doğru değil.");
                }else if (res.code == "114") {
                  this.errors.email.push("E-posta adresi doğrulanmamış.");
                }
              }
            })
        }
      }
    }
  }
</script>

<style scoped>
.login {
  width: 80%;
}
.input-text {
  padding-left:10px ;
  border: none;
  background-color: #F5F5F5;
  height: 40px;
  font-size: 16px;
  width:97%;
  border-radius: 10px;
}

.input-text:focus{
  border: solid 2px #808080;
  background-color: white;
  height: 40px;
  font-size: 16px;
  border-radius: 0px;
}
/*
.login{
  width: 50%;
  min-width: 500px;
  height: 600px;
  background-color: white;
  opacity: 1;
}
*/

h3 {
  margin-bottom: 10px;
}

.area{
  margin-bottom:25px;
}

.checkbox{
  float:left;
  margin-top:2px; 
  height:16px; 
  width:16px; 
  margin-right:10px;
}

.check {
  height: 20px;
}

.button{
  width:95%;
  text-align: center;
}

.errors p {
  font-size: 12px;
  color:  #ff2323;
}

.errors{
  font-weight: 600;
  margin-top: 10px;
  margin-left:5px ;
}

.disable{
  background: #8596E8;
  opacity: 0.3;
}


</style>