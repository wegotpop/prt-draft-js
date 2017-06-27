/* @flow */

/* Import PRT-Draft objects */
import { sanitiseElements } from 'prt-draft/sanitisers';


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const compareRanges = (a, b) => a.offset - b.offset || a.length - b.length;


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const blockToPrt = (elements, dialect, text, type, ranges, entities) => {
  /* NOTE: Maybe this sorting is not even necessary...? */
  ranges.sort(compareRanges);

  /* Build elements based on properties of
     the previous and the current characters */
  let newStack;
  switch (type) {
    case 'unstyled':
    case 'atomic':
      type = null;
      newStack = () => [[]];
      break;
    default:
      type     = dialect.styleToIdentifier(type);
      newStack = () => [[type]];
      break;
  }

  let parent     = [];
  let parents    = [parent];
  let prevStack  = newStack();
  for (let i=0; i<text.length; ++i) {
    const char      = text[i];
    const currStack = newStack();
    let j;

    /* Get layers for character */
    for (j=0; j<ranges.length; ++j) {
      const { offset, length, style, key } = ranges[j];
      /* If character has the range */
      if (i >= offset && i < offset + length) {
        /* Inline style range */
        if (style !== undefined) {
          currStack.push([dialect.styleToIdentifier(style)]);
        }
        /* Entity range */
        else if (key !== undefined) {
          const entity = entities[key];
          const identifier = dialect.styleToIdentifier(entity.type);
          const attributes = {};
          const keys = Object.keys(entity.data);
          for (let k=0; k<keys.length; ++k) {
            const key = keys[k];
            const [name, value] =
              dialect.dataToAttribute(identifier, key, entity.data[key]);
            if (name) {
              attributes[name] = value;
            }
          }
          currStack.push([identifier, attributes]);
        }
      }
    }

    /* Create elements based on previous character's
       layers and the current one */
    for (j=0; j<Math.max(prevStack.length, currStack.length); ++j) {
      let prevFrame = prevStack[j];
      let currFrame = currStack[j];

      /* If current character has needs less style than the previous one */
      if (currFrame === undefined) {
        parents.pop();
        parent = parents[parents.length - 1];
      }
      /* If current character has needs more style than the previous one */
      else if (prevFrame === undefined) {
        const [identifier, attributes] = currFrame;
        parent.push([identifier, attributes || null, (parent = [])]);
        parents.push(parent);
      }
      /* If current character needs different styles than the previous one */
      else if (prevFrame[0] !== currFrame[0]) {
        /* Step up until common ancestor */
        for (let k=j; k<prevStack.length; ++k) {
          parents.pop();
          parent = parents[parents.length - 1];
        }
        /* Create a new branch */
        do {
          const [identifier, attributes] = currFrame;
          parent.push([identifier, attributes || null, (parent = [])]);
          parents.push(parent);
          currFrame = currStack[++j];
        } while (j<currStack.length);
        break;
      }
    }

    /* Add character */
    const prev = parent[parent.length - 1];
    if (prev instanceof String ||
        typeof prev === 'string') {
      parent[parent.length - 1] = prev + char;
    } else {
      parent.push(char);
    }

    /* Update state */
    prevStack = currStack;
  }

  if (type === null) {
    Array.prototype.push.apply(elements, parents[0]);
  } else {
    elements.push([type, prevStack[0][1] || null, parents[0]]);
  }
};


/*----------------------------------------------------------------------------*/
const draftJsToPrt = (blocks, entities, dialect) => {
  let level      = 0;
  let elements   = [];
  const branches = [elements];
  for (let i=0; i<blocks.length; ++i) {
    const { text, type, depth, inlineStyleRanges, entityRanges } = blocks[i];

    /* NOTE: The following simple depth increasing/decreasing solution is based
             on the assumption, that depth is an already sanitised integer,
             meaning, it is always continuously increasing (that is, 1 is
             followed by 2 and not 3 or 4 for example), cannot be negative, but
             can decrease more than one step. */

    /* Decrease depth */
    if (depth < level) {
      for (; depth < level; --level) {
        branches.pop();
        elements = branches[branches.length - 1];
      }
    }
    /* Increase depth */
    else if (depth > level) {
      for (; depth > level; ++level) {
        const element = elements[elements.length - 1];
        if (!(element[2] instanceof Array)) {
          element[2] = [element[2]];
        }
        branches.push(elements = element[2]);
      }
    }

    /* Convert blocks to PRT elements */
    blockToPrt(
      elements,
      dialect,
      text,
      type,
      inlineStyleRanges.concat(entityRanges),
      entities
    );
  }

  /* Return null, string or array */
  return sanitiseElements(branches[0]);
};


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default draftJsToPrt;
