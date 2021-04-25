<template>
  <div class="NewBook">
    <div style="height:60px; width:100%;" class="kkkk"></div>
    <div class="mid">
      <div class="stages">
        <div class="middle">
          <div @click="goSearch" class="stage search-stg">
            <div class="inStg" :class="{completed:isOkStgSearch}">
              <img @click="goSearch" src="../../assets/icons/search.svg" alt="">
            </div>
          </div>
          <div class="line"><div :class="{compltdLine:isOkStgSearch}" class="inline"></div></div>
          <div @click="goSettings" class="stage settings">
            <div class="inStg" :class="{completed:isOkStgSettings}">
              <img @click="goSettings" src="../../assets/icons/settings.svg" alt="">
            </div>
          </div>
          <div class="line lend"><div :class="{compltdLine:isOkStgSettings}" class="inline"></div></div>
          <div @click="goAdd" class="stage add">
            <div class="inStg" :class="{completed:isOkStgAdd}">
              <img @click="goAdd"  src="../../assets/icons/send.png" alt="">
            </div>
          </div>
          <div class="add"></div>
        </div>
      </div>
      <div class="content">
        <div v-if="stage==1" class="searchCont">
          <div v-bind:class="{ bigSearchDivActive : search.isIn }" class="big-search-div">
            <div class="items">
              <div class="src-icon l-area"><div class="src-lnk" ><img class="icon" src="../../assets/icons/search.svg" alt=""></div></div>
              <div v-bind:class="{ inputActive : search.isIn }" class="input l-area"><input @click="inSearch" @blur="outSearch" @keyup.esc="removeSearchValue" @keyup.enter="bookSearch" v-model="search.value" placeholder="Eklemek istediğin kitabı bul" type="text"></div>
              <div v-show="search.value.length > 0" class="src-delete r-area"><div v-on:click="removeSearchValue" class="dlt-lnk"><img class="icon" src="../../assets/icons/delete.svg" alt=""></div></div>
            </div>
          </div>
          <div v-if="search.errors.length > 0" class="searchErrors">
            <span v-for="err in search.errors" :key="err">|  {{err}}</span>
          </div>
          <div class="result">
            <div v-if="search.result.length > 0" class="resOk">
              <div v-for="book in search.result" :key="book.id">
                <div class="book" >
                  <div :class="{noImage : Boolean(book.volumeInfo.imageLinks == undefined)}" class="black">
                    <h3 v-if="book.volumeInfo.title.length > 40">{{book.volumeInfo.title.replace(/\s+/g,' ').trim().capitalize().slice(0,40)}}...</h3>
                    <h3 v-else>{{book.volumeInfo.title.replace(/\s+/g,' ').trim().capitalize()}}</h3>
                  </div>
                  <img v-if="book.volumeInfo.imageLinks != undefined" :src="book.volumeInfo.imageLinks.thumbnail" alt="">
                </div>
              </div>
            </div>
          </div>
          <div class="addMore">
            <div class="addButton">
              <span>Daha Fazla Bul</span>
            </div>
          </div>
        </div>
        <div v-else-if="stage==2" class="settingsCont">ayarlar</div>
        <div v-else-if="stage==3" class="addCont">ekleme</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'

String.prototype.capitalize = function() {
  var seperateWord = this.toLowerCase().split(' ');
  for (var i = 0; i < seperateWord.length; i++){
    seperateWord[i] = seperateWord[i].charAt(0).toUpperCase() + seperateWord[i].slice(1);
  }
  return seperateWord.join(' '); 
}

