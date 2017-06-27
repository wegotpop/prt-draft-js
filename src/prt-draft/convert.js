/* @flow */

// HACK: Temporary types
type PRTDocument  = Object;
type PRTPlainText = String | string;

/* Import PRT-Draft objects */
import draftJsToPrt    from 'prt-draft/convert-from';
import prtToDraftJs    from 'prt-draft/convert-to';
import PopDraftDialect from 'prt-draft/dialect';


/*----------------------------------------------------------------------------*/
const Dialect = new PopDraftDialect();

/*----------------------------------------------------------------------------*/
export type PrtToDraft = (PRTDocument) => Object;
export const convertPrtToDraftJs: PrtToDraft = (document) => {
  const { _, version, dialect, elements } = document;
  return prtToDraftJs(elements, Dialect);
};


/*----------------------------------------------------------------------------*/
export type DraftToPrt = (Object, PRTPlainText, PRTPlainText) => PRTDocument;
export const convertDraftJsToPrt: DraftToPrt = (rawState, version, dialect) => {
  /* Create new document and return it */
  return {
    type: 'PRTDocument',
    version,
    dialect,
    elements: draftJsToPrt(rawState.blocks, rawState.entityMap, Dialect),
  };
};
