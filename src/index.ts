import * as fs from 'fs';
import path from 'path';
import parseAndConvertItems, { ResultedItemType } from './ItemsConverter';
import parseAndConvertRecipes from './RecipesConverter';

const SOURCE_FOLDER = 'datasource' as const;
const ITEMS_SOURCE_FOLDER = `datasource/items` as const;
const RESULT_FOLDER = path.resolve(__dirname, 'output');

const ITEM_TYPE_KEY = 'type' as const;
const ETC_TYPE_VALUE = 'EtcItem' as const;
const ITEM_ETC_TYPE_KEY = 'etcitem_type' as const;

//source xml recipe file
const xmlRecipeFileName = path.resolve(
  __dirname,
  SOURCE_FOLDER + '/recipes.xml'
);

//resulted json recipe file
const recipesOutputFile = path.resolve(
  __dirname,
  RESULT_FOLDER + '/recipes.json'
);

const itemsOutputFile = path.resolve(__dirname, RESULT_FOLDER + '/items.json');

const xmlItemsFolder = path.resolve(__dirname, ITEMS_SOURCE_FOLDER);
const itemFiles = fs.readdirSync(xmlItemsFolder);

let resultedItemsArr: ResultedItemType[] = [];
itemFiles.forEach((itemFile) => {
  const xmlItemFileName = path.resolve(
    __dirname,
    ITEMS_SOURCE_FOLDER + '/' + itemFile
  );

  const parsedItems = parseAndConvertItems(xmlItemFileName);
  resultedItemsArr = [...resultedItemsArr, ...parsedItems];
});

type ResultedCategorizedItemsType = Record<
  string,
  Record<number, ResultedItemType>
>;

//split into categories and make sure they are unique
const resultedItems = resultedItemsArr.reduce(function (
  categorizedItemsArr: ResultedCategorizedItemsType,
  item: ResultedItemType
) {
  const tempItemType =
    item.type === ETC_TYPE_VALUE ? item[ITEM_ETC_TYPE_KEY] : item.type;

  const itemType = tempItemType?.toLowerCase() ?? 'unknown';

  if (!categorizedItemsArr.hasOwnProperty(itemType)) {
    categorizedItemsArr[itemType] = {};
  }

  Object.assign(categorizedItemsArr[itemType], { [item.id]: item });

  return categorizedItemsArr;
},
{});

//parse and convert
const parsedRecipes = parseAndConvertRecipes(xmlRecipeFileName);

//split items into categories they belong for easier search

//make output directory if doesn't exist
if (!fs.existsSync(RESULT_FOLDER)) {
  fs.mkdirSync(RESULT_FOLDER);
}

fs.writeFileSync(recipesOutputFile, JSON.stringify(parsedRecipes));
fs.writeFileSync(itemsOutputFile, JSON.stringify(resultedItems));
