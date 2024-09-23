const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY3B5ZWFrZm9md2FvZ3lxY2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0MzM2MzksImV4cCI6MjAzMDAwOTYzOX0.RgWXhdf_1ncEQdPECo7J1gbMLNRBom6tQ4Hj4PBLL4Q";
const supabaseUrl = "https://ujcpyeakfofwaogyqcja.supabase.co";
const supabaseKey = SUPABASE_KEY;
import { createClient } from "@supabase/supabase-js";

let supabase = null; //createClient(supabaseUrl, supabaseKey);

export class SupabaseBackend {
  constructor() {
    this.client = supabase;
  }
  async init() {
    supabase = createClient(supabaseUrl, supabaseKey);
    return this;
  }

  async importBibleVerses(rows) {
    const { data, error } = await supabase.from("bible").insert(rows);
    if (error) throw error;
    return data;
  }

  async loadBibleVerses(version, startReference, endReference) {
    if (!startReference || !endReference) return [];
    const { data, error } = await supabase
      .from("bible")
      .select("id, ref_id, txt, html, data")
      .eq("version_id", version)
      .gte("ref_id", parseInt(startReference))
      .lte("ref_id", parseInt(endReference))
      .order("ref_id", { ascending: true });
    if (error) throw error;
    return data;
  }

  async loadBibleVerse(version, bookId, chapter, verse) {
    let id = `${bookId}${chapter.toString().padStart(3, "0")}${verse
      .toString()
      .padStart(3, "0")}`;
    const { data, error } = await supabase
      .from("bible")
      .select("txt, html")
      .eq("version_id", version)
      .eq("ref_id", parseInt(id));

    if (error) throw error;
    return data;
  }

  async loadBible(version, bookId, chapter) {
    let start_id = `${bookId}${chapter.toString().padStart(3, "0")}001`;
    let end_id = `${bookId}${(chapter + 1).toString().padStart(3, "0")}001`;
    const { data, error } = await supabase
      .from("bible")
      .select("id, ref_id, txt, html, data")
      .eq("version_id", version)
      .gte("ref_id", parseInt(start_id))
      .lte("ref_id", parseInt(end_id))
      .order("ref_id", { ascending: true });
    //console.log({ error });
    if (error) throw error;
    return data;
  }

  async loadCommentaryVerse(name, bookId, chapter, verse) {
    let id = `${bookId}${chapter.toString().padStart(3, "0")}${verse
      .toString()
      .padStart(3, "0")}`;
    const { data, error } = await supabase
      .from("commentary")
      .select("*")
      .eq("version_id", name)
      .eq("ref_id", parseInt(id))
      .order("ref_id", { ascending: true });
    if (error) throw error;
    return data;
  }
  async loadCommentary(name, bookId, chapter) {
    let start_id = `${bookId}${chapter.toString().padStart(3, "0")}001`;
    let end_id = `${bookId}${(chapter + 1).toString().padStart(3, "0")}001`;
    const { data, error } = await supabase
      .from("commentary")
      .select("*")
      .eq("version_id", name)
      .gte("ref_id", parseInt(start_id))
      .lte("ref_id", parseInt(end_id))
      .order("ref_id", { ascending: true });
    if (error) throw error;
    return data;
  }
  async loadConcordance(name, sNumber) {
    //console.log(sNumber);
    const { data, error } = await supabase
      .from("concordance")
      .select("*")
      .eq("version_id", name)
      .eq("sn", sNumber)
      .order("sn", { ascending: true });
    if (error) throw error;
    //console.log(data);
    return data[0];
  }
  async searchConcordance(name, word) {
    const { data, error } = await supabase
      .from("concordance")
      .select("*")
      .eq("version_id", name)
      .eq("wrd", word)
      .order("sn", { ascending: true });
    if (error) throw error;
    return data;
  }
  async loadDictionary(name, sNumber) {
    const { data, error } = await supabase
      .from("dictionary")
      .select("*")
      .eq("version_id", name)
      .eq("sn", sNumber)
      .order("sn", { ascending: true });
    if (error) throw error;
    return data[0];
  }
  async searchDictionary(name, word) {
    const { data, error } = await supabase
      .from("dictionary")
      .select("*")
      .eq("version_id", name)
      .eq("wrd", word)
      .order("wrd", { ascending: true });
    if (error) throw error;
    return data;
  }

