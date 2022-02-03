import { Template } from 'meteor/templating';
import { Stations } from '../api/stations.js';

import './test2.html';


function getGPSPosition() {
  return new Promise((resolve, reject) => {
      getGPSBrowser((coordinates) => {
          resolve(coordinates)
      }, (errorResponse) => reject(false))
  })
};

function getGPSBrowser(successCB, errorCB) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          // console.log(convertDMS(position.coords.latitude, position.coords.longitude))
          successCB(convertDMS(position.coords.latitude, position.coords.longitude));
      }, function (error) {
          console.log('location not available', error);
          errorCB(error)
      });
  } else {
      console.log("Sorry, your browser does not support HTML5 geolocation.");
      errorCB();
  }
};

function GPSPadding(num, pad, precision) {
  let aftercomma = (num - Math.floor(num)).toFixed(precision);
  let result;
  result = Math.floor(num).toString().padStart(pad, 0) + aftercomma.toString().slice(1);
  // console.log('gps padding result', result);
  return result;
};

function convertDMS(lat, lng) {
  let convertLat = Math.abs(lat);
  let LatDeg = Math.floor(convertLat);
  let LatMin = (convertLat - LatDeg) * 60;
  LatMin = Math.abs(LatMin.toFixed(3));
  let LatSec = convertLat - LatDeg - LatMin;
  LatSec = Math.abs(LatSec.toFixed(1));
  let LatCardinal = ((lat > 0) ? "N" : "S");
  let convertLng = Math.abs(lng);
  let LngDeg = Math.floor(convertLng);
  let LngMin = (convertLng - LngDeg) * 60;
  LngMin = Math.abs(LngMin.toFixed(3));
  let LngCardinal = ((lng > 0) ? "E" : "W");
  // padding
  return ['!' + GPSPadding(LatDeg, 2, 0) + '\xB0!' + GPSPadding(LatMin, 2, 2) + '\'!' + LatCardinal, GPSPadding(LngDeg, 3, 0) + '\xB0!' + GPSPadding(LngMin, 2, 2) + '\'!' + LngCardinal];
};

Template.test2.helpers({
  stations() {
    return Stations.find({}, { fields: { user: 1, station: 1 }, sort: { station: 1 } });
  }
})

Template.test2.onRendered(async function test2OnRendered() {
  let someCoords;
  try {
      someCoords = await getGPSPosition();
      if (!someCoords) {
          someCoords = convertDMS(Math.random() * 359.999, Math.random() * 359.999);
      }
  }
  catch (err) {
      // TODO generate random coords if browser can't provide them
      console.log("GPS error");
      someCoords = convertDMS(Math.random() * 359.999, Math.random() * 359.999);
  }
  // let someCoords = ['abcde','defgh'];
  let stationId = Stations.findOne({ session: 'ptt', user: 'ronny' })._id;
  console.log('update gps coord', someCoords, stationId);
  Meteor.call('stations.update', { _id: stationId, modifier: { $set: { 'gps': someCoords } } });
})
