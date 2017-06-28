/* @flow */

/* Import PRT-Draft objects */
import { NO_DEPTH, HAS_DEPTH, INLINE, ENTITY } from 'prt-draft/enums';


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const elementToBlocksAndEntityMap = (
  element,
  blocks,
  entityMap,
  dialect,
  textChunks,
  inlineStyleRanges,
  entityRanges,
  type,
  cursor,
  depth) => {
  if (element === null) {
    return;
  }
  else if (element instanceof Array) {
    const [identifier, attributes, elements] = element;
    let   [style, kind] = dialect.identifierToStyleAndType(identifier);

    let offset;
    let key;
    let attributesKeys;
    let data;
    let tempBlocks;
    let tempInlineStyleRanges;
    let tempDepth = depth;
    switch (kind) {
      case INLINE:
        offset = cursor[0];
        tempInlineStyleRanges = [];
        elementsToBlocksAndEntityMap(
          elements,
          tempBlocks,
          entityMap,
          dialect,
          textChunks,
          tempInlineStyleRanges,
          entityRanges,
          null,
          cursor,
        );
        inlineStyleRanges.push({
          style,
          offset,
          length: cursor[0] - offset,
        });
        Array.prototype.push.apply(inlineStyleRanges, tempInlineStyleRanges);
        break;

      case ENTITY:
        key = Object.keys(entityMap).length;
        attributesKeys = Object.keys(attributes);
        data = {};
        for (let i=0; i<attributesKeys.length; ++i) {
          const attributeKey = attributesKeys[i];
          const [name, value] = dialect.attributeToData(
            style, attributeKey, attributes[attributeKey]);
          data[name] = value;
        }
        entityMap[key] = {
          type: style,
          mutability: 'IMMUTABLE',
          data,
        };
        if (style === 'image') {
          offset = (cursor[0] = 0);
          style  = 'atomic';
        }
        else {
          offset = cursor[0];
          style = type;
        }
        tempBlocks = [];
        elementsToBlocksAndEntityMap(
          elements,
          tempBlocks,
          entityMap,
          dialect,
          [],
          [],
          entityRanges,
          style,
          cursor,
        );
        entityRanges.push({
          offset,
          length: cursor[0] - offset,
          key,
        });
        Array.prototype.push.apply(blocks, tempBlocks);
        break;

      case HAS_DEPTH:
        tempDepth = depth + 1;
      /* eslint-disable-next-line no-fallthrough */
      case NO_DEPTH:
        tempBlocks = [];
        cursor[0] = 0;
        elementsToBlocksAndEntityMap(
          elements,
          tempBlocks,
          entityMap,
          dialect,
          [],
          [],
          [],
          style,
          cursor,
          tempDepth,
        );
        Array.prototype.push.apply(blocks, tempBlocks);
        break;
    }
  }
  else {
    textChunks.push(element);
    cursor[0] += element.length;
  }
};

/* TODO: Refactor the extreme number of arguments into a single state-object */

/* TODO: The ultimate solution should be a per-character representation and then
         a "summarisation" on those, otherwise the smallest DraftJS rawState
         cannot be achieved */

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
const elementsToBlocksAndEntityMap = (
  elements,
  blocks,
  entityMap,
  dialect,
  textChunks,
  inlineStyleRanges,
  entityRanges,
  type,
  cursor,
  depth) => {

  /* Get/set default arguments */
  textChunks        = textChunks        || [];
  inlineStyleRanges = inlineStyleRanges || [];
  entityRanges      = entityRanges      || [];
  cursor            = cursor            || [0];
  depth             = depth             || 0;
  type              = type === undefined ? 'unstyled' : type;

  if (elements === null) {
    return;
  }
  else if (elements instanceof Array) {
    for (let i=0; i<elements.length; ++i) {
      const element = elements[i];
      elementToBlocksAndEntityMap(
        element,
        blocks,
        entityMap,
        dialect,
        textChunks,
        inlineStyleRanges,
        entityRanges,
        type,
        cursor,
        depth
      );
    }
  }
  else {
    textChunks.push(elements);
    cursor[0] += elements.length;
  }

  const text = textChunks.join('');
  if (type && text) {
    blocks.splice(0, 0, {
      text,
      type,
      // HACK: This is a terrible solution, but it is working...
      depth: depth ? depth - 1 : 0,
      inlineStyleRanges,
      entityRanges,
      data: {},
    });
  }
};


/*----------------------------------------------------------------------------*/
const prtToDraftJs = (elements, dialect) => {
  const blocks = [];
  const entityMap = {};
  elementsToBlocksAndEntityMap(elements, blocks, entityMap, dialect);
  // console.log(JSON.stringify({entityMap, blocks}));
  return {
    entityMap,
    blocks,
  };
};


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default prtToDraftJs;
