let socket = io();

let formMessage = document.querySelector('#message-form');
let inputMessage = formMessage.elements.message;
let messageList = document.querySelector('#messages');
let messageTemplate = document.querySelector('#messages-template');
let btnSendLocation = document.querySelector('#send-location');
let locationTemplate = document.querySelector('#location-template');

socket.on('connect', function() {
   console.log('Connected to server');
});

socket.on('newMessage', function (message) {
   let timeFormat = moment(message.createAt).format('h:mm a');
   let template = messageTemplate.innerHTML;
   let html = Mustache.render(template, {
      from: message.from,
      text: message.text,
      createAt: timeFormat
   });

   messageList.insertAdjacentHTML('beforeend', html);
});

socket.on('disconnect', function() {
   console.log('Disconnected from server');
});

formMessage.addEventListener('submit', function (e) {
   e.preventDefault();

   socket.emit('createdMessage', {
      from: 'User',
      text: inputMessage.value
   }, function () {
      inputMessage.value = '';
   });
});

socket.on('newLocationMessage', function (message) {
   let timeFormat = moment(message.createAt).format('h:mm a');
   
   let template = locationTemplate.innerHTML;
   let html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: timeFormat
   });

   messageList.insertAdjacentHTML('beforeend', html);
});

btnSendLocation.addEventListener('click', function () {
   if (!navigator.geolocation) {
      alert('Browser not support geolocation');
      return;
   }

   btnSendLocation.setAttribute('disabled', 'disabled');
   btnSendLocation.textContent = 'Sending location...';

   navigator.geolocation.getCurrentPosition(function (pos) {
      btnSendLocation.removeAttribute('disabled');
      btnSendLocation.textContent = 'Send location';
      socket.emit('getLocation', {
         lat: pos.coords.latitude,
         long: pos.coords.longitude
      }, function () {
         btnSendLocation.removeAttribute('disabled');
         btnSendLocation.textContent = 'Send location';
         alert('Unable fetch location');
      });
   })
});