import { Notify } from "quasar";
import { api } from "src/boot/axios";
//import { useDefaultStore } from "src/stores/store";
//const store = useDefaultStore();

export function useBackend() {
  async function get(path, id, { onSuccess, onError } = {}) {
    const _path = `${path}/${id}`;
    try {
      let response = await api.get(_path);
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText + ". " + (onError || ""),
      });
    }
  }
  async function search(path, params, { onSuccess, onError } = {}) {
    const _path = `${path}?${params}`;
    try {
      let response = await api.get(_path);
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText + ". " + (onError || ""),
      });
    }
  }
  async function post(path, data, { onSuccess, onError } = {}) {
    try {
      let response = await api.post(path, data);
      Notify.create({
        icon: "check",
        color: "secondary",
        message: onSuccess || "Success",
      });
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText,
      });
    }
  }
  async function update(path, data, { onSuccess, onError } = {}) {
    try {
      let response = (res = await api.patch(path + "/" + data.id, data));
      Notify.create({
        icon: "check",
        color: "secondary",
        message: onSuccess || "Success",
      });
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText + ". " + (onError || ""),
      });
    }
  }
  async function replace(path, data, { onSuccess, onError } = {}) {
    try {
      let response = (res = await api.put(path + "/" + data.id, data));
      Notify.create({
        icon: "check",
        color: "secondary",
        message: onSuccess || "Success",
      });
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText + ". " + (onError || ""),
      });
    }
  }
  async function remove(path, data, { onSuccess, onError } = {}) {
    try {
      let response = await api.delete(path + "/" + data?.id);
      Notify.create({
        icon: "check",
        color: "secondary",
        message: onSuccess || "Success",
      });
      return response.data;
    } catch (e) {
      console.log(e);
      Notify.create({
        icon: "error",
        color: "red",
        message: e.response.statusText + ". " + (onError || ""),
      });
    }
  }
  return {
    post,
    get,
    delete: remove,
    put: replace,
    patch: update,
    search,
  };
}
