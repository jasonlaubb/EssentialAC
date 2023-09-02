import en from '../lang/en_US.js';
import ch from '../lang/ch_TW.js';
import jp from '../lang/JPN.js';

function langs(language) {
  if(language == 0) return en
  if(language == 1) return ch
  if(language == 2) return jp
};

export { langs }