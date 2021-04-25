<template>
  <div class="account">
    <div class="username item">
      <h2> <img height="20px" src="../../../assets/icons/user.png" alt=""> Kullanıcı Adı</h2>
      <div class="des"><p>Kullanıcı adını istediğin zaman değiştirebilirsin. Unutma kullanıcı adın senin eşsiz kimliğindir.</p></div>
      <div class="input us">
        <input :placeholder="'@'+user.username" type="text">
        <div class="btn bg-blue"><b>Değiştir</b></div>
      </div>
    </div>
    <div class="email item">
      <h2><span style="color:#F67D48;">@</span> E-posta Adresi</h2>
      <div class="des"><p>E-posta adresini değiştirdikten sonra geçerli olması için yeni adresine gelen posta ile onaylamalısın.</p></div>
      <div class="input em">
        <input :placeholder="user.email" type="text">
        <div class="btn bg-blue"><b>Değiştir</b></div>
      </div>
    </div>
    <div class="password item">
      <h2><span style="color:#5571ff;">*</span> Şifre</h2>
      <div class="upDes"><div class="des"><p>Şifreni kimsenin tahmin edemeyeceği bir şey yapmalısın.</p></div></div>
      <div class="input pass">
        <input placeholder="*********" type="password">
        <div class="btn bg-orange"><b>Değiştir</b></div>
      </div>
    </div>
    <div class="freeze-delete item">
      <h2>Hesabını Dondur veya Sil</h2>
      <div style="margin-top:15px; margin-bottom:15px;" class="des"><p>Hesabını dondurursan bir dahaki girişinde hesabın tekrardan açılır.</p></div>
      <div class="freezeButton btn"><b>Dondurmak İstiyorum</b></div>
      <div style="margin-top:30px; margin-bottom:15px;" class="des"><p>Hesabını silersen bir daha asla geri açamazsın.</p></div>
      <div class="deleteButton btn"><b>Silmek istiyorum</b></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable*/
  export default {
    props: {
      user: {
        type: Object,
        default: null
      },
    },
    created () {
      this.$emit('setting','account');
    },
  }
</script>

<style scoped>
.account {
  padding-left:10px ;
}

.input{
  padding-top:10px;
  height: auto;
  margin-top: 30px;
}

.em{
  margin-top: 50px;
}

input {
  height: 36px;
  background-color: #F5F5F5;
  border:none;
  border-radius: 10px;
  color: #303030;
  font-size: 14px;
  padding-left:10px ;
  width: 200px;
  float: left;
}

input:focus{
  border: solid 2px #8a8a8a;
  outline: none;
}

.btn{
  float: left;
  width: 80px;
  margin-left: 10px;
  text-align: center;
}

.item {
  height: 80px;
  margin-bottom: 80px;
}

.upDes{
  width: 100%;
  height: auto;
}

.des {
  padding-left:10px ;
  color: #8a8a8a;
  margin-top:10px;
  font-size: 14px;
  height: auto;
  float: left;
  border-left:solid 1px rgb(94, 94, 94);
  width: 600px;
  overflow: auto;
}

.password {
  margin-top: 90px;
}

.freezeButton{
  background-color: rgb(0, 0, 0, 0);
  border: solid 3px #303030;
  width: 300px;
  color: #303030;
}

.freezeButton:hover{
  background-color: #303030;
  border: solid 3px #303030;
  color: #ffffff;
  transition:0.3s;
}

.deleteButton{
  background-color: rgb(0, 0, 0, 0);
  border: solid 3px #ff3636;
  width: 300px;
  color: #ff3636;
}

.deleteButton:hover{
  background-color: #ff3636;
  border: solid 3px #ff3636;
  color: #ffffff;
  transition:0.3s;
}

</style>