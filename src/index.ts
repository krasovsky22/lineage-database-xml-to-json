import * as fs from 'fs';
import path from 'path';
import parseAndConvertItems from './ItemsConverter';
import parseAndConvertRecipes from './RecipesConverter';

const SOURCE_FOLDER = 'datasource' as const;
const ITEMS_SOURCE_FOLDER = `datasource/items` as const;
const RESULT_FOLDER = path.resolve(__dirname, 'output');

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

const resultedItems = {};
itemFiles.forEach((itemFile) => {
  const xmlItemFileName = path.resolve(
    __dirname,
    ITEMS_SOURCE_FOLDER + '/' + itemFile
  );

  const parsedItems = parseAndConvertItems(xmlItemFileName);
  Object.assign(resultedItems, parsedItems);
});

//parse and convert
const parsedRecipes = parseAndConvertRecipes(xmlRecipeFileName);

//split items into categories they belong for easier search

//make output directory if doesn't exist
if (!fs.existsSync(RESULT_FOLDER)) {
  fs.mkdirSync(RESULT_FOLDER);
}

fs.writeFileSync(recipesOutputFile, JSON.stringify(parsedRecipes));
fs.writeFileSync(itemsOutputFile, JSON.stringify(resultedItems));
