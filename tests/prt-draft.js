/* @flow */

/* Import PRT objects */
import {
  convertPrtToDraftJs,
  convertDraftJsToPrt,
} from 'prt-draft';

/* Import test static data */
import VALID_PRT_DATA_1 from 'static/valid-prt-1';
import VALID_PRT_DATA_2 from 'static/valid-prt-2';
import VALID_PRT_DATA_3 from 'static/valid-prt-3';
import VALID_PRT_DATA_4 from 'static/valid-prt-4';
import VALID_PRT_DATA_5 from 'static/valid-prt-5';
import VALID_PRT_DATA_6 from 'static/valid-prt-6';
import VALID_PRT_DATA_7 from 'static/valid-prt-7';
import VALID_PRT_DATA_8 from 'static/valid-prt-8';

import VALID_RAW_DATA_1 from 'static/valid-raw-1';
import VALID_RAW_DATA_2 from 'static/valid-raw-2';
import VALID_RAW_DATA_3 from 'static/valid-raw-3';
import VALID_RAW_DATA_4 from 'static/valid-raw-4';
import VALID_RAW_DATA_5 from 'static/valid-raw-5';
import VALID_RAW_DATA_6 from 'static/valid-raw-6';
import VALID_RAW_DATA_7 from 'static/valid-raw-7';
import VALID_RAW_DATA_8 from 'static/valid-raw-8';

import VALID_RAW_DATA_4_LONG from 'static/valid-raw-4-long';


/*----------------------------------------------------------------------------*/
test('Valid Convert DraftJS to PRT', () => {
  /* Empty */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_1, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_1);

  /* Single string */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_2, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_2);

  /* Nested inline styles */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_4, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_4);

  /* Nested depth-based list items */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_5, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_5);

  /* Compolex example */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_6, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_6);

  /* Simple image */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_7, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_7);

  /* Simple link */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_8, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_8);

  /* Everything */
});


/*----------------------------------------------------------------------------*/
test.skip('https://github.com/wegotpop/prt/issues/3', () => {
  /* String chunks */
  expect(convertDraftJsToPrt(VALID_RAW_DATA_3, '2.0', 'pop-draft'))
    .toEqual(VALID_PRT_DATA_3);
});


/*----------------------------------------------------------------------------*/
test('Valid Convert PRT to DraftJS', () => {
  /* Empty */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_1)).toEqual(VALID_RAW_DATA_1);

  /* Single string */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_2)).toEqual(VALID_RAW_DATA_2);

  /* Nested inline styles */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_4)).toEqual(VALID_RAW_DATA_4_LONG);

  /* Nested depth-based list items */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_5)).toEqual(VALID_RAW_DATA_5);

  /* Compolex example */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_6)).toEqual(VALID_RAW_DATA_6);

  /* Simple image */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_7)).toEqual(VALID_RAW_DATA_7);

  /* Simple link */
  expect(convertPrtToDraftJs(VALID_PRT_DATA_8)).toEqual(VALID_RAW_DATA_8);
});
