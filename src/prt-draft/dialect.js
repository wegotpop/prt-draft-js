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
      /* Code */
      case 'CODE'                : return 0x02;
      /* Headers */
      case 'header-one'          : return 0x03;
      case 'header-two'          : return 0x04;
      case 'header-three'        : return 0x05;
      case 'header-four'         : return 0x06;
      case 'header-five'         : return 0x07;
      case 'header-six'          : return 0x08;
      case 'header-seven'        : return 0x09;
      /* Italic */
      case 'ITALIC'              : return 0x0A;
      /* Image */
      case 'image'               : return 0x0B;
      /* Paragraph */
      /* Preformatted */
      case 'code-block'          : return 0x0D;
      /* Strikethrough */
      case 'STRIKETHROUGH'       : return 0x0E;
      /* Underline */
      case 'UNDERLINE'           : return 0x0F;

      case 'blockquote'          : return -1;
      case 'unordered-list-item' : return -2;
      case 'ordered-list-item'   : return -3;

      case 'figure'              : return -4; // should return DIV

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
      /* Code */
      case 0x02 : return ['CODE'               , INLINE];
      /* Headers */
      case 0x03 : return ['header-one'         , NO_DEPTH];
      case 0x04 : return ['header-two'         , NO_DEPTH];
      case 0x05 : return ['header-three'       , NO_DEPTH];
      case 0x06 : return ['header-four'        , NO_DEPTH];
      case 0x07 : return ['header-five'        , NO_DEPTH];
      case 0x08 : return ['header-six'         , NO_DEPTH];
      case 0x09 : return ['header-seven'       , NO_DEPTH];
      /* Italic */
      case 0x0A : return ['ITALIC'             , INLINE];
      /* Image */
      case 0x0B : return ['image'              , ENTITY];
      /* Paragraph */
      /* Preformatted */
      case 0x0D : return ['code-block'         , NO_DEPTH];
      /* Strikethrough */
      case 0x0E : return ['STRIKETHROUGH'      , INLINE];
      /* Underline */
      case 0x0F : return ['UNDERLINE'          , INLINE];

      case -1   : return ['blockquote'         , NO_DEPTH];
      case -2   : return ['unordered-list-item', HAS_DEPTH];
      case -3   : return ['ordered-list-item'  , HAS_DEPTH];

      case -4   : return ['figure'             , NO_DEPTH];

      /* Unknown */
      default:
        throw new PopDraftInvalidIdentifier(identifier);
    }
  };


  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  dataToAttribute = (identifier, name, value) => {
    const invalid = () => {
      throw new PopDraftInvalidData(identifier, name)
    };
    switch (identifier) {
      case 0x00:
        switch (name) {
          case "url":
            return ["href", value];
          case "target":
            return [name, value];
          default:
            invalid();
        }
      case 0x0B:
        switch (name) {
          case "alt":
          case "src":
          case "title":
            return [name, value];
          default:
            invalid();
        }
      default:
        invalid();
    }
  };


  /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
  attributeToData = (style, name, value) => {
    const invalid = () => {
      throw new PopDraftInvalidAttribute(style, name)
    };
    switch (style) {
      case 'LINK':
        switch (name) {
          case "href":
            return ["url", value];
          case "target":
            return [name, value];
          default:
            invalid();
        }
      case 'image':
        switch (name) {
          case "alt":
          case "src":
          case "title":
            return [name, value];
          default:
            invalid();
        }
      default:
        invalid();
    }
  };
}


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export default PopDraftDialect;
