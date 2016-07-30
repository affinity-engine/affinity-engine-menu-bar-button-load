import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-load-menu';
import { classNamesConfigurable, configurable, deepConfigurable, registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import { BusPublisherMixin } from 'ember-message-bus';
import multiton from 'ember-multiton-service';

const {
  Component,
  assign,
  computed,
  get,
  getProperties,
  isPresent,
  set
} = Ember;

const configurationTiers = [
  'config.attrs.component.menuBar.button.load',
  'config.attrs.component.menuBar.menu',
  'config.attrs.component.menuBar',
  'config.attrs'
];

export default Component.extend(BusPublisherMixin, ModalMixin, {
  layout,
  hook: 'affinity_engine_menu_bar_load_menu',

  saveStateManager: registrant('affinity-engine/save-state-manager'),
  config: multiton('affinity-engine/config', 'engineId'),

  menuColumns: configurable(configurationTiers, 'menuColumns'),
  customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
  iconFamily: configurable(configurationTiers, 'iconFamily'),
  keys: deepConfigurable(configurationTiers, 'keys'),

  options: computed('menuColumns', 'customClassNames', 'iconFamily', 'icon', 'keys', {
    get() {
      return assign({ classNames: get(this, 'customClassNames') }, getProperties(this, 'menuColumns', 'iconFamily', 'icon', 'keys'));
    }
  }),

  init(...args) {
    this._super(...args);

    get(this, 'saveStateManager.saves').then((saves) => {
      const choices = saves.sortBy('updated').reverseObjects().map((save) => {
        return {
          key: get(save, 'id'),
          object: save,
          text: get(save, 'fullName')
        };
      });

      set(this, 'choices', choices);
    });
  },

  actions: {
    closeModal() {
      this.closeModal();
    },

    onChoice(choice) {
      const save = get(choice, 'object');

      if (isPresent(save)) {
        const engineId = get(this, 'engineId');
        const sceneId = get(save, 'activeState.sceneId');
        const options = { autosave: false };

        this.publish(`ae:${engineId}:shouldLoadScene`, save, sceneId, options);
      }

      this.closeModal();
    }
  }
});
