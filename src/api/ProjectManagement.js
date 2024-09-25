import request from "@/utils/request";

export function getListData(params) {
  return request({
    url: "/moproject/project/queryProject",
    method: "get",
    params,
  });
}
