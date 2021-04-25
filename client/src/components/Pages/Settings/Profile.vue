<template>
  <div class="profile">
    <div v-if="isLoading" class="loading">
      <loading/>
    </div>
    <div v-else class="loaded">
      <div v-if="isSaving" class="isSaving">
        <loading/>
      </div>
      <div v-if="errors.length > 0" class="errors">
        <div class="error">{{errors[0]}}</div>
      </div>
      <div v-if="successes.length > 0" class="successes">
        <div class="success">{{successes[0]}}</div>
      </div>
      <div class="fullname item">
        <h2> <img height="20px" src="../../../assets/icons/user.png" alt=""> Ad Soyad</h2>
        <div class="des"><p>Ad ve soyadını paylaşarak takas arkadaşlarının daha da fazla güvenini kazanabilirsin</p></div>
        <div class="input fn">
          <input v-model="firstname" :placeholder="user.profile.name || 'Ad'" type="text">
          <input v-model="surname" style="margin-left:5px;" :placeholder="user.profile.surname || 'Soyad'" type="text">
          <div v-if="user.profile.name != firstname || user.profile.surname != surname" @click="UpdateName" class="btn bg-blue"><b>Değiştir</b></div>
          <div v-else class="btn bg-blue-dsbl"><b>Değiştir</b></div>
        </div>
      </div>
      <div class="avatar item">
        <h2><span style="color:#F67D48;">A</span>vatar</h2>
        <div class="des"><p>Hemen seni en iyi ifade eden avatarını seç.</p></div>
        <div class="photos">
          <img class="avatarImage" @click="selectThisPhoto(p)" :class="{selected:Boolean(p == selectedPhoto), unselected:Boolean(p!=selectedPhoto)}" v-for="p in photosNumber" :key="p" :src="getImgUrl(p)" alt="">
        </div>
      </div>
      <div class="description item">
        <h2><span style="color:#F67D48;">W</span> Açıklama</h2>
        <div class="des"><p>İnsanlara kendinden bahsetmeye ne dersin? Onların güvenini kazanmak için de mükemmel bir yol.</p></div>
        <div :class="{'textarea-warn':Boolean(description.length>300)}" class="input desc">
          <textarea v-model="description" :placeholder="user.profile.description || 'Açıklama'" />
          <div v-if="description.length <= 300 && description != user.profile.description" @click="UpdateDescription" class="btn bg-blue r desbtn"><b>Değiştir</b></div>
          <div v-else class="btn bg-blue-dsbl r desbtn">Değiştir</div>
          <span style="float:right; margin-right:110px; margin-top:-40px;">{{description.length}}/300</span>
        </div>
      </div>
      <div class="birthday item">
        <h2><img height="20px" src="../../../assets/icons/bd.png" alt=""> Doğum Günü</h2>
        <div class="des"><p>Doğum gününü ayarlayıp profilinde göstererek belki hediye kitap alabilirsin.</p></div>
        <div class="input bd">
          <select v-model="birthday.day" name="day" id="day">
            <option v-for="i in datePicker.days[birthday.month]" :key="i" :value="i">{{i}}</option>
          </select>
          <select v-model="birthday.month" name="month" id="month">
            <option v-for="(month, index) in datePicker.months" :key="month" :value="index">{{month}}</option>
          </select>
          <select @click="checkFeb" v-model="birthday.year" name="year" id="year">
            <option v-for="i in datePicker.numberOfYear" :key="i" :value="datePicker.startingYear - i">{{datePicker.startingYear - i}}</option>
          </select>
          <div class="btn bg-blue"><b>Değiştir</b></div>
          <div class="showBirthday">
            <span style="color:#444444;"><b>Profilinde Göster: </b> </span>
            <label class="switch">
              <input v-model="showBirthday" @click="UpdateShowBirthday" type="checkbox" :checked="user.profile.showBirthday">
              <span class="slider round"></span>
            </label><br><br>
          </div>
        </div>
      </div>
      <div class="address item">
        <h2><img height="20px" src="../../../assets/icons/location-s-r.png" alt=""> Adres</h2>
        <div class="des"><p>Bulunduğun adresi girerek (endişelenme sadece il ve ilçe) sana en uygun kitapları sunmamızı sağlayabilirsin.</p></div>
        <div class="input ad">
          <select v-model="address.province" id="">
            <option disabled value="">İl</option>
            <option v-for="code in Object.keys(provinces)" :value="code" :key="code">{{provinces[code]}}</option>
          </select>
          <select v-model="address.district" id="">
            <option disabled value="">İlçe</option>
            <option v-for="code in Object.keys(districts[address.province])" :value="code" :key="code">{{districts[address.province][code]}}</option>
          </select>
          <div v-if="address.district != user.address.district && address.district" @click="UpdateAddress" class="btn bg-blue"><b>Değiştir</b></div>
          <div v-else class="btn bg-blue-dsbl"><b>Değiştir</b></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable*/
  import Provinces from "../../../jsonFiles/provinces.json"
  import Districts from "../../../jsonFiles/districts.json"
  import Loading from '../../Loading.vue'
  import UserService from '../../../api/UserService'

  export default {
    components: { Loading },
    props: {
      user: {
        type: Object,
        default: null
      },
    },
    data() {
      return {
        errors : [],
        successes : [],
        isLoading : true,
        isSaving : false,
        provinces : Provinces,
        districts : Districts,
        address : {
          province : null,
          district : null
        },
        datePicker : {
          startingYear : new Date().getFullYear() - 10,
          numberOfYear : 40,
          months : ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
          days : {
            0 : 31,
            1 : 28,
            2 : 31,
            3 : 30,
            4 : 31,
            5 : 30,
            6 : 31,
            7 : 31,
            8 : 30,
            9 : 31,
            10 : 30,
            11 : 31
          }
        },
        birthday : {
          year: new Date().getFullYear() - 10,
          month: new Date().getMonth(),
          day: new Date().getDate()
        },
        photosNumber : 8,
        selectedPhoto : null,
        showBirthday : null,
        firstname : null,
        surname : null,
        description: this.user.profile.description
      }
    },
    methods: {
      checkFeb() {
        if(this.birthday.year % 4 === 0) {
          this.datePicker.days[1] = 29
        }else{
          this.datePicker.days[1] = 28
        }
      },
      getImgUrl(pet) {
        var images = require.context('../../../assets/profile-photos/', false, /\.png$/)
        return images('./' + pet + "-s.png")
      },
      selectThisPhoto(p) {
        if (this.selectedPhoto != p){
          this.selectedPhoto = p
          this.UpdatePhoto(p);
        }
      },
      // Service Methods
      UpdateAddress() {
        this.errors = []
        this.successes = []
        this.isSaving = true;
        UserService.changeAddress(this.address.province, this.address.district, this.$cookies.get('token'))
          .then(data => {
            if (data.success) {
              this.successes.push('Değişiklikler başarıyla kaydedildi');
            }else {
              this.errors.push('Uppps değişikler kaydedilirken bir hata oldu, lütfen tekrar Dene.');
            }
            this.isSaving = false;
            document.getElementById("detailsCont").scrollTo(0,0)
          })
      },
      UpdateShowBirthday() {
        this.errors = []
        this.successes = []
        this.isSaving = true;
        let showB = Boolean(!this.showBirthday)
        UserService.changeShowBirthday(showB, this.$cookies.get('token'))
          .then(data => {
            if (data.success) {
              console.log(data)
              this.user.profile = data.data.profile
              let text = ""
              if (data.data.profile.showBirthday) {
                text = "gösterilecek"
              }else{
                text = "gösterilmeyecek"
              }
              this.successes.push(`Doğum günün artık profilinde ${text}`);
            }else {
              console.log(data)
              this.errors.push('Uppps değişikler kaydedilirken bir hata oldu, lütfen tekrar Dene.');
            }
            this.isSaving = false;
            document.getElementById("detailsCont").scrollTo(0,0)
          })
      },
      UpdateName() {
        this.errors = []
        this.successes = []
        this.isSaving = true;
        UserService.changeName(this.firstname, this.surname, this.$cookies.get('token'))
          .then(data => {
            if (data.success && data.code == 120) {
              this.user.profile = data.data.profile
              this.successes.push("Ad ve Soyadın başarıyla değiştirildi.");
            }else {
              this.errors.push('Uppps değişikler kaydedilirken bir hata oldu, lütfen tekrar Dene.');
            }
            this.isSaving = false;
            document.getElementById("detailsCont").scrollTo(0,0)
          })
      },
      UpdatePhoto(photo) {
        this.errors = []
        this.successes = []
        this.isSaving = true;
        console.log(photo)
        UserService.changePhoto(photo,this.$cookies.get('token'))
          .then(data => {
            if (data.success && data.code == 120) {
              this.user.profile = data.data.profile
              this.successes.push("Avatarın başarıyla değiştirildi.");
            }else {
              this.errors.push('Uppps değişikler kaydedilirken bir hata oldu, lütfen tekrar Dene.');
            }
            this.isSaving = false;
            document.getElementById("detailsCont").scrollTo(0,0)
          })
      },
      UpdateDescription() {
        this.errors = []
        this.successes = []
        this.isSaving = true;
        UserService.changeDescription(this.description, this.$cookies.get('token'))
          .then(data => {
            if (data.success && data.code == 120) {
              this.user.profile = data.data.profile
              this.successes.push("Açıklaman başarıyla değiştirildi.");
            }else {
              this.errors.push('Uppps değişikler kaydedilirken bir hata oldu, lütfen tekrar Dene.');
            }
            this.isSaving = false;
            document.getElementById("detailsCont").scrollTo(0,0)
          })
      }
    },
    created () {
      this.$emit('setting','profile');
      if (this.user) {
        this.selectedPhoto = this.user.profile.photo
        this.address.district = this.user.address.district;
        this.address.province = this.user.address.province;
        this.showBirthday = this.user.profile.showBirthday;
        this.firstname = this.user.profile.name;
        this.surname = this.user.profile.surname;
      }
      this.isLoading = false
    },
    watch: {
      user : function(val) {
        if (val) {
          this.selectedPhoto = this.user.profile.photo
          this.address.district = this.user.address.district;
          this.address.province = this.user.address.province;
        }
      },
      'address.province' : function(val) {
        if (!Object.keys(this.districts[val]).includes(this.address.district)) {
          this.address.district = null
        }
      },
      deep : true
    }
  }
