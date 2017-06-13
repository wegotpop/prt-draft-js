/* @flow */

/* Import PRT types */
import type { PRTPlainText,
              PRTAttributes,
              PRTElements,
              PRTDocument } from 'prt/v2/types';

/* Import PRT objects */
import { getPRTDialectByNameAndVersion } from 'prt';

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
type DraftJsToPrt = (any) => PRTDocument;
type PrtToDraftJs = (PRTDocument, any) => void;


/*----------------------------------------------------------------------------*/
class Convert {

  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  draftJsToPrt: DraftJsToPrt = (component, version, dialect) => {
    const dialect = getPRTDialectByNameAndVersion(dialect, version);
    return {type     : 'PRTDocument',
            version  : version,
            dialect  : dialect,
            elements : null};
  };

  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  prtToDraftJs: PrtToDraftJs = (prtDocument, component) => {
    const { type, version, dialect, elements } = prtDocument;
    const dialect = getPRTDialectByNameAndVersion(dialect, version);
  };
}


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default Convert;
