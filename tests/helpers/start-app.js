import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';
import keyboardRegisterTestHelpers from './ember-keyboard/register-test-helpers';

export default function startApp(attrs) {
  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  return Ember.run(() => {
    let application = Application.create(attributes);
    keyboardRegisterTestHelpers();
    Ember.Test.registerAsyncHelper('delay', function(app, duration = 0) {
      return new Ember.RSVP.Promise((resolve) => {
        Ember.run.later(() => {
          resolve();
        }, duration);
      });
    });

    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
