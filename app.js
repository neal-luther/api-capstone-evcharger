'use strict';

const apiKey = 'cbb52dca-f8f3-4c23-a420-14a4cb443a65'; 
const searchURL = 'https://api.openchargemap.io/v3/';


/*----------------------------Get Location----------------------------*/

function getPosition() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude + "," + position.coords.longitude);//logs location to console
        });
    } else {
        alert("Sorry, your browser does not support geolocation.");
    }
}

/*----------------------------Format URL----------------------------*/

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

/*----------------------------Get Data----------------------------*/

function getChargeLocations(/*?*/) {  //How/what do I pass here??  
    const params = {
      maxresults: 10,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      distance: 50;
      distanceunit: Miles,
      includecomments: true,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString + '&key=' + apiKey;
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayChargeLocations(responseJson))
      .catch(err => {
        $('.error-message').text(`Something went wrong: ${err.message}`);
      });
  }

/*----------------------------Display Charging Locations----------------------------*/

function displayChargeLocations(responseJson){
    console.log(responseJson);
    let placeHolder = [];
for (let i=0; i<responseJson.data.length; i++) {
    placeHolder.push(`
    <h1>${responseJson.data[i].AddressInfo.Title}</h1>
    <h2>${responseJson.data[i].OperatorInfo.WebsiteUrl}</h2>
    <h3>${responseJson.data[i].AddressInfo.AddressLine1}</h3>
    <h3>${responseJson.data[i].AddressInfo.AddressLine2}</h3>
    <h3>${responseJson.data[i].AddressInfo.Town}</h3>
    <h3>${responseJson.data[i].AddressInfo.StateOrProvince}</h3>
    `)
    $('.js-results-list').html(placeHolder);
    $('.js-results-list').removeClass('hidden');
}
}

/*----------------------------Form Watch----------------------------*/

  function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      //const maxDistance = $('#js-max-distance').val();  ADD FEATURE LATER
      getChargeLocations();
    });
  }
  
  $(watchForm);

  