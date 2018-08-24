let socket = io();

let formMessage = document.querySelector('#form-message');
let messageList = document.querySelector('#message');
let btnSendLocation = document.querySelector('#send-location');

socket.on('connect', function() {
   console.log('Connected to server');
});

socket.on('newMessage', function (message) {
   messageList.insertAdjacentHTML('beforeend', `<li>${message.text}</li>`);
});

socket.on('disconnect', function() {
   console.log('Disconnected from server');
});

formMessage.addEventListener('submit', function (e) {
   e.preventDefault();

   socket.emit('createdMessage', {
      from: 'User',
      text: formMessage.elements.text.value
   }, function () {
      
   });
});

btnSendLocation.addEventListener('click', function () {
   if (!navigator.geolocation) {
      alert('Browser not support geolocation');
      return;
   }
   navigator.geolocation.getCurrentPosition(function (pos) {
      socket.emit('getLocation', {
         lat: pos.coords.latitude,
         long: pos.coords.longitude
      }, function () {

      });
   })
});