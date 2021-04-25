<template>
  <div class="navbar">
    <div class="logo l-area"><img src="../assets/images/logo.png" class="logo-text"></div>
    <div v-show="showSearchArea && window.width > 670" class="search l-area">
      <div v-bind:class="{ bigSearchDivActive : isInSearch }" class="big-search-div">
        <div class="items">
          <div class="src-icon l-area"><div class="src-lnk" ><img class="icon" src="../assets/icons/search.svg" alt=""></div></div>
          <div v-bind:class="{ inputActive : isInSearch }" class="input l-area"><input @click="inSearch" @blur="outSearch" @keyup.esc="removeSearchValue" v-model="searchValue" placeholder="Takas etmek için kitap ara" type="text"></div>
          <div v-show="searchValue.length > 0" class="src-delete r-area"><div v-on:click="removeSearchValue" class="dlt-lnk"><img class="icon" src="../assets/icons/delete.svg" alt=""></div></div>
        </div>
      </div>
    </div>
    <div v-if="user" class="user r-area">
      <div class="user-items">
        <div>
          <div class="user-item notification">
            <img class="user-icon" src="../assets/icons/notifications.svg" alt="">
          </div>
        </div>
        <div>
          <div class="user-item chat">
            <img class="user-icon" src="../assets/icons/chat.svg" alt="">
          </div>
        </div>
        <div class="user-item photo">
          <div @click="goProfile">
            <img class="user-photo" :src="getImgUrl(user.profile.photo)" alt="">
          </div>
        </div>
        <div @click="goSettings" class="user-item settings">
          <img class="user-icon" src="../assets/icons/settings.svg" alt="">
        </div>
        <div @click="logout" class="user-item logout">
          <img class="user-icon" src="../assets/icons/logout.svg" alt="">
        </div>

      </div>
    </div>
    <div v-else class="user-items">
      <div @click="openRegister" class="btn bg-orange"><b>Kayıt Ol</b></div>
      <div @click="openLogin" style="margin-left:20px;" class="btn bg-blue"><b>Giriş Yap</b></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      showSearchArea: true,
      searchValue: "",
      isInSearch: false,
      window: {
        width: 0,
        height: 0
      }
    }
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    removeSearchValue() {
      this.searchValue = ""
    },
    inSearch() {
      this.isInSearch = true
    },
    outSearch() {
      this.isInSearch = false
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    openLogin() {
      this.$router.push({ path: '/giris'});
    },
    openRegister() {
      this.$router.push({ path: '/kayit'});
    },
    logout() {
      this.$cookies.set('token','');
      this.$emit('user',null)
    },
    goProfile() {
      if (this.user){
        this.$router.push({name:'User', params:{username:this.user.username}});
      }
    },
    goSettings() {
      if (this.user){
        this.$router.push({path:"/ayarlar/hesap"});
      }
    },
    getImgUrl(pet) {
      var images = require.context('../assets/profile-photos/', false, /\.png$/)
      return images('./' + pet + "-s.png")
    },
  }
}
</script>

<style scoped>

.navbar {
  position: fixed;
  z-index: 2;
}

.l-area {
  float: left;
}

.r-area {
  float: right;
}

.navbar {
  width: 100%;
  height: 60px;
  box-shadow: rgba(0, 10, 18, 0.2) 0px 3px 8px, rgba(246, 246, 246, 0.5) 0px 0px 1px;
  display:flex;
  justify-content:center;
  align-items: center;
  background-color: white;
}

.logo {
  height: 100%;
  width: 200px;
  text-align: center;
  display:flex;
  justify-content:center;
  align-items: center;
}

.logo img {
  height: 60px;
}

.search {
  width: 700px;
  max-width: 35%;
  height: 100%;
  display:flex;
  justify-content:center;
  align-items: center;
}

.big-search-div {
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  height: 60%;
  background-color: #F5F5F5;
  border-radius: 8px;
  display:flex;
  justify-content:center;
  align-items: center;
}


.bigSearchDivActive {
  background-color: #ffffff;
  border: solid 2px #808080;
}

.items {
  width: 100%;
  height: 28px;
}

.input {
  margin-left: 10px;
  width: 80%;
  height: 28px;
  background-color: pink;
}

.input input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0px;
  font-size: 16px;
  color: rgb(32, 32, 32);
  background: #F5F5F5;
}

.input input:focus{
  border: none;
  outline: none;
}

.inputActive input{
  background-color: #ffffff;
}

.icon {
  height: 16px;
  opacity: 0.5;
}

.src-icon {
  height: 28px;
  display:flex;
  justify-content:center;
  align-items: center;
}

.src-lnk {
  display:flex;
  justify-content:center;
  align-items: center;
}

.dlt-lnk {
  display:flex;
  justify-content:center;
  align-items: center;
}

.src-delete {
  height: 28px;
  display:flex;
  justify-content:center;
  align-items: center;
}

.user {
  min-width: 200px;
  height: 100%;
  width: auto;
  display:flex;
  justify-content:center;
  align-items: center;
}

.user-icon {
  height: 22px;
}

.user-photo {
  cursor: pointer;
  height: 40px;
  border-radius: 100%;
}

.user-photo:hover {
  opacity: 0.8;
}

.user-item {
  float: left;
  margin-right: 20px;
  display:flex;
  justify-content:center;
  align-items: center;
}

.user-items {
  display:flex;
  justify-content:center;
  align-items: center;
}

.chat {
  cursor: pointer;
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 100%;
}

.notification {
  cursor: pointer;
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 100%;
}

.chat:hover {
  opacity: 0.6;
  background-color: #cecece;
}

.notification:hover {
  opacity: 0.6;
  background-color: #cecece;
}

.logout {
  cursor: pointer;
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 100%;
}

.logout:hover {
  opacity: 0.6;
  background-color: #cecece;
}

.settings {
  cursor: pointer;
  opacity: 0.4;
  height: 40px;
  width: 40px;
  border-radius: 100%;
}

.settings:hover {
  opacity: 0.6;
  background-color: #cecece;
}
</style>
