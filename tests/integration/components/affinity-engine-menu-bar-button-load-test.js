import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { deepStub } from 'affinity-engine';

const {
  getProperties,
  setProperties
} = Ember;

moduleForComponent('affinity-engine-menu-bar-button-load', 'Integration | Component | affinity engine menu bar button load', {
  integration: true
});

const configurationTiers = [
  'config.attrs.component.menuBar.button.load.attrs',
  'config.attrs.component.menuBar.attrs',
  'config.attrs.every.attrs'
];

configurationTiers.forEach((priority) => {
  test(`icon and iconFamily are assigned by priority ${priority}`, function(assert) {
    assert.expect(1);

    const stub = deepStub(priority, { iconFamily: 'affinity-engine-plugin-icon-font-awesome', icon: { type: 'cloud-upload' } });

    setProperties(this, getProperties(stub, 'config'));

    this.render(hbs`{{affinity-engine-menu-bar-button-load config=config}}`);

    assert.ok(this.$('i').hasClass('fa-cloud-upload'), 'icon correct');
  });
});
