<template>
  <div class="email-verificate">
    <div class="cont" v-if="!isLoading">
      <div v-if="success" class="success">
        <h2>Eposta Başarıyla <br> Onaylandı</h2>
        <div class="button">
          <div @click="toAddress" class="btn button bg-blue"><b>Devam Et</b></div>
        </div>
      </div>
      <div v-else class="error">
        <h2 style="color:#ff3636;">Üzgünüz, E-posta adresiniz onaylanamadı</h2>
      </div>
    </div>
    <loading v-else :isPopup="true"/>
  </div>
</template>

<script>
/* eslint-disable */
  import UserServices from '../../api/UserService'
import Loading from '../Loading.vue';
  export default {
  components: { Loading },
    data() {
      return {
        isLoading : true,
        success : false,
        userId : this.$route.params.id,
        token : this.$route.query.token
      }
    },
    methods: {
      toAddress() {
        this.$router.push({ path: '/giris', params:{isFirst:true}});
      }
    },
    created () {
      UserServices.VerificateEmail(this.userId, this.token)
        .then(res => {
          if (res.success) {
            this.success = true
            this.isLoading = false
          }
        })
    },
  }
</script>

<style scoped>
.email-verificate {
  width: 80%;
  text-align: center;
}

.button{
  width:94%;
  text-align: center;
  margin-top: 20px;
}

.h2 {
  color:#2B2B2B;
}

</style>