  async searchBible(search, bibleVersion, option) {
    let refFilter = "id.gt.0";
    if (option?.book) {
      refFilter = "ref.like." + option.book + " %";
    } else if (option?.nt) {
      refFilter = "id.gte.40001001";
    } else if (option?.ot) {
      refFilter = "id.lt.40001001";
    }
    const { data, error } = await supabase
      .from("bible")
      .select("*")
      .eq("version_id", bibleVersion)
      .or(refFilter, "id.lte.0")
      .textSearch("txt", `${search}`)
      //.or("txt.like." + search + "%", "txt.like." + "% " + search + "%")
      //.like("txt", "%" + search + "%");
      .order("ref_id", { ascending: true });
    if (error) throw error;
    return data;
  }
  async fullTextSearch(searchTerm, version = "kjv") {
    const { data, error } = await supabase
      .from(version)
      .select()
      .textSearch("txt", `${searchTerm}`);
    if (error) throw error;
    return data;
  }
  async downloadFile(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    if (error) throw error;
    return data;
  }
  /*async downloadLibrary(resourceType, resourceName) {
    let path = `${resourceType}/${resourceName}.zip`;
    return await this.downloadFile("library", path);
  }
  async downloadDataset(resourceType, resourceName) {
    let path = `${resourceType}/${resourceName}.zip`;
    return await this.downloadFile("data", path);
  }*/
  async downloadBible(version) {
    const { data, error } = await supabase
      .from("bible")
      .select("*")
      .eq("version_id", version);
    if (error) throw error;
    return data;
  }
  async downloadCommentary(name) {
    const { data, error } = await supabase
      .from("commentary")
      .select("*")
      .eq("version_id", name);
    if (error) throw error;
    return data;
  }

  async downloadConcordance(name) {
    const { data, error } = await supabase
      .from("concordance")
      .select("*")
      .eq("version_id", name);
    if (error) throw error;
    return data;
  }
  async downloadDictionary(name) {
    const { data, error } = await supabase
      .from("concordance")
      .select("*")
      .eq("version_id", name);
    if (error) throw error;
    return data;
  }
  async downloadResource(resourceType, name) {
    const { data, error } = await supabase
      .from(resourceType)
      .select("*")
      .eq("version_id", name);
    if (error) throw error;
    if (error) throw error;
    return data;
  }
  async downloadHeadings() {
    const { data, error } = await supabase.from("bible_headings").select("*");
    if (error) throw error;
    if (error) throw error;
    return data;
  }
  async downloadParagraphData() {
    const { data, error } = await supabase.from("bible_paragraphs").select("*");
    if (error) throw error;
    if (error) throw error;
    return data;
  }
  async downloadBibleReferences() {
    const { data, error } = await supabase.from("bible_references").select("*");
    if (error) throw error;
    return data;
  }
  async loadBibleHeadings(bookId, ch) {
    let bid = parseInt(bookId.toString());
    const { data, error } = await supabase
      .from("bible_headings")
      .select("*")
      .eq("bk_id", bid)
      .eq("chapter", ch);
    if (error) throw error;
    //console.log(data);
    return data[0].data || [];
  }

  async loadBibleParagraphs(bookId, ch) {
    let bid = parseInt(bookId.toString());
    const { data, error } = await supabase
      .from("bible_paragraphs")
      .select("*")
      .eq("bk_id", bid)
      .eq("chapter", ch);
    if (error) throw error;
    return data[0].data || [];
  }
  async countRecords(table, version) {
    const result = version
      ? await supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("version_id", version)
      : await supabase.from(table).select("id", { count: "exact", head: true });
    return result;
  }
  async fetchBatchedRecords(table, version) {
    //console.log(version);
    let record = await this.countRecords(table, version);
    if (record.error) throw record.error;
    const offset = 999;
    let startIndex = 0,
      stopIndex = offset;
    const results = [];
    do {
      const { data, error } = version
        ? await supabase
            .from(table)
            .select("*")
            .eq("version_id", version)
            .order("id")
            .range(startIndex, stopIndex)
        : await supabase
            .from(table)
            .select("*")
            .order("id")
            .range(startIndex, stopIndex);
      if (error) throw error;

      results.push(...data);
      //console.log(results.length);
      startIndex += offset + 1;
      stopIndex = startIndex + offset;
    } while (startIndex < record.count);
    //console.log(results.length);
    return results;
  }
  async fetchRecords(table, version, startIndex = 0, offset = 999) {
    //console.log(version);
    let record = await this.countRecords(table, version);
    if (record.error) throw record.error;
    //let stopIndex = offset;
    const { data, error } = version
      ? await supabase
          .from(table)
          .select("*")
          .eq("version_id", version)
          .order("id")
          .range(startIndex, startIndex + offset)
      : await supabase
          .from(table)
          .select("*")
          .order("id")
          .range(startIndex, startIndex + offset);
    if (error) throw error;
    return { data, error };
  }
}
