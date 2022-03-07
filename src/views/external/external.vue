<template>
  <div>&nbsp;</div>
</template>
<script>
import qs from 'qs';

export default {
  name: 'External',
  data() {
    return {
      MISSING_ID: false,
      PAGE_ID: null,
      PARAMS: {}
    }
  },

  computed: {
    iframes: function() {
      return this.$store.state.Iframes.IFRAMES_STATE;
    },
    pages: function() {
      return this.$store.getters.IFRAMES_PAGES;
    }
  },

  created() {
    const externalParameters = qs.parse(this.$route.query);
    const currentUser = JSON.parse(window.sessionStorage.getItem('currentUser'));
    const selectedSystem = JSON.parse(window.sessionStorage.getItem('selectedSystem'));

    this.PAGE_ID = externalParameters.code.toUpperCase();

    const parameters = {
      userSysId: selectedSystem.userSysId,
      hisOrgId: currentUser.orgId,
      hisHospitalId: currentUser.hospitalId,
      deptId: selectedSystem.deptId
    };

    this.PARAMS = parameters;

    const pageList = this.pages;
    if (this.PAGE_ID === null || pageList[this.PAGE_ID] === null) {
      this.MISSING_ID = false;
      console.log(`缺少 PAGE_ID ${this.PAGE_ID} 参数`);
      return;
    }
    const obj = {
      key: this.PAGE_ID,
      params: parameters
    };

    this.$store.dispatch('createdPage', obj);
  },

  activated() {
    if (this.MISSING_ID) return;
    const params = this.iframes[this.PAGE_ID].params;

    if (params !== null && this.PARAMS !== null && params !== this.PARAMS) {
      this.$store.dispatch('changeParams', {
        key: this.PAGE_ID,
        params: this.PARAMS
      })
    }
    this.$store.dispatch('activatedPage', this.PAGE_ID);
  },

  deactivated() {
    if (this.MISSING_ID) return;

    this.$store.dispatch('deactivatedPage', this.PAGE_ID)
  },

  beforeDestroy() {
    if (this.MISSING_ID) return;

    this.$store.dispatch('beforeDestroyPage', this.PAGE_ID);
  }
}
</script>
