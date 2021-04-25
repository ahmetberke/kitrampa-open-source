<template>
  <div class="register">
    <div v-if="stage==1" class="register">
      <div class="area email">
        <h3><span style="color:#F67D48;">@</span> E-posta</h3>
        <input @keyup="finishEmail" v-model="email" class="input-text" type="text" placeholder="email">
        <div v-if="errors.email.length>0" class="errors">
          <p v-for="error in errors.email" :key="error">- {{error}}</p>
        </div>
      </div>
      <div class="area password">
        <h3><span style="color:#5571ff;">*</span> Password</h3>
        <input @keyup="finishPassword()" v-model="password" class="input-text" type="password" placeholder="password">
        <div v-if="errors.password.length>0" class="errors">
          <p v-for="error in errors.password" :key="error">- {{error}}</p>
        </div>
      </div>
      <div style="height:30px;" class="area check">
        <input v-model="isOk" class="checkbox" type="checkbox"> <span style="float:left; font-size:12px;"><a style="text-decoration:underline" href="#">Kullanıcı Sözleşmesini</a> okudum ve kabul ediyorum</span>
      </div>
      <div class="area register-button">
        <div @click="Register()" v-if="isOk && emailOk && passwordOk" class="btn button bg-green"><b>Kayıt Ol</b></div>
        <div v-else  class="btn button disable"><b>Kayıt Ol</b></div>
      </div>
    </div>
    <div v-if="stage==2" class="email">
      <h3>E-posta adresinize gönderdiğimiz bağlantı ile eposta adresinizi doğrulayın.</h3>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
  import UserServices from '../../api/UserService'
  export default {
    data() {
      return {
        isOk: false,
        email: "",
        password: "",
        errors : {
          email : [],
          password : []
        },
        emailOk : false,
        passwordOk : false,
        stage : 1
      }
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
        if (this.password.length <= 8) {
          this.errors.password.push("8 karakterden fazla olmalı")
        }
        if (this.errors.password == 0) {
          this.passwordOk = true;
        }else{
          this.passwordOk = false;
        }
      },

      Register() {
        this.finishEmail()
        this.finishPassword()
        if (this.passwordOk || this.emailOk || this.isOk){
          UserServices.RegisterUser(this.email, this.password)
            .then((data) => {
              if (!data.success){
                if (data.code == "101") this.errors.email.push('Bu e-posta adresi zaten kullanılıyor.');
              }
              if (data.success) {
                this.stage = 2
              }
            })
            .catch((err) => {
              console.log(err)
            });
        }
      }
    },
  }
</script>

<style scoped>
.register {
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
  width: 100%;
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

.disable{
  background: #88D969;
  opacity: 0.3;
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


.email {
  width: 100%;
}

.email h3 {
  color: #535353;
}

</style>