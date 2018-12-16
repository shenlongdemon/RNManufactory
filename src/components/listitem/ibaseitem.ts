export default interface IBaseItem<TItem> {
    item: TItem;
    index: number;
    onClickHandle?: ((item: any, index: number) => void) | null;
}
