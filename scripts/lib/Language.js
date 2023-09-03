import en from '../lang/en_US.js';
import ch from '../lang/ch_TW.js';
import jp from '../lang/JPN.js';
import { errorlogger } from './ErrorLogger.js';

function langs(language) {
try {
  if(language == 0) return en
  if(language == 1) return ch
  if(language == 2) return jp
} catch (e) {
  errorlogger(e, "language")
}
};

export { langs }
