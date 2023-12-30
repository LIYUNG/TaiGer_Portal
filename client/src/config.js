export default {
  defaultPath: '/dashboard/default',
  basename: '/', // only at build time to set. If your app is served from a sub-directory on your server, you’ll want to set this to the sub-directory. A properly formatted basename should have a leading slash, but no trailing slash.
  layout: 'vertical', // vertical, horizontal (not available in lite version)
  collapseMenu: false, // mini-menu
  layoutType: 'menu-dark', // menu-dark, (menu-light, dark are not available in lite version)
  navIconColor: false,
  headerBackColor: 'header-default', // header-default, (header-blue, header-red, header-purple, header-lightblue, header-dark are not available in lite version)
  navBackColor: 'navbar-default', // navbar-default, (navbar-blue, navbar-red, navbar-purple, navbar-lightblue, navbar-dark are not available in lite version)
  navBrandColor: 'brand-default', // brand-default, (brand-blue, brand-red, brand-purple, brand-lightblue, brand-dark are not available in lite version)
  navBackImage: false, // not available in lite version
  rtlLayout: false, // not available in lite version
  navFixedLayout: true,
  headerFixedLayout: true, // not available in lite version
  navDropdownIcon: 'style1', // style1, (style2, style3 are not available in lite version)
  navListIcon: 'style1', // style1, (style2, style3, style4, style5, style6 are not available in lite version)
  navActiveListColor: 'active-default', // active-default, (active-blue, active-red, active-purple, active-lightblue, active-dark are not available in lite version)
  navListTitleColor: 'title-default', // title-default, (title-blue, title-red, title-purple, title-lightblue, title-dark are not available in lite version)
  navListTitleHide: false, // not available in lite version
  preLayout: null, // (not available in lite version)
  layout6Background:
    'linear-gradient(to right, #FFFFFF 0%, #888888 52%, #000000 100%)', // used only for pre-layout = layout-6
  layout6BackSize: '' // used only for pre-layout = layout-6
};

export const appConfig = {
  // Branding
  companyName: 'TaiGer',
  companyFullName: 'TaiGer Consultancy',
  companycompanyLandingPage: 'https://taigerconsultancy.com/',
  LoginPageLogo: '/assets/images/taiger_logo.png',
  LogoSmall: '/assets/taiger_logo_small.png',
  LogoPath: '',
  // Application level comfiguration
  vpdEnable: true,
  meetingEnable: true,
  messengerEnable: true,
  AIEnable: true
};
