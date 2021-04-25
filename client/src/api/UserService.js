/* eslint-disable */

import API from './config'
import axios from 'axios' 

const instance = axios.create({
  baseURL: API.URL,
  headers: {'x-access-token':API.Token, "authorization":""}
});

class UserService {
  static RegisterUser(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await instance.post(API.endpoints.user.register, {email, password});
        const data = res.data;
        resolve(data)
      }catch(err) {
        reject(err);
      }
    });
  }
  
  static GetUser(username, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.get(API.endpoints.user.base + username);
        const data = res.data;
        resolve(data)
      }catch(err){
        reject(err)
      }
    })
  }

  static VerificateEmail(userId, token) {
    return new Promise(async (resolve, recejt) => {
      try{
        const res = await instance.get(API.endpoints.user.verificateEmail + userId + `?token=${token}`);
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static changeAddress(province, district, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.updateAddress, {province, district});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static changeShowBirthday(showBirthday, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.updateProfile, {showBirthday});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }
  
  static changeName(firstN, lastN, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.updateProfile, {name:firstN, surname:lastN});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static changePhoto(p, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.updateProfile, {photo:p});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static changeDescription(desc, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.updateProfile, {description:desc});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static Login(email, password, token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.post(API.endpoints.user.login, {email, password});
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }

  static getLoggedUser(token) {
    return new Promise(async (resolve, reject) => {
      try{
        const linstance = axios.create({
          baseURL: API.URL,
          headers: {'x-access-token':API.Token, "authorization":`bearer ${token}`}
        });
        const res = await linstance.get(API.endpoints.user.get);
        const data = res.data
        resolve(data);
      }catch(err){
        reject(err)
      }
    });
  }
}

export default UserService;