export default {
  data() {
    return {
      isOkStgSearch : false,
      isOkStgSettings : false,
      isOkStgAdd : false,
      stage : 1,
      search: {
        value: "",
        isIn: false,
        result : [],
        lastDataId : 0 ,
        errors : []
      },
    }
  },methods: {
    goSearch(){
      this.stage = 1;
    },
    goSettings(){
      if (this.isOkStgSearch) {
        this.stage = 2;
      }
    },
    goAdd(){
      if (this.isOkStgSearch && this.isOkStgSettings) {
        this.stage = 3;
      }
    },
    
    removeSearchValue() {
      this.search.value = ""
    },
    inSearch() {
      this.search.isIn = true
    },
    outSearch() {
      this.search.isIn = false
    }, 
    
    bookSearch() {
      this.search.errors = []
      var val = this.search.value;
      var id = this.search.lastDataId + 1;
      if (val.length > 0){
        axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURI(val)}&maxResults=20`)
          .then((res) => {return res.data})
          .then((data) => {
            if (id > this.search.lastDataId){
              if (data.items){
                console.log(data)
                this.search.result = data.items;
                this.search.lastDataId = id;
              }else{
                this.search.errors.push("Aradığınız isimde bir kitap bulunamadı.")
              }
            }
          });
      }
    }
  }
}
</script>

<style scoped>

.NewBook{
  width: 100%;
  height: 600px;
  text-align: justify;
}

.mid{
  width: 1000px;
  position: relative;
  margin: auto;
}

.stages {
  margin-top:20px;
  width: 100%;
  height: 50px;
}

.middle{
  width: 280px;
  height: 50px;
}

.stage {
  cursor: pointer;
  margin-top: 10px;
  margin-right: 50px;
  float: left;
  height: 40px;
  width: 40px;
  background-color: #f5f5f5;
  border-radius: 100%;
  box-shadow: rgba(0, 10, 18, 0.2) 0px 3px 8px, rgba(246, 246, 246, 0.5) 0px 0px 1px;
}

.stage img {
  margin-top: 8px;
  margin-left: 9px;
  height: 20px;
  opacity: 0.4;
}

.line{
  position: absolute;
  margin-left:40px ;
  z-index: -1;
  width: 50px;
  height: 6px;
  float: left;
  background-color: #f5f5f5;
  margin-top: 28px;
  box-shadow: rgba(0, 10, 18, 0.2) 0px 3px 8px, rgba(246, 246, 246, 0.5) 0px 0px 1px;
}

.lend{
  margin-left: 130px;
}

.inline {
  margin-top: 1.5px;
  width: 40px;
  height: 3px;
}

.inStg {
  height: 55px;
  width: 55px;
  margin-top: 2px;
  margin-left: 2px;
  border-radius: 100%;
}

.completed {
  border: solid 3px #88D969;
}

.completed img {
  opacity: 0.6;
}

.compltdLine {
  background-color: #88D969;
}

.big-search-div {
  padding-left: 10px;
  padding-right: 10px;
  width: 80%;
  height: 40px;
  background-color: #F5F5F5;
  border-radius: 8px;
  display:flex;
  justify-content:center;
  align-items: center;
}

.searchErrors{
  color: #fa5252;
  font-weight: 700;
  font-size: 14px;
  margin-top: 10px;
  width: 80%;
  height: 40px;
}

.bigSearchDivActive {
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

.searchCont {
  margin-top: 50px;
}

.result {
  width: 900px;
}

.book {
  margin-top: 50px;
  height: 210px;
  width: 180px;

  float: left;
}

.book img{
  overflow:hidden;
  margin:0;
  width: 150px;
  margin-left: 15px;
  height: 210px;
  box-shadow: rgba(0, 10, 18, 0.2) 5px 8px 8px, rgba(246, 246, 246, 0.5) 0px 0px 1px;
}

.black {
  position: absolute;
  z-index: 2;
  width: 150px;
  margin-left: 15px;
  height: 210px;
  color: rgba(0, 0, 0, 0);
  word-wrap:break-word;
}

.noImage {
  color:#272727 ;
  background-color: #F5F5F5;
}

.black:hover{
  transition: 0.5s;
  color: white;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.7);
  
}

.black h3 {
  width: 140px;
  position: relative;
  top: 50%;
  transform: perspective(0px) translateY(-50%);
  vertical-align: middle;
  text-align: center;
  font-weight: 300;
  margin-left: 5px;
  margin-right: 5px;
  font-size: 25px;
  float: left;
  margin-top: 5px;
}

.addMore{
  margin-top: 20px;
  width: 100%;
}

.addButton{
  cursor: pointer;
  font-size: 15px;
  width: 30%;
  height: 30px;
  border-radius: 10px;
  color: #f67d48;
  border: solid 1px #f67d48;
  text-align: center;
}

.addButton:hover{
  transition: 0.2s;
  color: #ffffff;
  background-color: #f67d48;
}

.addButton span{
  position: relative;
  top: 15%;
  transform: perspective(0px) translateY(-50%);
}
</style>
