<template>
  <div :class="{popup:isPopup}" class="loading normal">
    <img  src="../assets/gifs/loading.gif" alt="">
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    props : {
      isPopup : {
        type : Boolean,
        default : false
      }
    }
  }
</script>

<style scoped>
/* eslint-disable */
.loading {
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
}

.normal {
  height: 35em;
}

.popup {
  height: 20em;
}



.loading img{
  height: 50px;
}
</style>