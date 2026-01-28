// Frontend integrity utilities for data and resource verification

/**
 * Verify image source integrity
 * @param {string} src - Image source URL
 * @returns {boolean} - Whether the source is trusted
 */
export const verifyImageIntegrity = (src) => {
  if (!src) return false;
  
  const trustedDomains = ['localhost:5001', 'localhost:5174'];
  const trustedProtocols = ['http:', 'https:'];
  
  try {
    const url = new URL(src, window.location.href);
    
    // Check protocol
    if (!trustedProtocols.includes(url.protocol)) {
      console.warn('Untrusted protocol:', url.protocol);
      return false;
    }
    
    // Check domain
    const isTrustedDomain = trustedDomains.some(domain => 
      url.hostname.includes(domain)
    );
    
    if (!isTrustedDomain) {
      console.warn('Untrusted domain:', url.hostname);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid URL:', src);
    return false;
  }
};

/**
 * Verify external link integrity
 * @param {string} href - External link URL
 * @returns {boolean} - Whether the link is trusted
 */
export const verifyExternalLinkIntegrity = (href) => {
  if (!href) return false;
  
  const trustedExternalDomains = [
    'instagram.com', 
    'facebook.com', 
    'twitter.com', 
    'youtube.com',
    'google.com',
    'rc-epay.esewa.com.np'
  ];
  
  try {
    const url = new URL(href);
    return trustedExternalDomains.includes(url.hostname);
  } catch (error) {
    console.error('Invalid external URL:', href);
    return false;
  }
};

/**
 * Verify form data integrity
 * @param {Object} formData - Form data object
 * @param {string} formType - Type of form ('registration', 'contact', etc.)
 * @returns {boolean} - Whether the form data is valid
 */
export const verifyFormDataIntegrity = (formData, formType = 'contact') => {
  if (!formData || typeof formData !== 'object') {
    return false;
  }
  
  // Define required fields based on form type
  let requiredFields = [];
  if (formType === 'registration') {
    requiredFields = ['name', 'email', 'password'];
  } else if (formType === 'contact') {
    requiredFields = ['name', 'email', 'message'];
  } else if (formType === 'login') {
    requiredFields = ['email', 'password'];
  } else if (formType === 'payment') {
    requiredFields = ['contact', 'address', 'cart', 'paymentMethod', 'total'];
  } else {
    // Default to contact form requirements
    requiredFields = ['name', 'email', 'message'];
  }
  
  const hasRequiredFields = requiredFields.every(field => 
    formData[field] && typeof formData[field] === 'string' && formData[field].trim().length > 0
  );
  
  if (!hasRequiredFields) {
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return false;
  }
  
  // Check for suspicious content (basic XSS prevention)
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  
  const hasSuspiciousContent = Object.values(formData).some(value =>
    suspiciousPatterns.some(pattern => pattern.test(value))
  );
  
  if (hasSuspiciousContent) {
    return false;
  }
  
  return true;
};

/**
 * Verify API response integrity
 * @param {Object} response - API response object
 * @returns {boolean} - Whether the response is valid
 */
export const verifyAPIResponseIntegrity = (response) => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  // Check for expected response structure
  const hasValidStructure = response.hasOwnProperty('data') || 
                           response.hasOwnProperty('msg') || 
                           Array.isArray(response);
  
  if (!hasValidStructure) {
    return false;
  }
  
  // Check for suspicious content in response
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  
  const responseString = JSON.stringify(response);
  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(responseString)
  );
  
  if (hasSuspiciousContent) {
    return false;
  }
  
  return true;
};

/**
 * Generate integrity hash for data
 * @param {Object} data - Data to hash
 * @returns {string} - Hash string
 */
export const generateIntegrityHash = (data) => {
  const dataString = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString(16);
};

export default {
  verifyImageIntegrity,
  verifyExternalLinkIntegrity,
  verifyFormDataIntegrity,
  verifyAPIResponseIntegrity,
  generateIntegrityHash
}; 