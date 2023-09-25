import FindProductsByKeys from '@GqlQueries/headless/findProductsByKeys.graphql';
import { fetchDataViaGql } from '@Lib/graphql/client';

async function getProductsByKeys(keys: string[]) {
  let foundProducts: any[] = [];
  const products: any[] = [];

  const { data } = await fetchDataViaGql(FindProductsByKeys, 'BFF', {
    variables: { keys: keys }
  });
  if (data && data.findProductsByKeys.products.length >= 1) {
    foundProducts = data.findProductsByKeys.products;
  }
  //data is returned in order that is first requested
  //perhaps this can be a parameter to check, but for now just sorting returned data in order it was
  //requesteds

  keys.forEach((key) => {
    const index = foundProducts.findIndex((product) => product.productKey === key);
    if (index >= 0) {
      products.push(foundProducts[index]);
    }
  });

  return products;
}

export { getProductsByKeys };
