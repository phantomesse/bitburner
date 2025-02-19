class Data {
  constructor() {
    if (new.target === Data) {
      throw new Error('cannot instantiate abstract class');
    }
  }

  writeDataList(ns, dataList) {}
}
