/* @flow */

/* Import PRT-Draft objects */
import { NO_DEPTH, HAS_DEPTH, INLINE, ENTITY } from 'prt-draft/enums.js';

/*----------------------------------------------------------------------------*/
export const PopDraftError = function () {
  this.message = 'An error occured';
};
PopDraftError.prototype      = Object.create(Error.prototype);
PopDraftError.prototype.name = 'PopDraftError';

/*----------------------------------------------------------------------------*/
export const PopDraftInvalidTagName = function (tag: PRTPlainText) {
  this.message = 'Invalid tag name for pop dialect: ' +
                 `${tag.toString()} (type ${typeof tag})`;
};
PopDraftInvalidTagName.prototype      = Object.create(PopDraftError.prototype);
PopDraftInvalidTagName.prototype.name = 'PopDraftInvalidTagName';


/*----------------------------------------------------------------------------*/
export const PopDraftInvalidIdentifier = function (tag: PRTPlainText) {
  this.message = 'Invalid identifier for pop dialect: ' +
                 `${tag.toString()} (type ${typeof tag})`;
};
PopDraftInvalidIdentifier.prototype      = Object.create(PopDraftError.prototype);
PopDraftInvalidIdentifier.prototype.name = 'PopDraftInvalidIdentifier';


/*----------------------------------------------------------------------------*/
export const PopDraftInvalidData = function (identifier, data) {
  this.message = `Invalid data key for identifier ${identifier} dialect: ` +
                 `${data.toString()} (type ${typeof data})`;
};
PopDraftInvalidData.prototype      = Object.create(PopDraftError.prototype);
PopDraftInvalidData.prototype.name = 'PopDraftInvalidData';


/*----------------------------------------------------------------------------*/
export const PopDraftInvalidAttribute = function (identifier, data) {
  this.message = `Invalid attribute name for identifier ${identifier} ` +
                 `dialect: ${data.toString()} (type ${typeof data})`;
};
PopDraftInvalidAttribute.prototype      = Object.create(PopDraftError.prototype);
PopDraftInvalidAttribute.prototype.name = 'PopDraftInvalidAttribute';


/*----------------------------------------------------------------------------*/
class PopDraftDialect {

  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  styleToIdentifier = tagName => {
    switch (tagName) {
      /* Anchor */
      case 'LINK'                : return 0x00;
      /* Bold */
      case 'BOLD'                : return 0x01;
      /* Quate */
      case 'blockquote'          : return 0x02;
      /* Code */
      case 'CODE'                : return 0x03;
      /* Divider */
      case 'figure'              : return 0x04;
      /* Headers */
      case 'header-one'          : return 0x05;
      case 'header-two'          : return 0x06;
      case 'header-three'        : return 0x07;
      case 'header-four'         : return 0x08;
      case 'header-five'         : return 0x09;
      case 'header-six'          : return 0x0A;
      case 'header-seven'        : return 0x0B;
      /* Italic */
      case 'ITALIC'              : return 0x0C;
      /* Image */
      case 'image'               : return 0x0D;
      /* List item */
      case '__LI'                : return 0x0E;
      /* Ordered list */
      case 'ordered-list-item'   : return 0x0F;
      /* Paragraph */
      case '__P'                 : return 0x10;
      /* Preformatted */
      case 'code-block'          : return 0x11;
      /* Strikethrough */
      case 'STRIKETHROUGH'       : return 0x12;
      /* Span */
      case '__SPAN'              : return 0x13;
      /* Subscript */
      case '__SUB'               : return 0x14;
      /* Superscript */
      case '__SUP'               : return 0x15;
      /* Underline */
      case 'UNDERLINE'           : return 0x16;
      /* Unordered list */
      case 'unordered-list-item' : return 0x17;
      /* Unknown */
      default:
        throw new PopDraftInvalidTagName(tagName);
    }
  };

  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  identifierToStyleAndType = identifier => {
    switch (identifier) {
      /* Anchor */
      case 0x00 : return ['LINK'               , ENTITY];
      /* Bold */
      case 0x01 : return ['BOLD'               , INLINE];
      /* Quate */
      case 0x02 : return ['blockquote'         , NO_DEPTH];
      /* Code */
      case 0x03 : return ['CODE'               , INLINE];
      /* Divider */
      case 0x04 : return ['figure'             , NO_DEPTH];
      /* Headers */
      case 0x05 : return ['header-one'         , NO_DEPTH];
      case 0x06 : return ['header-two'         , NO_DEPTH];
      case 0x07 : return ['header-three'       , NO_DEPTH];
      case 0x08 : return ['header-four'        , NO_DEPTH];
      case 0x09 : return ['header-five'        , NO_DEPTH];
      case 0x0A : return ['header-six'         , NO_DEPTH];
      case 0x0B : return ['header-seven'       , NO_DEPTH];
      /* Italic */
      case 0x0C : return ['ITALIC'             , INLINE];
      /* Image */
      case 0x0D : return ['image'              , ENTITY];
      /* List item */
      case 0x0E : return ['__LI'               , INLINE];
      /* Ordered list */
      case 0x0F : return ['ordered-list-item'  , HAS_DEPTH];
      /* Paragraph */
      case 0x10 : return ['__P'                , INLINE];
      /* Preformatted */
      case 0x11 : return ['code-block'         , NO_DEPTH];
      /* Strikethrough */
      case 0x12 : return ['STRIKETHROUGH'      , INLINE];
      /* Span */
      case 0x13 : return ['__SPAN'             , INLINE]
      /* Subscript */
      case 0x14 : return ['__SUB'              , INLINE];
      /* Superscript */
      case 0x15 : return ['__SUP'              , INLINE];
      /* Underline */
      case 0x16 : return ['UNDERLINE'          , INLINE];
      /* Unordered list */
      case 0x17 : return ['unordered-list-item', HAS_DEPTH];

      /* Unknown */
      default:
        throw new PopDraftInvalidIdentifier(identifier);
    }
  };


  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  dataToAttribute = (identifier, name, value) => {
    const invalid = () => {
      throw new PopDraftInvalidData(identifier, name);
    };
    switch (identifier) {
      case 0x00:
        switch (name) {
          case 'url':
            return ['href', value];
          case 'target':
            return [name, value];
          default:
            return invalid();
        }
      case 0x0D:
        switch (name) {
          case 'alt':
          case 'src':
          case 'title':
            return [name, value];
          default:
            return invalid();
        }
      default:
        return invalid();
    }
  };


  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  attributeToData = (style, name, value) => {
    const invalid = () => {
      throw new PopDraftInvalidAttribute(style, name);
    };
    switch (style) {
      case 'LINK':
        switch (name) {
          case 'href':
            return ['url', value];
          case 'target':
            return [name, value];
          default:
            return invalid();
        }
      case 'image':
        switch (name) {
          case 'alt':
          case 'src':
          case 'title':
            return [name, value];
          default:
            return invalid();
        }
      default:
        return invalid();
    }
  };
}


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default PopDraftDialect;
