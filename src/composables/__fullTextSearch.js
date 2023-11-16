import { limit, collection, query, where, getDocs } from "firebase/firestore";
import { triGram, dataGram } from "./__datagram";

export function filterQuery(field, op, value) {
  return where(field, op, value);
}
export function filterQueries(where_clauses = []) {
  const query = [];
  where_clauses.forEach((w) => {
    query.push(filterQuery(w.field, w.op, w.value));
  });
  return query;
}
export const search = async function (
  store,
  searchTxt,
  where_clauses,
  limits = 10
) {
  // First we build out all our search constraints
  const searchConstraints = [];
  dataGram(searchTxt).forEach((name) =>
    searchConstraints.push(where(`_smeta.${name}`, "==", true))
  );

  // Combine that with any other search constraint
  let constraints = [
    collection(getFirestore(), store),
    ...where_clauses,
    ...searchConstraints,
    limit(limits),
  ];

  // Build the query and get the documents
  const q = query.apply(this, constraints);
  const querySnapshot = await getDocs(q);

  const results = [];
  querySnapshot.forEach((doc) => results.push({ _id: doc.id, ...doc.data() }));
  return results;
};

