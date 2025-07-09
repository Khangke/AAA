import React from 'react';
import { 
  IoHomeOutline, 
  IoStorefrontOutline, 
  IoInformationCircleOutline, 
  IoNewspaperOutline, 
  IoCallOutline, 
  IoBagOutline, 
  IoPersonOutline, 
  IoLogInOutline,
  IoSparkles,
  IoRemoveOutline,
  IoAddOutline,
  IoBagAddOutline,
  IoFlashOutline,
  IoRefreshOutline,
  IoCloseOutline,
  IoTrashOutline,
  IoCardOutline,
  IoArrowBackOutline,
  IoCheckmarkOutline,
  IoCreateOutline,
  IoLogOutOutline,
  IoSendOutline,
  IoLocationOutline,
  IoMailOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoArrowForwardOutline,
  IoChatbubbleOutline,
  IoStar,
  IoStarOutline
} from 'react-icons/io5';

const IconWrapper = ({ icon, size = 24, color = 'currentColor', className = '', ...props }) => {
  const iconMap = {
    'home-outline': IoHomeOutline,
    'storefront-outline': IoStorefrontOutline,
    'information-circle-outline': IoInformationCircleOutline,
    'newspaper-outline': IoNewspaperOutline,
    'call-outline': IoCallOutline,
    'bag-outline': IoBagOutline,
    'person-outline': IoPersonOutline,
    'log-in-outline': IoLogInOutline,
    'sparkles': IoSparkles,
    'remove-outline': IoRemoveOutline,
    'add-outline': IoAddOutline,
    'bag-add-outline': IoBagAddOutline,
    'flash-outline': IoFlashOutline,
    'refresh-outline': IoRefreshOutline,
    'close-outline': IoCloseOutline,
    'trash-outline': IoTrashOutline,
    'card-outline': IoCardOutline,
    'arrow-back-outline': IoArrowBackOutline,
    'checkmark-outline': IoCheckmarkOutline,
    'create-outline': IoCreateOutline,
    'log-out-outline': IoLogOutOutline,
    'send-outline': IoSendOutline,
    'location-outline': IoLocationOutline,
    'mail-outline': IoMailOutline,
    'time-outline': IoTimeOutline,
    'eye-outline': IoEyeOutline,
    'arrow-forward-outline': IoArrowForwardOutline,
    'chatbubble-outline': IoChatbubbleOutline,
    'star': IoStar,
    'star-outline': IoStarOutline
  };

  const IconComponent = iconMap[icon] || IoHomeOutline;

  return (
    <IconComponent
      size={size}
      color={color}
      className={className}
      style={{ 
        verticalAlign: 'middle',
        display: 'inline-block',
        lineHeight: 1,
      }}
      {...props}
    />
  );
};

export default IconWrapper;