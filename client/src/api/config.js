/* eslint-disable */

const URL = "http://localhost:4000/";

export default {
  URL : URL,
  endpoints : {
    user : {
      base : 'user/',
      register : 'user/register/',
      login : 'user/login/',
      verificateEmail : 'user/verify-email/',
      updateAddress : 'user/update/address',
      updateProfile : 'user/update/profile',
      get : 'user/get'
    },
    book : "book/"
  },
  Token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJqbTk4M3RxZTEifQ.LzJIcD4aDJ-ebcSYOw17UdGxZSUD_TNSq8To_g7UuiA" 
};

