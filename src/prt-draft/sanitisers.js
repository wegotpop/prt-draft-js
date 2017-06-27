/* @flow */

/* Mutually recursive element and elements sanitisers */

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export const sanitiseElement = (element) => {
  /* If element is null or an empty string */
  if (element === null ||
      !element.length) {
    return null;
  }
  /* If element is an array */
  else if (element instanceof Array) {
    const [identifier, attributes, elements] = element;
    return [identifier, attributes, sanitiseElements(elements)];
  }
  /* If element is a string */
  return element;
};


/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
export const sanitiseElements = (elements) => {
  /* If elements is null, empty string or empty array */
  if (elements === null ||
      !elements.length) {
    return null;
  }
  /* If elements is an array */
  else if (elements instanceof Array) {
    /* If elements contains a single entitiy of null or string */
    if (elements.length === 1 &&
        (elements[0] === null ||
         elements[0] instanceof String ||
         typeof elements[0] === 'string')) {
      return sanitiseElement(elements[0]);
    }
    return elements.map(sanitiseElement);
  }
  /* If elements is a string */
  return elements;
};
