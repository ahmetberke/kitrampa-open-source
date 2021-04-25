<template>
  <div class="select-address">
    <div class="elements">
      <img class="icon" src="../../../assets/icons/location-s-o.png" alt=""><h4>İl</h4>
      <div class="inp">
        <select @change="verificateDistrict" v-model="chosen.province" id="">
          <option disabled value="">İl</option>
          <option v-for="code in Object.keys(provinces)" :value="code" :key="code">{{provinces[code]}}</option>
        </select>
      </div>
      <img class="icon dis" src="../../../assets/icons/location-s-b.png" alt=""><h4> İlçe</h4>
      <div class="inp">
        <select v-if="chosen.province" v-model="chosen.district" id="">
          <option disabled value="">İlçe</option>
          <option v-for="code in Object.keys(districts[chosen.province])" :value="code" :key="code">{{districts[chosen.province][code]}}</option>
        </select>
        <select v-else v-model="chosen.district" id="">
          <option disabled value="">İlçe</option>
        </select>
      </div>
      <a @click="saveAddress" v-if="chosen.province && chosen.district" href="#" ><div class="btn button bg-blue"><b>Kaydet</b></div></a>
      <div v-else class="btn button disable"><b>Kaydet</b></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import Provinces from "../../../jsonFiles/provinces"
  import Districts from "../../../jsonFiles/districts"
  import UserServices from '../../../api/UserService'
  export default {
    data() {
      return {
        provinces: Provinces,
        districts: Districts,
        chosen : {
          province : null,
          district : null
        },
        error : false
      }
    },
    methods: {
      verificateDistrict() {
        this.chosen.district = null
      },
      saveAddress() {
        UserServices.changeAddress(this.chosen.province, this.chosen.district, this.$cookies.get('token'))
          .then(res => {
            if (!res.success){
              if (res.code === "121") this.$router.push({name:'Login'});
              this.error = true
            }else {
              this.$emit('user',res.data.user);
            }
          })
      }
    },
  }
</script>

<style scoped>

.select-address {
  margin-top:10px ;
  width: auto;
  height: 30px;
}

.elements {
  margin: 0 auto;
  width:576px;
  height: 30px;
}

.icon {
  margin-top: 4px;
  height: 20px;
  float: left;
  margin-right:10px ;
}

select {
  float: left;
  padding-left:10px ;
  border: none;
  background-color: #ffffff;
  height: 30px;
  font-size: 14px;
  border-radius: 10px;
  width: 175px;
}

select:focus{
  border: solid 2px #808080;
  background-color: #F5F5F5;
  height: 30px;
  font-size: 14px;
  border-radius: 0px;
}

.area {
  float: left;
}

.button{
  margin-left:20px;
  font-size: 12px;
  padding: 6.5px;
  width: 80px;
  text-align: center;
  float: left;
}

.disable{
  opacity: 0.3;
  background: #8596E8;
}

.select-address h4{
  margin-top:4px ;
  font-size: 15px;
  float:left;
  margin-right: 5px;
}

.select-address img{
  float: left;
}
.dis {
  margin-left:20px;
}
</style>