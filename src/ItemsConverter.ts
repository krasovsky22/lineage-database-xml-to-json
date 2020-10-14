import { exit } from 'process';
import parseFile from './FileConverter';

type ItemAttrType = {
  id: number;
  type: string;
  name: string;
};

type ItemAdditionalPropsType = {
  icon: string;
  price: number;
};

type ResultedItemType = ItemAttrType & ItemAdditionalPropsType;
type ParsedItemSet = {
  attr: {
    name: string;
    val: string | number;
  };
};

type StatsAttrType = {
  attr: {
    stat: string;
    val: string;
  };
};

type ExpectedParsedItemType = {
  attr: ItemAttrType;
  set: ParsedItemSet[] | ParsedItemSet;
  for: {
    set: StatsAttrType[] | StatsAttrType;
  };
};

type ExpectedParsedItemFileResultType = {
  list: {
    item: ExpectedParsedItemType[];
  };
};

export default function parseAndConvertItems(
  itemsFilePath: string
): Record<number, ResultedItemType> {
  const {
    list: { item: rawItems },
  } = parseFile<ExpectedParsedItemFileResultType>(itemsFilePath);

  const parsedItems = rawItems.map(({ attr, set, for: forAttr }) => {
    const propsAttrResult: ItemAdditionalPropsType = { icon: '', price: 0 };

    const setArr = Array.isArray(set) ? set : [set];

    setArr.forEach(({ attr: { name, val } }) =>
      Object.assign(propsAttrResult, { [name]: val })
    );

    if (forAttr && forAttr?.set) {
      const setFor = forAttr.set;

      const setForAttr = Array.isArray(setFor) ? setFor : [setFor];

      setForAttr.forEach(({ attr }: StatsAttrType) => {
        Object.assign(propsAttrResult, { [attr.stat]: attr.val });
      });
    }

    return { ...propsAttrResult, ...attr };
  });
  const resultItemsArray: Record<number, ResultedItemType> = {};
  parsedItems.forEach((item: ResultedItemType) => {
    resultItemsArray[item.id] = item;
  });

  return resultItemsArray;
}
