<template>
  <div class="newSwap">
    <div class="area">
      <div class="text">
        <h3>HEMEN VİTRİNİNE BİR KİTAP EKLE</h3>
      </div>
      <div @click="goAddBook" class="btnadd">Ekle</div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  methods: {
    goAddBook(){
      console.log(this.$router)
      this.$router.push({path:'/yenikitap'});
    }
  },
}
</script>

<style scoped>
/* eslint-disable */
.newSwap {
  width: 100%;
  height: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  
}

.area{
  width: 600px;
}

.area h3 {
  width: 100%;
  letter-spacing: 5px; 
  font-weight: 900;
  height: 100%;
}

.text {
  float: left;
  padding: 7px;
}

.btnadd {
  cursor:pointer;
  margin-left:10px ;
  border-radius:10px;
  padding: 8px;
  color: white;
  background-color: #fd4848;
  float: left;
  text-align: center;
  font-weight: 900;
  width: 50px;
  font-size: 16px;
  -moz-user-select: none;
  user-select: none;
}

.btnadd:hover {
  transition: 0.5s;
  background-color: #ff2525;
}
</style>