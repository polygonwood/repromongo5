import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import '../imports/ui/repromongo5.js';

import './main.html';

Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});


// Application state variables
// routertenant : tenant info we have from route but not logged in yet
// lastlogin : last login date of user, retrieved from db and updated to 'now' after retrieval
// touch : touch variable to wake up helper, used e.g. in header.js

Router.route('/', {
  name: 'rootRoute',
  layoutTemplate: 'info',
  action: function () {
    console.log('route /');
    Router.go('/test1');
  }
});

Router.route('/test2', {
  layoutTemplate: "info",
  action: async function () {
    this.render('test2');
  },
  name: 'test2Route',
  // controller: 'authenticatedController',
  waitOn: function () {
    var tenant = 'vijverzonen';
    let session = 'ptt';
    console.log('wait on test2', tenant, session);
    return [
      this.subscribe('stations', tenant, session),
    ]
  }
});

Router.route('/test1', {
  layoutTemplate: 'info',
  name: 'test1Route',
  action: function () {
    console.log('route test 1 start action');
    this.render('test1');
  },
  waitOn: function () {
    console.log('test1 waiton');
    var tenant = 'vijverzonen';
    let session = 'ptt';
    //console.log('waiton mailreg',tenant,event,member) ;
    return [
      this.subscribe('public.stations', tenant, session)
    ]
  }
})