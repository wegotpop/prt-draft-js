/* @flow */

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
let _counter = 0;
const auto = () => _counter += 1;


/*----------------------------------------------------------------------------*/
export const
  NO_DEPTH  = auto(),
  HAS_DEPTH = auto(),
  INLINE    = auto(),
  ENTITY    = auto();
