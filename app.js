'use strict'

const model = {
  pinCode: null,

  userData: {
    name: null,
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

    this.pinCodeInput.oninput = pinCodeInputHandler;

    this.formInputs.forEach(formInput => formInput.onblur = takeUserData);
  },

  render (data) {
    const userData = data.userData;
    this.formInputs.forEach(formInput => {
     formInput.value = userData[formInput.id];
    })
  }

}

const postalUrl = `https://api.postalpincode.in/pincode/`;

const getModelData = function () {
  return model;
}

const pinCodeInputHandler = function () {
  resetUserData.call(this);
  updatePinCode.call(this);
}

const updatePinCode = function () {
  if(this.value == null || this.value.length !== 6)    
    return;

  model.pinCode = this.value;
  model.userData['zip-code'] = model.pinCode;
  createRequest(createPostalUrl());
}

const resetUserData = function () {
  if(this.value == null || this.value.length !== 6)    
    return;
  const userData = model.userData;
  for (const prop in userData){
  userData[prop] = null;
  }
  view.render(model);
}

const takeUserData = function () {
  if(this.value != null){
    model.userData[this.id] = this.value;
  }
}

const postalUpdatePageSuccess = function (data) {

  const parsedData = JSON.parse(data);
  console.log(parsedData);
  const places = parsedData[0].PostOffice;

  if(places === null) {
    const choiceChipsDiv = document.querySelector('.choice_chips');
    choiceChipsDiv.innerHTML = `<p>
      Sorry! Invalid Pin Code
    </p>`;
    choiceChipsDiv.classList.add('invalid_pin');
    choiceChipsDiv.parentNode.classList.add('unpad');
    return;
  }
  
  const placeInfo = {
    country: places[0].Country,
    city: places[0].Block,
    district: places[0].District,
    state: places[0].State,
  }
  const addresses = places.map(place => place.Name);

  if(addresses.length){
    const choiceChipsDiv = document.querySelector('.choice_chips');
    choiceChipsDiv.innerHTML = '';
    choiceChipsDiv.classList.remove('invalid_pin');
    choiceChipsDiv.parentNode.classList.remove('unpad');
    addresses.forEach(address => {
      const choiceDiv = document.createElement('div');
      choiceDiv.classList.add('choice_chip');
      choiceDiv.innerHTML = `<p>${address}</p>`;
      choiceDiv.onclick = choiceClickHandler;
      choiceChipsDiv.appendChild(choiceDiv);
    })
  }

  updateUserData(placeInfo);
  view.render(model);
}

const updateUserData = function(placeInfo) {
  
  const userData = model.userData;

  for (const prop in placeInfo){
    userData[prop] = placeInfo[prop];
  } 
}

const choiceClickHandler = function () {
  document.querySelectorAll('.choice_chip').forEach(choiceChip => choiceChip !== this ? choiceChip.classList.remove('selected') : choiceChip.classList.add('selected') );
  model.userData.address = this.textContent;
  view.render(model);
}

const postalUpdatePageError = function (error) {
  console.log(error);
}

const responseMethod = function (httpRequest, succeed, failure) {
  if(httpRequest.readyState === 4){
    if(httpRequest.status === 200){
      succeed(httpRequest.responseText);
    } else {
      failure(httpRequest.status + ':' + httpRequest.responseText);
    }
  }
}

const createRequest = function (url) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener('readystatechange', () => responseMethod(httpRequest, postalUpdatePageSuccess, postalUpdatePageError));
  httpRequest.open('GET', url);
  httpRequest.send();
}

const createPostalUrl = function () {
    return postalUrl + model.pinCode;
}

view.init();