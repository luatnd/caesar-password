import {makeAutoObservable} from "mobx";

class SortSideBar {
  visible: boolean = false
  sellerId: number = 0

  constructor() {
    makeAutoObservable(this)
  }

  setVisible(v: boolean) {
    this.visible = v
  }

  setStates(data: any) {
    this.visible = data.visible
    this.sellerId = data.sellerId
  }
}

export const SortSideBarStore = new SortSideBar();