</script>

<style scoped>
.profile {
  padding-left:10px ;
}

.input{
  padding-top:10px;
  height: auto;
  margin-top: 30px;
}

.desc{
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

select {
  margin-right: 10px;
  height: 36px;
  background-color: #F5F5F5;
  border:none;
  border-radius: 10px;
  color: #303030;
  font-size: 14px;
  padding-left:10px ;
  width: 100px;
  float: left;
  appearance: none;
}

select:hover{
  background-color: #F5F5F5;
}

select:focus{
  border: solid 2px #8a8a8a;
  outline: none;
  background-color: #F5F5F5;
}

textarea {
  resize: none;
}

.btn{
  float: left;
  width: 80px;
  margin-left: 10px;
  text-align: center;
}

.bg-blue-dsbl {
  background: rgb(189, 197, 238);
  cursor: default;
}

.item {
  height: auto;
  margin-bottom: 75px;
}

.avatar {
  margin-bottom: 30px;
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

.r{
  float: none;
}

.desc textarea{
  width:520px;
  height: 150px;
  background-color: #F5F5F5;
  border:none;
  border-radius: 10px;
  color: #303030;
  font-size: 14px;
  padding:10px ;
  float: left;
}

.desc textarea:focus{
  border: solid 2px #8a8a8a;
  outline: none;
}

.textarea-warn textarea {
  background-color: #f7dfe1;
}

.textarea-warn textarea:focus {
  border: solid 2px #ff3636;
  background-color: #f7dfe1;
}

.textarea-warn span {
  color:#ff3636;
}

.description{
  height: auto;
  margin-bottom: 40px;
}

.desbtn{
  margin-left:0px ;
  margin-top: 180px;
}

.birthday{
  margin-top: 20px;
}

.showBirthday{
  margin-top: 50px;
  width: 100%;
  height: auto;
}

.showBirthday span{
  float: left;
}

.bd{
  margin-top: 40px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.switch {
  margin-left: 15px;
  position: relative;
  display: inline-block;
  width: 45px;
  height: 25px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #88D969;
}

input:focus + .slider {
  box-shadow: 0 0 1px #88D969;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}

.address {
  margin-top: -50px;
}

.ad{
  margin-top: 50px;
}

.avatar:first-child {
  margin-left:5px;
}

.avatarImage {
  user-select: none;
  cursor: pointer;
  margin-top: 20px;
  margin-right: 10px;
  border:solid 1px rgb(0, 0, 0,0);
  border-radius: 100%;
}

.unselected:hover {
  border:solid 1px #2e2e2e;
}

.selected {
  opacity: 1;
  border:solid 2px #2e2e2e;
  border-radius: 100%;
}

.isSaving{
  background-color:rgba(255, 255, 255,  .8);
  width: 750px;
  position: fixed;
  z-index: 4;
}

.errors {
  width: auto;
  height: 50px;
}

.successes {
  width: auto;
  height: 50px;
}

.error {
  font-size: 14px;
  float: left;
  padding: 4px;
  padding-right: 30px;
  height: 20px;
  background-color: #f7dfe1;
  color: #721c24;
  border-left: 3px solid #f18c96;
}

.success {
  font-size: 14px;
  padding: 5px;
  padding-right: 30px;
  float: left;
  height: 20px;
  background-color: #ddeee1;
  color: #155724;
  border-left: 3px solid #81db96;
}
</style>