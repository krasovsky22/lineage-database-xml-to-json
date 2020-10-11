import * as fs from 'fs';
import { parse } from 'fast-xml-parser';
import { decode } from 'he';

const parseOptions = {
  attributeNamePrefix: '',
  attrNodeName: 'attr', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: true,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false,
  attrValueProcessor: (val: string) => decode(val, { isAttributeValue: true }), // default is a=>a
  tagValueProcessor: (val: string) => decode(val), // default is a=>a
  stopNodes: ['parse-me-as-string'],
};

const parseFile = <T>(filename: string): T => {
  const data = fs.readFileSync(filename, 'utf8');

  return parse(data, parseOptions, true);
};

export default parseFile;
