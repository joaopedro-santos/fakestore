export class MenuController {
  public toggle(_menuId?: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public close(_menuId?: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
