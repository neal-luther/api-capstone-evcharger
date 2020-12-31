'use strict';

const apiKey = 'cbb52dca-f8f3-4c23-a420-14a4cb443a65'; 
const searchURL = 'https://api.openchargemap.io/v3/poi/';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

/*----------------------------Get Data----------------------------*/

function getChargeLocations() {
  navigator.geolocation.getCurrentPosition(pos => {
    getData(pos)
  })
}

  function getData(pos) {
    const params = {
      maxresults: 10,
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      distance: 50,
      distanceunit: "Miles",
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

/*----------------------------Display Charging Locations--------FIGURE OUT MAPS LINK AND ROUNDING TO WHOLE NUMBER FOR MILES--------------------*/

function displayChargeLocations(responseJson){
    console.log(responseJson);
    let placeHolder = [];
for (let i=0; i < responseJson.length; i++) {
    placeHolder.push(`
    <br><h3>${responseJson[i].AddressInfo.Title}</h3>
    <p>${responseJson[i].AddressInfo.AddressLine1}, ${responseJson[i].AddressInfo.Town}, ${responseJson[i].AddressInfo.StateOrProvince}, ${responseJson[i].AddressInfo.Postcode}</p>
    <p><strong>Distance:</strong>${responseJson[i].AddressInfo.Distance}<p><br> 
    `)
    $('.js-results-list').html(placeHolder);
    $('.js-results-list').removeClass('hidden');
}
}

/*----------------------------Form Watch----------------------------*/

  function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      //const maxDistance = $('#js-max-distance').val();  ADD FEATURE L
      getChargeLocations();
    });
  }
  
  $(watchForm);
