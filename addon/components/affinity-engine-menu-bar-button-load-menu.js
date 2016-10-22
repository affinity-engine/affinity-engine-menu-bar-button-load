import Ember from 'ember';
import layout from '../templates/components/affinity-engine-menu-bar-button-load-menu';
import { classNamesConfigurable, configurable, registrant } from 'affinity-engine';
import { ModalMixin } from 'affinity-engine-menu-bar';
import multiton from 'ember-multiton-service';

const {
  Component,
  get,
  isPresent,
  set
} = Ember;

const { run: { later } } = Ember;

const configurationTiers = [
  'config.attrs.component.menuBar.button.load',
  'config.attrs.component.menuBar.menu',
  'config.attrs.component.menuBar',
  'config.attrs'
];

export default Component.extend(ModalMixin, {
  layout,
  hook: 'affinity_engine_menu_bar_load_menu',
  
  config: multiton('affinity-engine/config', 'engineId'),
  eBus: multiton('message-bus', 'engineId'),
  dataManager: registrant('affinity-engine/data-manager'),

  acceptKeys: configurable(configurationTiers, 'keys.accept'),
  animationLibrary: configurable(configurationTiers, 'animationLibrary'),
  cancelKeys: configurable(configurationTiers, 'keys.cancel'),
  customClassNames: classNamesConfigurable(configurationTiers, 'classNames'),
  header: configurable(configurationTiers, 'header'),
  iconFamily: configurable(configurationTiers, 'iconFamily'),
  menuColumns: configurable(configurationTiers, 'menuColumns'),
  moveDownKeys: configurable(configurationTiers, 'keys.moveDown'),
  moveLeftKeys: configurable(configurationTiers, 'keys.moveLeft'),
  moveRightKeys: configurable(configurationTiers, 'keys.moveRight'),
  moveUpKeys: configurable(configurationTiers, 'keys.moveUp'),
  transitionIn: configurable(configurationTiers, 'transitionIn'),
  transitionOut: configurable(configurationTiers, 'transitionOut'),

  init(...args) {
    this._super(...args);

    get(this, 'dataManager.saves').then((saves) => {
      const choices = saves.sortBy('updated').reverseObjects().map((save) => {
        return {
          key: get(save, 'id'),
          object: save,
          text: get(save, 'fullNameAndDate')
        };
      });

      set(this, 'choices', choices);
    });
  },

  actions: {
    closeModal() {
      set(this, 'willTransitionOut', true);
    },

    onChoice(choice) {
      const save = get(choice, 'object');

      if (isPresent(save)) {
        const eBus = get(this, 'eBus');
        const sceneId = get(save, 'activeState.sceneId');
        const options = { autosave: false };

        later(() => eBus.publish('shouldLoadScene', save, sceneId, options), 10);
      }

      set(this, 'willTransitionOut', true);
    }
  }
});
