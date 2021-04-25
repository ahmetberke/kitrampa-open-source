<template>
  <div class="settings">
    <div style="height:60px; width:100%;" class="kkkk"></div>
    <div class="mid">
      <div class="list">
        <div @click="goSetting(chosen.path)" :class="{chosed:chosen.activate}" v-for="chosen in choices" :key="chosen.name" class="chosen">
          <div class="chosen-cont">{{chosen.name}}</div>
        </div>
      </div>
      <div class="details">
        <div id="detailsCont" class="details-cont">
          <router-view :user="user" @setting="setting=$event" name="settings"/>
        </div>
      </div>
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
    data() {
      return {
        setting : null,
        choices: {
          Account : {
            name: "Hesap",
            path: "hesap",
            activate: false
          },
          Profile : {
            name: "Profil ve Adres",
            path: "profil",
            activate: false
          }
        }
      }
    },
    watch : {
      setting : function(val) {
        if (val=='account'){
          this.choices.Account.activate = true
          this.choices.Profile.activate = false
        }else if (val == 'profile'){
          this.choices.Account.activate = false
          this.choices.Profile.activate = true
        }
      },

      user : function(val) {
        if(!val){
          this.$router.push({name:'Login'});
        }
      }
    },
    methods: {
      goSetting(path) {
        console.log("hi")
        this.$router.push(path);
      }
    },
    created() {
      if(!this.user){
        this.$router.push({name:'Login'});
      }
    },
  }
</script>

<style scoped>

.settings{
  width: 100%;
  height: 600px;
  text-align: justify;
}

.mid{
  width: 1000px;
  position: relative;
  margin: auto;
}

.list {
  width:250px;
  height: 20px;
  height: auto;
  float: left;
  padding-top:30px;
}

.details {
  float: left;
  padding-top: 30px;
  width:750px;
  height: 20px;
}

.details-cont{
  width: 90%;
  background-color: #fdfdfd;
  height: 550px;
  overflow: auto;
}

.chosen{
  user-select: none;
  cursor:pointer;
  float: left;
  width: 85%;
  padding: 5%;
  margin-bottom: 10px;
  border-left: solid 4px rgb(110, 110, 110);
  border-radius: 4px;
}

.chosed{
  border-color: #ff6523;
  background-color: #F5F5F5;
}

.chosen-cont {
  color:#414141 ;
  font-size: 16px;
  margin-left: 10px;
  font-style:unset;
}

</style>
