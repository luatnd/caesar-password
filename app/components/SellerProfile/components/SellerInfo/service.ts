import React, {useCallback, useMemo} from "react";
import {updateSeller} from "../../service";

export function useSellerInfo(sellerId: number) {
  // only do persist if value has been changed
  const lastVal = useMemo(() => ({
    name: "",
    phone: "",
    desc: "",
  }), [sellerId])

  const persistName = useCallback((e: any) => {
    const v = e.target.value;
    if (v == lastVal.name) return;
    lastVal.name = v
    console.log('{persistName} v: ', v);
    updateSeller(sellerId, {name: v}).then()
  }, [sellerId])

  const persistPhone = useCallback((e: any) => {
    const v = e.target.value;
    if (v == lastVal.phone) return;
    lastVal.phone = v
    console.log('{persistPhone} v: ', v);
    updateSeller(sellerId, {phone: v}).then()
  }, [sellerId])

  const persistDesc = useCallback((e: any) => {
    const v = e.target.value;
    if (v == lastVal.desc) return;
    lastVal.desc = v
    console.log('{persistDesc} v: ', v);
    updateSeller(sellerId, {description: v}).then()
  }, [sellerId])

  return {
    persistName,
    persistPhone,
    persistDesc,
  }
}
