import { navigateTab } from '../../../utils/autopay/navigation.js';

Component({
  properties: { active: { type: String, value: 'home' } },
  methods: {
    openTab(event) { navigateTab(event.currentTarget.dataset.tab); },
  },
});
