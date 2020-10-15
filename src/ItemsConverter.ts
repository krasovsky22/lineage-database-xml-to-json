import parseFile from './FileConverter';

type ItemAttrType = {
  id: number;
  type: string;
  etcitem_type: string;
  name: string;
};

type ItemAdditionalPropsType = {
  icon: string;
  price: number;
};

export type ResultedItemType = ItemAttrType & ItemAdditionalPropsType;
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
): ResultedItemType[] {
  const {
    list: { item: rawItems },
  } = parseFile<ExpectedParsedItemFileResultType>(itemsFilePath);

  return rawItems.map(({ attr, set, for: forAttr }) => {
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
}
