import parseFile from './FileConverter';

const ITEM_TYPE_KEY = 'type' as const;
const ETC_TYPE_VALUE = 'EtcItem' as const;
const ITEM_ETC_TYPE_KEY = 'etcitem_type' as const;

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

type ResultedCategorizedItemsType = Record<
  string,
  Record<number, ResultedItemType>
>;

export default function parseAndConvertItems(
  itemsFilePath: string
): ResultedCategorizedItemsType {
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

  //split into categories and make sure they are unique
  const categories: string[] = [
    ...new Set(
      parsedItems.map((item: ResultedItemType) => item[ITEM_TYPE_KEY])
    ),
  ];

  //create new object {weapon: [], armor: [], etc....}
  const categorizedItemsArr: ResultedCategorizedItemsType = {};

  parsedItems.forEach((item: ResultedItemType) => {
    const itemType = (item.type === ETC_TYPE_VALUE
      ? item[ITEM_ETC_TYPE_KEY]
      : item.type
    ).toLowerCase();

    if (!categorizedItemsArr[itemType]) {
      categorizedItemsArr[itemType] = {};
    }

    categorizedItemsArr[itemType][item.id] = item;
  });

  return categorizedItemsArr;
}
