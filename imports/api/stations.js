import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { _ } from 'meteor/underscore';


export const Stations = new Mongo.Collection('stations');


Meteor.methods({
  'stations.update'(doc) {
    console.log('stations.update ->', doc, new Date());
    if (!doc.modifier['$set']) doc.modifier['$set'] = {};
    doc.modifier['$set']['modifiedAt'] = new Date();
    console.log('right before update', doc._id, doc.modifier);
    Stations.update({ _id: doc._id }, doc.modifier, function (err, num) {
      if (err) console.log('error while updating', err);
      else console.log('update count', num);
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish('stations', function (acttenant, session) {
    console.log('publish stations',acttenant,session);
    return Stations.find({ tenant: acttenant, session: session },
      {
        fields: {
          _id: 1, tenant: 1, session: 1, station: 1, channel: 1, description: 1, connected: 1, talking: 1,
          dualwatch: 1, highlow: 1, volume: 1, squelch: 1, user: 1, poweron: 1, locked: 1, mmsi: 1,
          name: 1, vessel: 1, gps: 1, gpspoweron: 1, mic: 1, cam: 1, hand: 1, heartbeat: 1, dsclog: 1
        }
      });
  });
  Meteor.publish('public.stations', function (acttenant, session) {
    console.log('publish public stations',acttenant,session);
    return Stations.find({ tenant: acttenant, session: session },
      {
        fields: {
          _id: 1, tenant: 1, session: 1, station: 1, user: 1
        }
      });
  });

  Stations.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });
}
