/**
 * Validador de Inputs
 *
 * @param items ARRAY de itens para serem paginados
 * @param pageNumber INTEGER de número da página mostrada
 * @param pageSize INTEGER de quantidade de itens na página
 * @return { items } Retorna os itens daquela página
 */

import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
}
