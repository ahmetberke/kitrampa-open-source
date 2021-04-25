<template>
  <div class="Home">
    <div style="height:60px; width:100%;" class="kkkk"></div>
    <div v-if="user && user.address.province.length==0" class="s-address">
      <select-address @user='getUser=$event'></select-address>
    </div>
    <div class="banner">
      <div class="banner-image"><img style="width:100%" src="../../assets/images/banner2.jpg" alt=""></div>
      <div class="banner-content">
        <div class="banner-content-text">
          <h1>
            <b>Yeni Kitapları Keşfetmek için Hemen Kitaplığındaki Kitaplarla Takas Et<br> </b>
          </h1>
        </div>
        <div class="banner-content-search">
          <div class="search l-area">
            <div v-bind:class="{ bigSearchDivActive : banner.search.isIn }" class="big-search-div">
              <div class="items">
                <div class="src-icon l-area"><div class="src-lnk" ><img class="icon" src="../../assets/icons/search.svg" alt=""></div></div>
                <div v-bind:class="{ inputActive : banner.search.isIn }" class="input l-area"><input @click="inSearch" @blur="outSearch" @keyup.esc="removeSearchValue" v-model="banner.search.value" placeholder="Takas etmek için kitap ara" type="text"></div>
                <div v-show="banner.search.value.length > 0" class="src-delete r-area"><div v-on:click="removeSearchValue" class="dlt-lnk"><img class="icon" src="../../assets/icons/delete.svg" alt=""></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-books"></div>
    <div class="recomended-books"></div>
    <div class="best-books"></div>
  </div>
</template>

<script>
/* eslint-disable */
import SelectAddress from "./Home/SelectAddress"
import UserServices from "../../api/UserService"
export default {
  name: 'Home',
  components:{
    SelectAddress
  },
  data () {
    return {
      user : null,
      getUser : null,
      msg: '#Home',
      banner : {
        search: {
          value: "",
          isIn: false  
        },
        text: {
          size: 30
        }
      }
    }
  },
  computed: {
    routeUser() {
      return this.$route.params.user
    }
  },
  watch : {
    user : function(val){
      this.$emit('user', val)
      console.log(val)
    },
    getUser : function(val) {
      this.user = val
      console.log('from select address');
    },
    routeUser : function(val) {
      this.user = val
      console.log("route user");
    }
  },
  methods: {
    removeSearchValue() {
      this.banner.search.value = ""
    },
    inSearch() {
      this.banner.search.isIn = true
    },
    outSearch() {
      this.banner.search.isIn = false
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.s-address {
  position: fixed;
  width: 100%;
  z-index: 2;
  background-color: #F5F5F5;
  padding-bottom: 12px;
}
.banner {
  width: 100%;
  height: 420px;
  margin-top:15px ;
}
.banner-image{
  float: left;
  width: 50%;
}


.banner-content{
  width: 50%;
  float: left;
  height: 100%;

}

.banner-content-text {
  font-family: Brandon Text,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
  color: rgb(43, 43, 43);
  min-height: 40%;
  height: auto;
  margin-top: 40px;
  margin-left: 60px;
  margin-right: 100px;
  font-size: 20px;
  padding:20px;

}


@media only screen and (max-width:1100px){ 
    .banner-content-text {
      min-height: 30%;
      font-size: 15px;
      margin-top: 35px;
    }
}

@media only screen and (max-width:900px){ 
    .banner-content-text {
      min-height: 20%;
      font-size: 12px;
      margin-top: 25px;
    }
}

@media only screen and (max-width:700px){ 
    .banner-content-text {
      min-height: 15%;
      font-size: 8px;
      margin-top: 10px;
      margin-right: 0px;
    }
}

@media only screen and (max-width:600px){ 
  .banner-content-text {
    font-family: Brandon Text,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif;
    color: rgb(43, 43, 43);
    min-height: 40%;
    height: auto;
    margin-right: 20px;
    margin-left: 20px;
    margin-top:-20px ;
    font-size: 15px;
    text-align: center;
  }
  .banner-image{
    width: 100%;
  }
  .banner-content{
    width: 100%;
    height: 100%;
  }
  .banner-content-search {
    display:flex;
    justify-content:center;
    align-items: center;
    width: 100%;
  }
  .search{
    margin-left: 0px;
  }
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
  float: left;
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
  float: left;
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
  float: right;
  height: 28px;
  display:flex;
  justify-content:center;
  align-items: center;
}

.search {
  margin-left: 80px;
  float: left;
  width: 700px;
  max-width: 70%;
  height: 60px;
  display:flex;
  justify-content:center;
  align-items: center;
}

</style>
