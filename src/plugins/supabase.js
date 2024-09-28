const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm96b3piZ3VkZGx1ZWF3aXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc2MTkxNzgsImV4cCI6MjAzMzE5NTE3OH0.YwQR0Pl9pzHHnOigRjoIK7KMth_bNLupwuYxKo8VgKI";
const supabaseUrl = "https://iavozozbguddlueawixg.supabase.co";
//const db_pwd = "4fNL$6e-wKjRg?M";
const supabaseKey = SUPABASE_KEY;

import { createClient } from "@supabase/supabase-js";

const EXCLUDE_FIELDS = ["created_at", "created_at", "created_by", "id"];
var LIMIT_OFFSET = 50;
var supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseBackend {
  constructor(limit) {
    this.client = supabase = createClient(supabaseUrl, supabaseKey);
    LIMIT_OFFSET = limit ? limit : LIMIT_OFFSET;
  }
  async getRecord(collection) {
    const { data, error } = await supabase.from(collection).select();
    if (error) throw error;
    return data;
  }
  async getRecords(collection, fields) {
    let _fields = fields ? fields.join(",") : null;
    const { data, error } = await supabase
      .from(collection)
      .select(_fields)
      .order("created_at", "DESC")
      .limit(LIMIT_OFFSET);
    if (error) throw error;
    return data;
  }
  async getRecordsForUser(collection, userId, fields) {
    let _fields = fields ? fields.join(",") : null;
    const { data, error } = await supabase
      .from(collection)
      .select(_fields)
      .in("users", [userId])
      //.match({ : 2, name: "Albania" })
      //.not("name", "is", null)
      .order("created_at", "DESC")
      .limit(LIMIT_OFFSET);
    if (error) throw error;
    return data;
  }
  async addRecord(collection, record) {
    for (let field of EXCLUDE_FIELDS) {
      delete record[field];
    }
    const { data, error } = await supabase.from(collection).insert(record);
    if (error) throw error;
    return data;
  }
  async updateRecord(collection, record, id) {
    for (let field of EXCLUDE_FIELDS) {
      delete record[field];
    }
    const { data, error } = await supabase
      .from(collection)
      .update(record)
      .eq("id", id);
    if (error) throw error;
    return data;
  }

  async searchRecords(searchTerm, collection, field) {
    const { data, error } = await supabase
      .from(collection)
      .select("*")
      .or(
        field + ".like." + searchTerm + "%",
        field + ".like." + "% " + searchTerm + "%"
      )
      //.match({ id: 2, name: "Albania" })
      //.not("name", "is", null)
      .order("id", { ascending: true })
      .limit(LIMIT_OFFSET);
    if (error) throw error;
    return data;
  }
  async fullTextSearch(searchTerm, collection, field) {
    const { data, error } = await supabase
      .from(collection)
      .select()
      .textSearch(field, `${searchTerm}`)
      .limit(LIMIT_OFFSET);
    if (error) throw error;
    return data;
  }

  async downloadFile(bucket, path) {
    return await supabase.storage.from(bucket).download(path);
  }
  async uploadFile(bucket, path, data) {
    return await supabase.storage.from(bucket).upload(path, data);
  }
  async getPublicUrl(bucket, path) {
    return await supabase.storage.from(bucket).getPublicUrl(path);
  }
  async createDownloadUrl(bucket, path, hours = 1) {
    return await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 60 * 60 * hours);
  }
  async createDownloadUrls(bucket, paths, hours = 1) {
    return await supabase.storage
      .from(bucket)
      .createSignedUrls(paths, 60 * 60 * hours);
  }
  async createUploadUrl(bucket, path) {
    return await supabase.storage.from(bucket).createSignedUploadUrl(path);
  }
  async countRecords(collection, filter) {
    const result = await supabase
      .from(collection)
      .select("id", { count: "exact", head: true });
    //.or(...filter);
    return result;
  }

  async fetchRecords(collection, startIndex = 0, offset = 999) {
    let record = await this.countRecords(collection, version);
    if (record.error) throw record.error;
    const { data, error } = await supabase
      .from(collection)
      .select("*")
      .order("id")
      .range(startIndex, startIndex + offset)
      .limit(LIMIT_OFFSET);
    if (error) throw error;
    return { data, error };
  }
  async advancedSearch(collection, options) {
    let base = supabase
      .from("meta")
      .select("id, created_at, created_at, subject")
      .eq("table", collection);
    //console.log(search.date2,new Date(search.date2),Date.parse(new Date(search.date2)));

    if (options.date1) {
      base.gte("created_at", Date.parse(new Date(options.date1)));
    }
    if (options.date2) {
      base.lte("created_at", Date.parse(new Date(options.date2)));
    }
    if (options.staffId) {
      base.eq("staff_id", options.staffId);
    } else if (options.unitId) {
      base.eq("unit", options.unitId);
    } else if (options.location) {
      base.eq("location", options.location);
    }
    if (options.status) {
      base.eq("status", options.status);
    }
    if (options.search) {
      base.textSearch("subject", `${search}`);
    }
    return await base.order("id", "ASC").limit(LIMIT_OFFSET);
  }
  async defaultSearch(collection, userId, options) {
    // return latest items
    let base = supabase
      .from("meta")
      .select("id, created_at, created_at, subject")
      .eq("table", collection)
      .eq("to", userId);
    if (options.search) {
      base.textSearch("subject", `${search}`);
    }
    return base.order("created_at", "DESC").limit(LIMIT_OFFSET);
  }
}
export function useHistory() {
  return {
    coll_id: "",
    doc_id: "",
    date: 0,
    operation: "",
    unit: "",
    user: {
      uid: "",
      name: "",
    },
  };
}
export function useMeta() {
  return {
    coll_id: "",
    doc_id: "",
    subject: "",
    search: "",
    assigned: false,
    location: "",
    unit: "",
    status: "",
    time: 1718880688469,
    from: "",
    to: "",
    created_at: 1718880612070,
    created_at: 1718880612070,
    created_by: "",
    updated_by: "",
  };
}

