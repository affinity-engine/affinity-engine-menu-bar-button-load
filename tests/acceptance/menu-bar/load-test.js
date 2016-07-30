import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../../tests/helpers/module-for-acceptance';
import { $hook, hook } from 'ember-hook';

moduleForAcceptance('Acceptance | menu bar/load', {
  beforeEach() {
    localStorage.clear();
    Ember.$.Velocity.mock = true;
  },

  afterEach() {
    Ember.$.Velocity.mock = false;
  }
});

test('Affinity Engine | stage | Directions | Text', function(assert) {
  assert.expect(10);

  visit('/').then(() => {
    assert.equal($hook('affinity_engine_stage_direction_text').text().trim(), '1', 'text is correct');

    return click('.lxl-container');
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_text').text().trim(), '2', 'text is correct');

    return click(hook('affinity_engine_menu_bar_load'));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_load_menu').length, 1, 'menu opened');
    assert.equal($hook('ember_flex_menu_option').length, 1, 'autosave option available');

    return click($hook('affinity_engine_menu_bar_menu_screen').get(0));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_load_menu').length, 0, 'menu is closed');

    return click('.lxl-container');
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_text').text().trim(), '3', 'text is correct');

    return click(hook('affinity_engine_menu_bar_save'));
  }).then(() => {
    return click($hook('ember_flex_menu_option_button').get(0));
  }).then(() => {
    return fillIn(hook('ember_flex_menu_option_input'), 'foo');
  }).then(() => {
    return keyDown('Enter');
  }).then(() => {
    return click('.lxl-container');
  }).then(() => {
    assert.equal($hook('affinity_engine_stage_direction_text').text().trim(), '4', 'text is correct');

    return click(hook('affinity_engine_menu_bar_load'));
  }).then(() => {
    assert.equal($hook('ember_flex_menu_option').length, 4, 'all save options available');

    return click($hook('ember_flex_menu_option_button').get(1));
  }).then(() => {
    assert.equal($hook('affinity_engine_menu_bar_load_menu').length, 0, 'menu is closed');
    assert.equal($hook('affinity_engine_stage_direction_text').text().trim(), '3', 'text is correct');
  });
});
