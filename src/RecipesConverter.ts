import parseFile from './FileConverter';

interface ResultedIngredientType {
  id: number;
  count: number;
}

type RecipePropsType = {
  id: number;
  name: string;
  recipeId: number;
  craftLevel: string;
  type: 'dwarven' | 'common';
  successRate: number;
};

type ResultedRecipeFormatType = RecipePropsType & {
  ingredient: ResultedIngredientType[];
};

type ExpectedItemType = {
  attr: RecipePropsType;
  ingredient: ExpectedIngredientType[] | ExpectedIngredientType;
};

type ExpectedIngredientType = {
  attr: ResultedIngredientType;
};

type ExpectedRecipeType = {
  list: {
    item: ExpectedItemType[];
  };
};

export default function parseAndConvertRecipes(
  filePath: string
): ResultedRecipeFormatType[] {
  const {
    list: { item: rawRecipes },
  } = parseFile<ExpectedRecipeType>(filePath);

  return rawRecipes.map(({ attr, ingredient }: ExpectedItemType) => {
    const newIngredients: ResultedIngredientType[] = Array.isArray(ingredient)
      ? ingredient.map(({ attr }: ExpectedIngredientType) => attr)
      : [{ ...ingredient.attr }];

    return {
      ...attr,
      ingredient: newIngredients,
    };
  });
}
