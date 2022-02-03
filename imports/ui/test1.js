import { Template } from 'meteor/templating';
import { Stations } from '../api/stations.js';

import './test1.html';

Template.test1.helpers({
  stations() {
    return Stations.find({}, { fields: { user: 1, station: 1 }, sort: { station: 1 } });
  }
})

Template.test1.events({
  'click #action'(event, instance) {
    Router.go('/test2');
  }
})