/* @flow */

/* Import PRT-client objects */
import { registerPRTDialectByNameAndVersion } from 'prt-client';

/* Import PRT-Draft objects */
import PopDraftDialect, {
  PopDraftInvalidTagName,
} from 'prt-draft/dialect';

import {
  convertPrtToDraftJs,
  convertDraftJsToPrt,
} from 'prt-draft/convert';


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Register default dialect */
registerPRTDialectByNameAndVersion('pop-draft', '2.0', PopDraftDialect);


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* Export everything */
export {
  /* Generic */
  convertPrtToDraftJs,
  convertDraftJsToPrt,

  /* Dialect related */
  PopDraftDialect,

  /* Errors */
  PopDraftInvalidTagName,
};
