import { RouterContext } from "../deps.ts";

export function dateFormat(format: string, date: Date) {
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return format;
}

export async function getAllRequestParams(ctx: RouterContext) {
  let params = {};
  for (const pair of ctx.request.searchParams.entries()) {
    params[pair[0]] = pair[1];
  }
  const body = await ctx.request.body();
  if (body.type === "form") {
    for (const pair of (body.value as URLSearchParams).entries()) {
      params[pair[0]] = pair[1];
    }
  } else if (body.type === "json") {
    params = { ...params, ...body.value };
  }
  return { ...ctx.params, ...params };
}
