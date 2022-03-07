import warning, { resetWarned } from './warning-utils';

export { resetWarned };

export default (valid, component, message = '') => {
  warning(valid, `[antdv: ${component}] ${message}`);
};
