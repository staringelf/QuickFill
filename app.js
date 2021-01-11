'use strict'

const model = {
  pinCode: null,

  userData: {
    name: 'ABc',
    email: null,
    phone: null,
    address: null,
    district: null,
    city: null,
    state: null,
    country: null,
    'zip-code': null,
  }
}

const view = {
  init () {
    this.pinCodeInput = document.querySelector('#pin-code');

    this.nameInput = document.querySelector('#name');
    this.emailInput = document.querySelector('#email');
    this.phoneInput = document.querySelector('#phone');
    this.addressInput = document.querySelector('#address');
    this.districtInput = document.querySelector('#district');
    this.cityInput = document.querySelector('#city');
    this.stateInput = document.querySelector('#state');
    this.countryInput = document.querySelector('#country');
    this.zipCodeInput = document.querySelector('#zip-code');

    this.formInputs = document.querySelectorAll('.user_info input');
    this.setUpEventListeners();
  },

  setUpEventListeners () {
    this.pinCodeInput.onblur = updatePinCode;
    
    this.formInputs.forEach(formInput => formInput.onblur = updateUserData);
  },

  render (data) {
    const userData = data.userData;
    this.formInputs.forEach(formInput => {
     formInput.value = userData[formInput.id];
    })
  }

}

const getModelData = function () {
  return model;
}

const updatePinCode = function () {
  if(this.value == null){
    return;
  }

  model.pinCode = this.value;
  createRequest(createUrl());
}

const updateUserData = function () {
  if(this.value != null){
    model.userData[this.id] = this.value;
  }
}

const postalUrl = `https://api.postalpincode.in/pincode/`;

const postalUpdatePageSuccess = function (data) {
  const parsedData = JSON.parse(data);
  console.log(parsedData);
}

const postalUpdatePageError = function (error) {
  console.log(error);
}

const responseMethod = function (httpRequest, succeed, failure) {
  if(httpRequest.readyState === 4){
    if(httpRequest.status === 200){
      succeed(httpRequest.responseText);
    }
  } else {
    failure(httpRequest.status + ':' + httpRequest.responseText);
  }
}

const createRequest = function (url) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener('readystatechange', () => responseMethod(httpRequest, postalUpdatePageSuccess, postalUpdatePageError));
  httpRequest.open('GET', url);
  httpRequest.send();
}

const createUrl = function () {
    return postalUrl + model.pinCode; 
}

view.init();
