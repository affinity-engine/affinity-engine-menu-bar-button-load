import { Scene } from 'affinity-engine-stage';
import { task } from 'ember-concurrency';

export default Scene.extend({
  name: 'Load',

  start: task(function * (script) {
    yield script.data('count').increment();
    yield script.text(yield script.data('count'));

    script.scene('load');
  })
});
