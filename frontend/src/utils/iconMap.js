// Icon mapping utility for Ionic Icons
import {
  // Navigation icons
  homeOutline,
  storefrontOutline,
  informationCircleOutline,
  newspaperOutline,
  callOutline,
  bagOutline,
  personOutline,
  logInOutline,
  
  // Action icons
  star,
  starOutline,
  removeOutline,
  addOutline,
  bagAddOutline,
  flashOutline,
  createOutline,
  closeOutline,
  logOutOutline,
  sendOutline,
  eyeOutline,
  refreshOutline,
  arrowForwardOutline,
  arrowBackOutline,
  checkmarkOutline,
  trashOutline,
  cardOutline,
  
  // Social & Contact icons
  logoFacebook,
  logoInstagram,
  chatbubble,
  call,
  mail,
  location,
  locationOutline,
  mailOutline,
  timeOutline,
  
  // Brand icons
  sparkles,
  
  // Info icons
  informationCircle,
  storefront,
  newspaper
} from 'ionicons/icons';

// Map string names to icon objects
export const iconMap = {
  // Navigation
  'home-outline': homeOutline,
  'storefront-outline': storefrontOutline,
  'information-circle-outline': informationCircleOutline,
  'newspaper-outline': newspaperOutline,
  'call-outline': callOutline,
  'bag-outline': bagOutline,
  'person-outline': personOutline,
  'log-in-outline': logInOutline,
  
  // Actions
  'star': star,
  'star-outline': starOutline,
  'remove-outline': removeOutline,
  'add-outline': addOutline,
  'bag-add-outline': bagAddOutline,
  'flash-outline': flashOutline,
  'create-outline': createOutline,
  'close-outline': closeOutline,
  'log-out-outline': logOutOutline,
  'send-outline': sendOutline,
  'eye-outline': eyeOutline,
  'refresh-outline': refreshOutline,
  'arrow-forward-outline': arrowForwardOutline,
  'arrow-back-outline': arrowBackOutline,
  'checkmark-outline': checkmarkOutline,
  'trash-outline': trashOutline,
  'card-outline': cardOutline,
  
  // Social & Contact
  'logo-facebook': logoFacebook,
  'logo-instagram': logoInstagram,
  'chatbubble': chatbubble,
  'call': call,
  'mail': mail,
  'location': location,
  'location-outline': locationOutline,
  'mail-outline': mailOutline,
  'time-outline': timeOutline,
  
  // Brand
  'sparkles': sparkles,
  
  // Info
  'information-circle': informationCircle,
  'storefront': storefront,
  'newspaper': newspaper
};

// Helper function to get icon from string name
export const getIcon = (iconName) => {
  return iconMap[iconName] || null;
};