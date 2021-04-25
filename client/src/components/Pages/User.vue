<template>
  <div class="User">
    <div style="height:60px; width:100;" class="kkkk"></div>
    <loading v-if="isLoading"/>
    <div v-else class="loaded">
      <div v-if="user && errors.length == 0" class="noproblem">
        <div class="leftSide">
          <div class="user">
            <div class="up">
              <div class="photo">
                <img :src="getImgUrl(user.profile.photo)" alt="">
              </div>
              <div class="name">
                <div class="fullname">
                  <div class="firstname"><h3 v-if="user.profile.name">{{user.profile.name.capitalize()}}</h3><h3 v-else>Kullanıcı</h3></div>
                  <div v-if="user.profile.surname" class="lastname"><h3>{{user.profile.surname.capitalize()}}</h3></div>
                </div>
                <div class="username">
                  <span><b>@{{user.username}}</b></span>
                  <span>{{isLoggedUser}}</span>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="bd-adrs">
                <div v-if="user.profile.showBirthday && user.profile.birthday" class="bt">
                  <img src="../../assets/icons/bd.png" alt="">
                  <span>{{user.profile.birthday}}</span>
                </div>
                <div v-if="user.address.province" class="adrs">
                  <img src="../../assets/icons/location-s-o.png" alt="">
                  <span v-if="districts[user.address.province][user.address.district]">{{districts[user.address.province][user.address.district].capitalize()}}, </span>
                  <span v-if="provinces[user.address.province]">{{provinces[user.address.province].capitalize()}}</span>
                </div>
              </div>
              <div v-if="user.profile.description" class="about">
                <div class="area-ab">
                  <p @click="desSetting(false)" v-if="isShortDes">{{description}}</p>
                  <p @click="desSetting(true)" v-else>{{user.profile.description}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rightSide" :style="{width: (window.width - 420) + 'px'}">
          <new-swap/>
        </div>
      </div>
    <div v-else class="problem">
      <div class="error">
        <div class="imagearea">
          <img src="../../assets/icons/sadface.png">
        </div>
        <div class="textarea">
          <h1>{{errors[0]}}</h1>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import UserServices from '../../api/UserService'
  import Loading from '../Loading';
  import Provinces from '../../jsonFiles/provinces.json';
  import Districts from '../../jsonFiles/districts.json';
  import NewSwap from './UserComps/NewSwap.vue';

  String.prototype.capitalize = function() {
    var seperateWord = this.toLowerCase().split(' ');
    for (var i = 0; i < seperateWord.length; i++){
      seperateWord[i] = seperateWord[i].charAt(0).toUpperCase() + seperateWord[i].slice(1);
    }
    return seperateWord.join(' '); 
  }

  export default {
  components: { Loading,NewSwap },
    data() {
      return {
        address : null,
        provinces : Provinces,
        districts : Districts,
        isLoading : true,
        username : this.$route.params.username ,
        user : {},
        errors : [],
        isLoggedUser: false,
        isShortDes: true,
        window : {
          width: 0,
          height: 0
        }
      }
    },
    methods: {
      getImgUrl(pet) {
        var images = require.context('../../assets/profile-photos/', false, /\.png$/)
        return images('./' + pet + "-m.png")
      },
      desSetting(val) {
        this.isShortDes = val 
      },
      rightSideWidth() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      }
    },  
    created () {
      window.addEventListener('resize', this.rightSideWidth);
      this.rightSideWidth()
      UserServices.GetUser(this.username, this.$cookies.get('token'))
        .then((res) => {
          if (res.success) {
            this.user = res.data.user;
            this.isLoggedUser = res.data.isLoggedUser;
          }else {
            this.errors.push("Kullanıcı Bulunamadı");
          }
          this.isLoading = false;
        });
    },
    computed : {
      description(){
        var size = 200;
        return this.user.profile.description.length > size ? this.user.profile.description.slice(0, size - 1) + "..." : this.user.profile.description
      }
    }
  }
</script>

<style scoped>
.User {
  width: 100%;
  height: auto;
}

.problem {
  padding-top:30px ;
  width: 450px;
  height:auto;
  vertical-align: center; 
}

.imagearea {
  float:left;
  width: 100px;
  height: 100px;
}

.textarea {
  float: left;
  width: 350px;
  height: 100px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
}

.textarea h1 {
  font-size:30px;
  color: #929292;
}

.error img {
  width: 100px;
  filter: grayscale(0.7) invert(0.6);
}



.leftSide {
  width: 400px;
  min-height: 30px;
  height: auto;;
  float: left;
}

.rightSide {
  width: 100%;
  min-height: 500px;
  height: auto;
  height: auto;
  float: right;
}

.user {
  width: 400px;
  min-height: 100px;
  height: auto;
  margin: 20px;
}

.up {
  width: 100%;
  height: 100px;
}

.photo{
  float: left;
  width: 25%;
  height: 100px;
  width: 100px;
}

.photo img {
  height: 100px;
  border-radius: 100%;
}

.name {
  margin-top: 20px;
  float: left;
  width: 75%;
  height: auto;
}

.firstname{

  float: left;
  margin-right:5px ;
}

.lastname {
  float:left;
}
.fullname {
  margin-left: 10px;
  width: 100%;
  height: 30px;
  font-size: 18px;
}

.username span{
  font-size: 15px;
  margin-left: 10px;
  color: #b8b8b8;
}

.name img{
  height: 10px;
  margin-right: 4px;
}

.middle {
  height: auto;
  padding-top: 20px;
}

.middle img{
  height: 20px;
}

.middle img{
  margin-right:10px ;
  float: left;
}

.bd-adrs{
  padding:10px;
  padding-left: 20px;
  padding-right: 20px;
  float:left;
  border-radius: 20px;
  width: auto;
  background-color: #f5f5f5;
}

.middle span{
  color: #818181;
  float: left;
  margin-right: 3px;
}

.bt{
  width: 150px;
  float: left;
  height: 20px;
}

.adrs{
  width: auto;
  float: left;
  height: 20px;
}

.about {
  margin-top: 20px;
  height:auto;
  width: 300px;
  float: left;
}

.area-ab{
  padding:10px;
  padding-left: 20px;
  padding-right: 20px;
  float:left;
  border-left: solid 4px #818181;
  width: auto;
  background-color: #fdfdfd;
  color: #818181;
  font-size: 14px;
}
</style>