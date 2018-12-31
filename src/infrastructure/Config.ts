export class CONFIG {
  static MAPBOX_ACCESS_TOKEN: string = "";
  static config = (configuration: any): void => {
    Object.assign(CONFIG, configuration);
  };
}
