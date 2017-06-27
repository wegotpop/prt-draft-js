/* @flow */

/* Import PRT types */
// import type { PRTPlainText,
//               PRTAttributes,
//               PRTElements,
//               PRTDocument } from 'prt/v2/types';

type PRTDocument  = Object;
type PRTPlainText = String | string;

/* Import PRT-Client objects */
import { getPRTDialectByNameAndVersion } from 'prt-client';

/* Import PRT-Draft objects */
import draftJsToPrt from 'prt-draft/convert-from';
import prtToDraftJs from 'prt-draft/convert-to';


/*----------------------------------------------------------------------------*/
export type PrtToDraft = (PRTDocument) => Object;
export const convertPrtToDraftJs: PrtToDraft = (document) => {
  const { _, version, dialect, elements } = document;
  return prtToDraftJs(
    elements,
    getPRTDialectByNameAndVersion(dialect, version)
  );
};


/*----------------------------------------------------------------------------*/
export type DraftToPrt = (Object, PRTPlainText, PRTPlainText) => PRTDocument;
export const convertDraftJsToPrt: DraftToPrt = (rawState, version, dialect) => {
  /* Create new document and return it */
  return {
    type: 'PRTDocument',
    version,
    dialect,
    elements: draftJsToPrt(
      rawState.blocks,
      rawState.entityMap,
      getPRTDialectByNameAndVersion(dialect, version)
    ),
  };
};
