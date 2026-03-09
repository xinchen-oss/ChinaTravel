import sgMail from '@sendgrid/mail';
import config from './env.js';

if (config.sendgridApiKey) {
  sgMail.setApiKey(config.sendgridApiKey);
}

export default sgMail;