/*export async function useDefaultSerachQuery(collection, uid) {
  //console.log(collectionName);
  var sql = [`SELECT * FROM ${collection} WHERE 1 = 1`];
  sql.push(`AND created_at >= ${date1}`);
  sql.push(`AND created_at <= ${date2}`);
  sql.push(`AND coll_id = ${collection}`);
  sql.push(`AND to = ${uid}`);

  if (error) throw error;
  return { data, error };
}
export function useSearchQuery(collection, options) {
  const queryString = [
    `SELECT id, created_at, created_at, subject FROM ${collection} WHERE 1 = 1`,
  ];
  //console.log(search.date2,new Date(search.date2),Date.parse(new Date(search.date2)));
  if (options.date1) {
    queryString.push(
      "AND created_at",
      ">=",
      Date.parse(new Date(options.date1))
    );
  }
  if (options.date2) {
    queryString.push(
      "AND created_at",
      "<=",
      Date.parse(new Date(options.date2))
    );
  }
  if (store.user.claims?.admin) {
    // Do nothing here
  }
  if (options.staffId) {
    queryString.push(" AND to", "=", options.staffId);
  } else if (options.unitId) {
    queryString.push("AND unit", "=", options.unitId);
  } else if (options.location) {
    queryString.push("AND Location", "=", options.location);
  }
  if (options.status) {
    queryString.push("AND status", "=", options.status);
  }
  return supabase.rpc("advanced_search", {}, {});
}
export async function onSearch(searchText) {
  const searchConstraints = [];
  if (searchText)
    searchConstraints.push(
      `WHERE search LIKE ${searchText}%' OR
         search LIKE '% ${searchText} %' `
    );
  const filters =
    filter || useSearchQuery(store.currentCollection, search.value);
  filters.unshift(...searchConstraints);
}
async function searchResource(collection) {}*/
