export function decodeMessage(error) {
  //console.log(error);
  try {
    let e = String(error);
    let pattern = new RegExp(/"details"\:"[^"]+"/gim);
    let detail = e.match(pattern);

    const details = JSON.parse(`{${detail}}`);
    pattern = new RegExp(/"message"\:"[^"]+"/gim);
    detail = e.match(pattern);
    let message = JSON.parse(`{${detail}}`);

    pattern = new RegExp(/"status"\:"[^"]+"/gim);
    detail = e.match(pattern);
    let status = JSON.parse(`{${detail}}`);

    return { ...details, ...message, ...status };
  } catch (err) {
    return { message: error?.message || error };
  }
}
